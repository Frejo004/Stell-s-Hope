<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Promotion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    private const FREE_SHIPPING_THRESHOLD = 100;
    private const SHIPPING_AMOUNT = 5.99;

    public function index(Request $request)
    {
        $orders = $request->user()->orders()->with('orderItems.product')->latest()->paginate(10);
        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $request->validate([
            'shipping_address' => 'required|array',
            'billing_address' => 'required|array',
            'payment_method' => 'required|string',
            'promotion_code' => 'sometimes|nullable|string|max:50',
            'items' => 'sometimes|array',
            'items.*.product_id' => 'required_with:items|exists:products,id',
            'items.*.quantity' => 'required_with:items|integer|min:1',
        ]);

        $user = $request->user();
        $itemsData = $this->requestedItems($request, $user->id);

        if (empty($itemsData)) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        $idempotencyKey = $request->header('Idempotency-Key');
        if ($idempotencyKey) {
            $existingOrder = Order::where('idempotency_key', $idempotencyKey)
                                  ->where('user_id', $user->id)
                                  ->with('orderItems.product')
                                  ->first();
            if ($existingOrder) {
                return response()->json([
                    'message' => 'Order already created (idempotent request)',
                    'id' => $existingOrder->id,
                    'order' => $existingOrder,
                ], 200);
            }
        }

        $order = null;

        DB::transaction(function () use ($request, $user, $itemsData, &$order, $idempotencyKey) {
            $preparedItems = [];
            $subtotal = 0.0;

            foreach ($itemsData as $item) {
                $product = Product::whereKey($item['product_id'])->lockForUpdate()->first();

                if (!$product || !$product->is_active) {
                    throw ValidationException::withMessages([
                        'items' => 'Un article du panier n est plus disponible.',
                    ]);
                }

                if ($product->stock_quantity < $item['quantity']) {
                    throw ValidationException::withMessages([
                        'items' => "Stock insuffisant pour {$product->name}.",
                    ]);
                }

                $unitPrice = (float) $product->price;
                $lineTotal = round($unitPrice * $item['quantity'], 2);
                $subtotal += $lineTotal;

                $preparedItems[] = [
                    'product' => $product,
                    'quantity' => $item['quantity'],
                    'unit_price' => $unitPrice,
                    'discount_amount' => 0,
                    'line_total' => $lineTotal,
                ];
            }

            $shippingAmount = $subtotal >= self::FREE_SHIPPING_THRESHOLD ? 0.0 : self::SHIPPING_AMOUNT;
            $promotion = $this->resolvePromotion($request->input('promotion_code'), $subtotal);
            $discountAmount = $promotion ? $this->calculateDiscount($promotion, $subtotal) : 0.0;
            $totalAmount = round(max(0, $subtotal + $shippingAmount - $discountAmount), 2);

            $order = Order::create([
                'user_id' => $user->id,
                'total' => $totalAmount,
                'subtotal' => round($subtotal, 2),
                'shipping_amount' => $shippingAmount,
                'discount_amount' => $discountAmount,
                'promotion_code' => $promotion?->code,
                'currency' => 'XOF',
                'status' => 'pending',
                'shipping_address' => $request->shipping_address,
                'billing_address' => $request->billing_address,
                'payment_method' => $request->payment_method,
                'idempotency_key' => $idempotencyKey,
            ]);

            foreach ($preparedItems as $item) {
                $product = $item['product'];

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $item['unit_price'],
                    'unit_price' => $item['unit_price'],
                    'discount_amount' => $item['discount_amount'],
                    'line_total' => $item['line_total'],
                ]);

                $product->decrement('stock_quantity', $item['quantity']);
            }

            if (!$request->has('items')) {
                Cart::where('user_id', $user->id)->delete();
            }
        });

        $order->load('orderItems.product');

        return response()->json([
            'message' => 'Order created successfully',
            'id' => $order->id,
            'order' => $order,
        ], 201);
    }

    public function show(Order $order)
    {
        if ($order->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $order->load('orderItems.product');
        return response()->json($order);
    }

    public function track(Order $order)
    {
        if ($order->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'order_id' => $order->id,
            'status' => $order->status,
            'created_at' => $order->created_at,
            'tracking_number' => $order->tracking_number ?? null,
        ]);
    }

    public function cancel(Order $order)
    {
        if ($order->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!in_array($order->status, ['pending', 'confirmed'])) {
            return response()->json(['message' => 'Cannot cancel this order'], 400);
        }

        DB::transaction(function () use ($order) {
            $lockedOrder = Order::whereKey($order->id)->lockForUpdate()->firstOrFail();

            if ($lockedOrder->status === 'cancelled') {
                return;
            }

            $lockedOrder->load('orderItems.product');

            foreach ($lockedOrder->orderItems as $item) {
                if ($item->product) {
                    $item->product->increment('stock_quantity', $item->quantity);
                }
            }

            $lockedOrder->update(['status' => 'cancelled']);
        });

        return response()->json(['message' => 'Order cancelled']);
    }

    public function trackPublic(Request $request)
    {
        $request->validate([
            'order_number' => 'required|string',
            'email' => 'required|email',
        ]);

        $order = Order::where('order_number', $request->order_number)
            ->whereHas('user', function ($query) use ($request) {
                $query->where('email', $request->email);
            })
            ->with(['orderItems.product'])
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Commande introuvable'], 404);
        }

        return response()->json([
            'id' => $order->id,
            'order_number' => $order->order_number,
            'status' => $order->status,
            'created_at' => $order->created_at,
            'tracking_number' => $order->tracking_number,
            'order_items' => $order->orderItems->map(fn ($item) => [
                'id' => $item->id,
                'quantity' => $item->quantity,
                'price' => $item->price,
                'product' => [
                    'id' => $item->product?->id,
                    'name' => $item->product?->name,
                    'images' => $item->product?->images ?? [],
                ],
            ]),
        ]);
    }

    private function requestedItems(Request $request, int $userId): array
    {
        if ($request->has('items') && !empty($request->items)) {
            return collect($request->items)
                ->map(fn ($item) => [
                    'product_id' => (int) $item['product_id'],
                    'quantity' => (int) $item['quantity'],
                ])
                ->values()
                ->all();
        }

        return Cart::where('user_id', $userId)
            ->get()
            ->map(fn (Cart $item) => [
                'product_id' => (int) $item->product_id,
                'quantity' => (int) $item->quantity,
            ])
            ->values()
            ->all();
    }

    private function resolvePromotion(?string $code, float $subtotal): ?Promotion
    {
        if (!$code) {
            return null;
        }

        $promotion = Promotion::where('code', strtoupper($code))
            ->where('is_active', true)
            ->where('starts_at', '<=', now())
            ->where('expires_at', '>=', now())
            ->where(function ($query) {
                $query->whereNull('max_uses')
                    ->orWhereColumn('used_count', '<', 'max_uses');
            })
            ->first();

        if (!$promotion || ($promotion->min_amount && $subtotal < (float) $promotion->min_amount)) {
            throw ValidationException::withMessages([
                'promotion_code' => 'Code promotionnel invalide.',
            ]);
        }

        return $promotion;
    }

    private function calculateDiscount(Promotion $promotion, float $subtotal): float
    {
        $discount = $promotion->type === 'percentage'
            ? $subtotal * ((float) $promotion->value / 100)
            : (float) $promotion->value;

        return round(min($subtotal, $discount), 2);
    }
}
