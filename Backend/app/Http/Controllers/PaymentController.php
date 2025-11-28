<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Moneroo\MonerooLaravel\Facades\Moneroo;

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

        $data = [
            'amount' => $request->amount,
            'currency' => $request->currency ?? 'XOF',
            'customer' => [
                'email' => $request->customer_email,
                'first_name' => $request->customer_name,
            ],
            'return_url' => route('payment.callback'), // Assurez-vous que cette route existe ou ajustez
        ];

        try {
            $payment = Moneroo::payments()->create($data);
            return response()->json($payment);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
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
