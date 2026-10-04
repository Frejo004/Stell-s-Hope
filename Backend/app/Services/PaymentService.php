<?php

namespace App\Services;

use App\Models\Order;
use Exception;
use Illuminate\Support\Facades\Log;
use Moneroo\Laravel\Facades\PaymentFacade as Moneroo;
use Moneroo\Exceptions\PaymentException;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use App\Mail\OrderConfirmation;
use App\Models\WebhookEvent;
use Carbon\Carbon;

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
            // Facade PaymentFacade expose probablement create() directement
            $payment = Moneroo::create($payload);

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
        $secret = config('moneroo.secretKey');
        
        if ($signature) {
            $computedSignature = hash_hmac('sha512', json_encode($payload), $secret);
            if (!hash_equals($signature, $computedSignature)) {
                Log::error('Invalid Moneroo webhook signature received.');
                throw new Exception('Invalid webhook signature');
            }
        } elseif (config('app.env') !== 'local') {
            // La signature est obligatoire partout sauf en local
            throw new Exception('Missing webhook signature');
        }

        // Anti-replay : Générer un event_id unique (on utilise le hachage du payload si Moneroo ne fournit pas d'event id)
        $eventId = $payload['event_id'] ?? hash('sha256', json_encode($payload));

        // Anti-replay : Ignorer si l'événement a déjà été traité
        if (WebhookEvent::where('event_id', $eventId)->exists()) {
            Log::info("Webhook event already processed: {$eventId}");
            return null; // Doublon ignoré silencieusement
        }

        // Anti-replay : Refuser les événements trop anciens (si un timestamp est fourni)
        $timestamp = $payload['timestamp'] ?? $payload['created_at'] ?? null;
        if ($timestamp) {
            $eventTime = Carbon::parse($timestamp);
            if ($eventTime->diffInMinutes(now()) > 5) { // Tolérance de 5 minutes
                Log::warning("Webhook event too old: {$eventId}");
                throw new Exception('Webhook event too old');
            }
        }

        $paymentId = $payload['id'] ?? null;
        $status = $payload['status'] ?? null;
        $orderId = $payload['metadata']['order_id'] ?? null;
        $amount = (float) ($payload['amount'] ?? 0);
        $currency = $payload['currency'] ?? null;

        if (!$paymentId || !$orderId) {
            Log::warning('Webhook received without payment_id or order_id', $payload);
            throw new Exception('Missing payment_id or order_id');
        }

        $order = Order::find($orderId);

        if (!$order) {
            Log::error("Order not found for webhook payment: $paymentId (Order ID: $orderId)");
            throw new Exception('Order not found');
        }

        // Vérification de l'identifiant de paiement
        if ($order->payment_id && $order->payment_id !== $paymentId) {
            Log::error("Payment ID mismatch. Expected {$order->payment_id}, got {$paymentId}");
            throw new Exception('Payment ID mismatch');
        }

        // Vérification du montant
        if (abs((float)$order->total - $amount) > 0.01) {
            Log::error("Amount mismatch. Expected {$order->total}, got {$amount}");
            throw new Exception('Amount mismatch');
        }

        // Vérification de la devise
        $expectedCurrency = $order->currency ?? 'XOF';
        if (strtoupper($currency) !== strtoupper($expectedCurrency)) {
            Log::error("Currency mismatch. Expected {$expectedCurrency}, got {$currency}");
            throw new Exception('Currency mismatch');
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
                    
                    // Envoyer email de confirmation
                    try {
                        Mail::to($order->user->email)->send(new OrderConfirmation($order));
                        Log::info("Order confirmation email sent to {$order->user->email}");
                    } catch (\Exception $e) {
                         Log::error("Failed to send order confirmation email: " . $e->getMessage());
                    }

                    Log::info("Order #{$order->id} paid successfully via Moneroo.");
                }
                break;

            case 'failed':
            case 'cancelled':
                $this->markPaymentFailedAndRestoreStock($order);
                break;
                
            default:
                Log::info("Webhook received for Order #{$order->id} with status: $status");
        }

        // Enregistrer l'événement comme traité
        WebhookEvent::create([
            'event_id' => $eventId,
            'payload' => $payload
        ]);

        return $order;
    }

    private function markPaymentFailedAndRestoreStock(Order $order): void
    {
        DB::transaction(function () use ($order) {
            $lockedOrder = Order::whereKey($order->id)->lockForUpdate()->firstOrFail();

            if ($lockedOrder->payment_status === 'failed') {
                return;
            }

            $lockedOrder->load('orderItems.product');

            foreach ($lockedOrder->orderItems as $item) {
                if ($item->product) {
                    $item->product->increment('stock_quantity', $item->quantity);
                }
            }

            $lockedOrder->update([
                'payment_status' => 'failed',
                'status' => 'cancelled',
            ]);
        });
    }
}
