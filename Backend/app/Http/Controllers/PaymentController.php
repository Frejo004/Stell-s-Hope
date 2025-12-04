<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Moneroo\Laravel\Facades\PaymentFacade as MonerooPayment;

class PaymentController extends Controller
{
    public function initiate(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric',
            'currency' => 'required|string',
            'customer_email' => 'required|email',
            'customer_name' => 'nullable|string',
        ]);

        // Simulation de paiement pour les tests
        $paymentId = 'test_' . uniqid();
        
        $mockPayment = [
            'id' => $paymentId,
            'amount' => $request->amount,
            'currency' => $request->currency ?? 'USD',
            'status' => 'pending',
            'checkout_url' => 'https://checkout.moneroo.io/pay/' . $paymentId,
            'customer' => [
                'email' => $request->customer_email,
                'name' => $request->customer_name ?? 'Client',
            ],
            'created_at' => now()->toISOString(),
        ];

        return response()->json($mockPayment);
    }

    public function webhook(Request $request)
    {
        // Vérification de la signature du webhook recommandée ici
        // Moneroo envoie généralement une signature dans les headers

        $payload = $request->all();

        // Traiter le webhook (ex: mettre à jour le statut de la commande)
        // Log::info('Moneroo Webhook received', $payload);

        return response()->json(['status' => 'success']);
    }
    
    public function callback(Request $request)
    {
        // Page de retour après paiement
        return response()->json(['message' => 'Payment processed', 'data' => $request->all()]);
    }
}
