<?php

namespace App\Http\Controllers;

use App\Exceptions\PaymentException;
use App\Models\Order;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class PaymentController extends Controller
{
    protected $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    public function initiate(Request $request)
    {
        $request->validate([
            'order_id' => 'required|integer|exists:orders,id',
        ]);

        $order = Order::findOrFail($request->order_id);

        if ($request->user()->id !== $order->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $paymentData = $this->paymentService->initiatePayment($order);
        } catch (PaymentException $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], $e->status);
        }

        return response()->json([
            'status' => 'success',
            'data' => $paymentData
        ]);
    }

    public function webhook(Request $request)
    {
        try {
            // Corps brut : la signature porte sur les octets reçus, pas sur le JSON décodé
            $this->paymentService->handleWebhook($request->getContent(), $request->header('X-Moneroo-Signature'));
        } catch (PaymentException $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], $e->status);
        } catch (Throwable $e) {
            Log::error('Webhook Error: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Webhook processing failed'], 500);
        }

        return response()->json(['status' => 'success']);
    }

    /**
     * Retour du client depuis la page Moneroo (?order_id=…&paymentId=…&paymentStatus=…).
     * Le statut transmis dans l'URL n'est pas fiable : on le relit auprès de Moneroo.
     */
    public function callback(Request $request)
    {
        $order = Order::find((int) $request->query('order_id'));
        $paymentId = $request->query('paymentId');

        if ($order && is_string($paymentId) && $order->payment_id && hash_equals($order->payment_id, $paymentId)) {
            try {
                $order = $this->paymentService->syncPayment($paymentId);
            } catch (Throwable $e) {
                // Le webhook prendra le relais ; on redirige selon l'état connu
                Log::warning("Payment callback sync failed for order #{$order->id}: " . $e->getMessage());
            }
        }

        $frontendUrl = rtrim(config('app.frontend_url'), '/');

        if ($order && $order->payment_status === 'paid' && !$order->needs_refund) {
            return redirect("{$frontendUrl}/order-confirmation/{$order->id}?status=success");
        }

        if ($order && $order->payment_status === 'pending' && $order->status !== 'cancelled') {
            return redirect("{$frontendUrl}/order-confirmation/{$order->id}?status=pending");
        }

        $query = http_build_query(array_filter([
            'error' => 'payment_failed',
            'order_id' => $order?->id,
        ]));

        return redirect("{$frontendUrl}/payment-error?{$query}");
    }
}
