<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
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
            'items' => 'sometimes|array',
            'items.*.product_id' => 'required_with:items|exists:products,id',
            'items.*.quantity' => 'required_with:items|integer|min:1'
        ]);

        $user = $request->user();
        $itemsData = [];

        // 1. Récupération des items (Soit depuis Request, soit depuis DB Cart)
        if ($request->has('items') && !empty($request->items)) {
            // Mode "Items envoyés par le client" (ex: Guest ou Checkout direct)
            foreach ($request->items as $item) {
                $product = \App\Models\Product::find($item['product_id']);
                if ($product) {
                    $itemsData[] = [
                        'product_id' => $product->id,
                        'quantity' => $item['quantity'],
                        'price' => $product->price, // Toujours utiliser le prix DB
                        'product' => $product // Pour simplifier le calcul total plus bas si besoin
                    ];
                }
            }
        } else {
            // Mode "Panier synchronisé en BDD"
            $dbCartItems = Cart::where('user_id', $user->id)->with('product')->get();
            foreach ($dbCartItems as $item) {
                $itemsData[] = [
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->product->price,
                    'product' => $item->product
                ];
            }
        }

        if (empty($itemsData)) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        // 2. Calcul du total
        $totalAmount = collect($itemsData)->sum(function ($item) {
            return $item['price'] * $item['quantity'];
        });

        // 3. Création de la commande
        $order = null;
        
        DB::transaction(function () use ($request, $user, $itemsData, $totalAmount, &$order) {
            $order = Order::create([
                'user_id' => $user->id,
                'total' => $totalAmount,
                'status' => 'pending',
                'shipping_address' => $request->shipping_address,
                'billing_address' => $request->billing_address,
                'payment_method' => $request->payment_method
            ]);

            foreach ($itemsData as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price']
                ]);
            }

            // Si on utilisait le panier DB, on le vide
            if (!$request->has('items')) {
                Cart::where('user_id', $user->id)->delete();
            }
        });

        return response()->json(['message' => 'Order created successfully', 'id' => $order->id, 'order' => $order], 201);
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
            'tracking_number' => $order->tracking_number ?? null
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

        $order->update(['status' => 'cancelled']);
        return response()->json(['message' => 'Order cancelled']);
    }
}