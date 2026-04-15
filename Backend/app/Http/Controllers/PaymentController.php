<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Moneroo\Laravel\Facades\PaymentFacade as MonerooPayment;
use App\Services\PaymentService;
use Illuminate\Support\Facades\Log;

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
            'order_id' => 'required_without:amount|exists:orders,id',
            // Pour un checkout direct sans order préalable (optionnel)
            'amount' => 'required_without:order_id|numeric',
            'email' => 'required_without:order_id|email',
        ]);

        try {
            if ($request->has('order_id')) {
                $order = \App\Models\Order::findOrFail($request->order_id);
                // Vérifier que l'utilisateur est bien le propriétaire de la commande
                if ($request->user() && $request->user()->id !== $order->user_id) {
                    return response()->json(['message' => 'Unauthorized'], 403);
                }
            } else {
                // Création d'une commande temporaire ou gestion spécifique
                // Pour simplifier ici, on exige un order_id
                return response()->json(['message' => 'Order ID is required'], 400);
            }

            $paymentData = $this->paymentService->initiatePayment($order);

            return response()->json([
                'status' => 'success',
                'data' => $paymentData
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function webhook(Request $request)
    {
        $signature = $request->header('X-Moneroo-Signature');
        
        try {
            $this->paymentService->processWebhook($request->all(), $signature);
            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            Log::error('Webhook Error: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
    
    public function callback(Request $request)
    {
        $orderId = $request->get('order_id');
        $status = $request->get('status');
        
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
        
        // Correction #24 : route frontend correcte /order-confirmation/:id (avec tiret)
        if ($status === 'success' || $status === 'successful') {
             return redirect("$frontendUrl/order-confirmation/$orderId?status=success");
        }
        
        return redirect("$frontendUrl/checkout?error=payment_failed");
    }
}
