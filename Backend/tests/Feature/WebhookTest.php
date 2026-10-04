<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use App\Services\PaymentService;
use Exception;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class WebhookTest extends TestCase
{
    use RefreshDatabase;

    private PaymentService $paymentService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->paymentService = new PaymentService();
        Config::set('moneroo.secretKey', 'test-secret');
    }

    private function generateSignature(array $payload): string
    {
        return hash_hmac('sha512', json_encode($payload), 'test-secret');
    }

    public function test_rejects_missing_signature_in_production()
    {
        Config::set('app.env', 'production');
        $this->expectException(Exception::class);
        $this->expectExceptionMessage('Missing webhook signature');
        $this->paymentService->processWebhook(['status' => 'success'], null);
    }

    public function test_rejects_invalid_signature()
    {
        $this->expectException(Exception::class);
        $this->expectExceptionMessage('Invalid webhook signature');
        $this->paymentService->processWebhook(['status' => 'success'], 'invalid-sig');
    }

    public function test_rejects_missing_payment_id()
    {
        $payload = [
            'status' => 'success',
            'metadata' => ['order_id' => 1]
        ];
        $this->expectException(Exception::class);
        $this->expectExceptionMessage('Missing payment_id or order_id');
        $this->paymentService->processWebhook($payload, $this->generateSignature($payload));
    }

    public function test_rejects_payment_id_mismatch()
    {
        $user = User::factory()->create();
        $order = Order::create(['user_id' => $user->id, 'payment_id' => 'pay_123', 'total' => 100, 'status' => 'pending', 'payment_status' => 'pending', 'shipping_address' => json_encode(['city' => 'Test']), 'billing_address' => json_encode(['city' => 'Test']), 'payment_method' => 'moneroo']);

        $payload = [
            'id' => 'pay_456',
            'status' => 'success',
            'amount' => 100,
            'currency' => 'XOF',
            'metadata' => ['order_id' => $order->id]
        ];

        $this->expectException(Exception::class);
        $this->expectExceptionMessage('Payment ID mismatch');
        $this->paymentService->processWebhook($payload, $this->generateSignature($payload));
    }

    public function test_rejects_amount_mismatch()
    {
        $user = User::factory()->create();
        $order = Order::create(['user_id' => $user->id, 'payment_id' => 'pay_123', 'total' => 100, 'status' => 'pending', 'payment_status' => 'pending', 'shipping_address' => json_encode(['city' => 'Test']), 'billing_address' => json_encode(['city' => 'Test']), 'payment_method' => 'moneroo']);

        $payload = [
            'id' => 'pay_123',
            'status' => 'success',
            'amount' => 50,
            'currency' => 'XOF',
            'metadata' => ['order_id' => $order->id]
        ];

        $this->expectException(Exception::class);
        $this->expectExceptionMessage('Amount mismatch');
        $this->paymentService->processWebhook($payload, $this->generateSignature($payload));
    }

    public function test_rejects_currency_mismatch()
    {
        $user = User::factory()->create();
        $order = Order::create(['user_id' => $user->id, 'payment_id' => 'pay_123', 'total' => 100, 'currency' => 'XOF', 'status' => 'pending', 'payment_status' => 'pending', 'shipping_address' => json_encode(['city' => 'Test']), 'billing_address' => json_encode(['city' => 'Test']), 'payment_method' => 'moneroo']);

        $payload = [
            'id' => 'pay_123',
            'status' => 'success',
            'amount' => 100,
            'currency' => 'EUR',
            'metadata' => ['order_id' => $order->id]
        ];

        $this->expectException(Exception::class);
        $this->expectExceptionMessage('Currency mismatch');
        $this->paymentService->processWebhook($payload, $this->generateSignature($payload));
    }

    public function test_processes_valid_webhook()
    {
        $user = User::factory()->create();
        $order = Order::create(['user_id' => $user->id, 'payment_id' => 'pay_123', 'total' => 100, 'currency' => 'XOF', 'payment_status' => 'pending', 'status' => 'pending', 'shipping_address' => json_encode(['city' => 'Test']), 'billing_address' => json_encode(['city' => 'Test']), 'payment_method' => 'moneroo']);

        $payload = [
            'id' => 'pay_123',
            'status' => 'success',
            'amount' => 100,
            'currency' => 'XOF',
            'metadata' => ['order_id' => $order->id]
        ];

        $result = $this->paymentService->processWebhook($payload, $this->generateSignature($payload));
        
        $this->assertNotNull($result);
        $this->assertEquals('paid', $result->payment_status);
        $this->assertEquals('confirmed', $result->status);
    }
}
