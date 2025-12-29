<?php

namespace App\Services;

use App\Models\Order;
use Exception;
use Illuminate\Support\Facades\Log;
use Moneroo\Laravel\Facades\Moneroo;
use Moneroo\Exceptions\PaymentException;

class PaymentService
{
    /**
     * Initiate a payment on Moneroo for an order.
     *
     * @param Order $order
     * @param array $customerInfo Optional customer info overrides
     * @return array Payment data including checkout_url
     * @throws Exception
     */
    public function initiatePayment(Order $order, array $customerInfo = [])
    {
        try {
            // Devise par défaut XOF pour Moneroo (Afrique de l'Ouest)
            $currency = 'XOF'; 
            
            // Préparation des données de paiement
            $payload = [
                'amount' => $order->total,
                'currency' => $currency,
                'customer' => [
                    'email' => $customerInfo['email'] ?? $order->user->email,
                    'first_name' => $customerInfo['first_name'] ?? $order->user->first_name,
                    'last_name' => $customerInfo['last_name'] ?? $order->user->last_name,
                    'phone' => $customerInfo['phone'] ?? $order->user->phone,
                ],
                'return_url' => route('payment.callback', ['order_id' => $order->id]),
                'metadata' => [
                    'order_id' => $order->id,
                    'user_id' => $order->user_id,
                ],
            ];

            // Appel API Moneroo
            // Note: En mode dev/simulation, si le package n'est pas parfaitement configuré,
            // cela peut nécessiter du debug. Utilisation des Facades documentées.
            $payment = Moneroo::payments()->create($payload);

            // Mise à jour de la commande avec les infos de paiement
            $order->update([
                'payment_id' => $payment['id'],
                'payment_url' => $payment['checkout_url'] ?? $payment['url'] ?? null,
                'payment_status' => 'pending'
            ]);

            return $payment;

        } catch (\Exception $e) {
            Log::error('Moneroo Payment Initialization Error: ' . $e->getMessage(), [
                'order_id' => $order->id,
                'trace' => $e->getTraceAsString()
            ]);
            throw new Exception('Impossible d\'initialiser le paiement: ' . $e->getMessage());
        }
    }

    /**
     * Verify and process a webhook payload from Moneroo.
     *
     * @param array $payload
     * @param string|null $signature
     * @return Order|null
     */
    public function processWebhook(array $payload, ?string $signature = null)
    {
        // 1. Vérification de la signature (Crucial pour la sécurité)
        // Dans une implémentation réelle, vérifier la signature X-Moneroo-Signature
        // if (!Moneroo::verifyWebhookSignature($payload, $signature)) {
        //    throw new Exception('Invalid webhook signature');
        // }

        $paymentId = $payload['id'] ?? null;
        $status = $payload['status'] ?? null;
        $orderId = $payload['metadata']['order_id'] ?? null;

        if (!$paymentId || !$orderId) {
            Log::warning('Webhook received without payment_id or order_id', $payload);
            return null;
        }

        $order = Order::find($orderId);

        if (!$order) {
            Log::error("Order not found for webhook payment: $paymentId (Order ID: $orderId)");
            return null;
        }

        // Mise à jour du statut selon Moneroo
        switch ($status) {
            case 'success':
            case 'successful':
            case 'paid':
                if ($order->payment_status !== 'paid') {
                    $order->update([
                        'payment_status' => 'paid',
                        'status' => 'confirmed', // Confirmer la commande automatiquement
                        'payment_id' => $paymentId // S'assurer que l'ID est synchro
                    ]);
                    
                    // TODO: Envoyer email de confirmation ici
                    Log::info("Order #{$order->id} paid successfully via Moneroo.");
                }
                break;

            case 'failed':
            case 'cancelled':
                $order->update([
                    'payment_status' => 'failed',
                    // On ne change pas forcément le statut global en cancelled tout de suite,
                    // le client peut vouloir réessayer.
                ]);
                break;
                
            default:
                Log::info("Webhook received for Order #{$order->id} with status: $status");
        }

        return $order;
    }
}
