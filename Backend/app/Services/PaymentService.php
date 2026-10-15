<?php

namespace App\Services;

use App\Exceptions\PaymentException;
use App\Mail\OrderConfirmation;
use App\Models\Order;
use App\Models\WebhookEvent;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class PaymentService
{
    public function __construct(private readonly MonerooGateway $moneroo)
    {
    }

    /**
     * Initialise un paiement Moneroo pour une commande.
     *
     * @return array{id: string, payment_id: string, checkout_url: string}
     * @throws PaymentException
     */
    public function initiatePayment(Order $order): array
    {
        if ($order->payment_status === 'pending' && $order->payment_id && $order->payment_url) {
            return $this->paymentResponse($order);
        }

        if ($order->payment_status === 'paid' || $order->status === 'cancelled') {
            throw new PaymentException('Cette commande ne peut plus être payée.', 422);
        }

        $user = $order->user;

        try {
            // https://docs.moneroo.io/payments/standard-integration
            $payment = $this->moneroo->init([
                'amount' => $this->toGatewayAmount($order->total),
                'currency' => $order->currency ?? config('shop.currency'),
                'description' => "Commande {$order->order_number}",
                'customer' => [
                    'email' => $user->email,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                ],
                'return_url' => route('payment.callback', ['order_id' => $order->id]),
                // Moneroo n'accepte que des valeurs de type chaîne
                'metadata' => [
                    'order_id' => (string) $order->id,
                    'user_id' => (string) $order->user_id,
                ],
            ]);
        } catch (Throwable $e) {
            Log::error('Moneroo payment initialization failed', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);
            throw new PaymentException('Impossible d\'initialiser le paiement. Réessayez plus tard.', 502, $e);
        }

        $order->update([
            'payment_id' => $payment->id,
            'payment_url' => $payment->checkout_url,
            'payment_status' => 'pending',
        ]);

        return $this->paymentResponse($order);
    }

    /**
     * Traite un webhook Moneroo.
     *
     * Le webhook ne sert que de signal : le statut, le montant et la devise
     * sont relus auprès de l'API Moneroo (verify) avant toute mise à jour.
     *
     * @return Order|null null si l'événement a déjà été traité
     * @throws PaymentException
     */
    public function handleWebhook(string $rawBody, ?string $signature): ?Order
    {
        $secret = config('moneroo.webhookSecret');

        if (!$secret) {
            Log::critical('MONEROO_WEBHOOK_SECRET is not configured: webhook rejected.');
            throw new PaymentException('Webhook not configured', 500);
        }

        // HMAC-SHA256 du corps brut : ré-encoder le JSON changerait les octets signés
        if (!$signature || !hash_equals(hash_hmac('sha256', $rawBody, $secret), $signature)) {
            Log::warning('Invalid Moneroo webhook signature received.');
            throw new PaymentException('Invalid signature', 403);
        }

        $payload = json_decode($rawBody, true);
        $paymentId = is_array($payload) ? ($payload['data']['id'] ?? null) : null;

        if (!is_string($paymentId) || $paymentId === '') {
            throw new PaymentException('Invalid payload', 400);
        }

        // Moneroo renvoie le même corps à chaque nouvelle tentative
        $eventId = hash('sha256', $rawBody);

        if (WebhookEvent::where('event_id', $eventId)->exists()) {
            Log::info("Webhook event already processed: {$eventId}");
            return null;
        }

        try {
            return $this->syncPayment($paymentId, function () use ($eventId, $payload) {
                WebhookEvent::create(['event_id' => $eventId, 'payload' => $payload]);
            });
        } catch (UniqueConstraintViolationException) {
            // Même événement traité en parallèle par une autre requête
            return null;
        }
    }

    /**
     * Aligne la commande sur l'état réel du paiement chez Moneroo.
     * Idempotent : utilisé par le webhook et par le retour client (callback).
     *
     * @param callable|null $withinTransaction exécuté dans la transaction de mise à jour
     * @throws PaymentException
     */
    public function syncPayment(string $paymentId, ?callable $withinTransaction = null): Order
    {
        $order = Order::where('payment_id', $paymentId)->first();

        if (!$order) {
            Log::warning("No order found for Moneroo payment {$paymentId}");
            throw new PaymentException('Order not found', 404);
        }

        try {
            $payment = $this->moneroo->verify($paymentId);
        } catch (Throwable $e) {
            Log::error("Moneroo verification failed for payment {$paymentId}", ['error' => $e->getMessage()]);
            throw new PaymentException('Payment verification failed', 502, $e);
        }

        $status = $payment->status ?? null;
        $this->assertPaymentMatchesOrder($payment, $order);

        $confirmed = false;

        DB::transaction(function () use ($order, $status, $withinTransaction, &$confirmed) {
            if ($withinTransaction) {
                $withinTransaction();
            }

            $lockedOrder = Order::whereKey($order->id)->lockForUpdate()->firstOrFail();

            match ($status) {
                'success' => $confirmed = $this->markPaid($lockedOrder),
                'failed', 'cancelled' => $this->markFailedAndRestoreStock($lockedOrder),
                default => Log::info("Moneroo payment {$lockedOrder->payment_id} for order #{$lockedOrder->id} is {$status}"),
            };
        });

        $order->refresh();

        if ($confirmed) {
            $this->sendConfirmationEmail($order);
        }

        return $order;
    }

    /**
     * @throws PaymentException
     */
    private function assertPaymentMatchesOrder(object $payment, Order $order): void
    {
        $metadataOrderId = $payment->metadata->order_id ?? null;
        if ($metadataOrderId !== null && (string) $metadataOrderId !== (string) $order->id) {
            Log::critical("Moneroo payment {$order->payment_id}: metadata order_id {$metadataOrderId} does not match order #{$order->id}");
            throw new PaymentException('Order mismatch', 422);
        }

        if (($payment->status ?? null) !== 'success') {
            return;
        }

        $amount = (int) ($payment->amount ?? 0);
        if ($amount !== $this->toGatewayAmount($order->total)) {
            Log::critical("Amount mismatch for order #{$order->id}: expected {$order->total}, Moneroo reports {$amount}");
            throw new PaymentException('Amount mismatch', 422);
        }

        // Moneroo renvoie la devise sous forme d'objet ({code: "XOF", ...})
        $currency = is_object($payment->currency ?? null) ? ($payment->currency->code ?? null) : ($payment->currency ?? null);
        $expectedCurrency = $order->currency ?? config('shop.currency');
        if (!is_string($currency) || strtoupper($currency) !== strtoupper($expectedCurrency)) {
            Log::critical("Currency mismatch for order #{$order->id}: expected {$expectedCurrency}, Moneroo reports " . json_encode($currency));
            throw new PaymentException('Currency mismatch', 422);
        }
    }

    /**
     * @return bool true si la commande vient d'être confirmée
     */
    private function markPaid(Order $order): bool
    {
        if ($order->payment_status === 'paid') {
            return false;
        }

        if ($order->status === 'cancelled') {
            // Le client a payé une commande annulée entre-temps : l'encaissement
            // est réel, la commande reste annulée et doit être remboursée.
            $order->update(['payment_status' => 'paid', 'needs_refund' => true]);
            Log::critical("Order #{$order->id} was paid after cancellation: refund required.");
            return false;
        }

        $order->update(array_filter([
            'payment_status' => 'paid',
            'status' => $order->status === 'pending' ? 'confirmed' : null,
        ]));

        Log::info("Order #{$order->id} paid successfully via Moneroo.");

        return true;
    }

    private function markFailedAndRestoreStock(Order $order): void
    {
        if (in_array($order->payment_status, ['paid', 'failed', 'refunded'], true)) {
            return;
        }

        $changes = ['payment_status' => 'failed'];

        // Une commande déjà annulée a déjà rendu son stock
        if ($order->status !== 'cancelled') {
            $order->load('orderItems.product');
            foreach ($order->orderItems as $item) {
                $item->product?->increment('stock_quantity', $item->quantity);
            }
            $changes['status'] = 'cancelled';
        }

        $order->update($changes);
    }

    private function sendConfirmationEmail(Order $order): void
    {
        try {
            Mail::to($order->user->email)->send(new OrderConfirmation($order));
        } catch (Throwable $e) {
            Log::error("Failed to send order confirmation email for order #{$order->id}: " . $e->getMessage());
        }
    }

    private function toGatewayAmount($amount): int
    {
        // Le XOF n'a pas de subdivision : Moneroo attend un montant entier
        return (int) round((float) $amount, config('shop.currency_decimals'));
    }

    private function paymentResponse(Order $order): array
    {
        return [
            'id' => $order->payment_id,
            'payment_id' => $order->payment_id,
            'checkout_url' => $order->payment_url,
        ];
    }
}
