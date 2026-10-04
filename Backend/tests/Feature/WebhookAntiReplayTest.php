<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use App\Models\WebhookEvent;
use App\Services\PaymentService;
use Exception;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;
use Carbon\Carbon;

class WebhookAntiReplayTest extends TestCase
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

    private function createOrder(): Order
    {
        $user = User::factory()->create();
        return Order::create([
            'user_id' => $user->id,
            'payment_id' => 'pay_123',
            'total' => 100,
            'currency' => 'XOF',
            'status' => 'pending',
            'payment_status' => 'pending',
            'shipping_address' => json_encode(['city' => 'Test']),
            'billing_address' => json_encode(['city' => 'Test']),
            'payment_method' => 'moneroo'
        ]);
    }

    public function test_ignores_duplicate_webhook_events()
    {
        $order = $this->createOrder();

        $payload = [
            'id' => 'pay_123',
            'status' => 'success',
            'amount' => 100,
            'currency' => 'XOF',
            'metadata' => ['order_id' => $order->id]
        ];

        // Process first time
        $result1 = $this->paymentService->processWebhook($payload, $this->generateSignature($payload));
        $this->assertNotNull($result1);
        $this->assertEquals('paid', $result1->payment_status);

        // Verify event was logged
        $this->assertEquals(1, WebhookEvent::count());

        // Change order status manually to test if it's modified again
        // Actually, let's just make sure processWebhook returns null on duplicate
        $result2 = $this->paymentService->processWebhook($payload, $this->generateSignature($payload));
        $this->assertNull($result2);

        // Verify count is still 1
        $this->assertEquals(1, WebhookEvent::count());
    }

    public function test_rejects_old_webhook_events()
    {
        $order = $this->createOrder();

        $payload = [
            'id' => 'pay_123',
            'status' => 'success',
            'amount' => 100,
            'currency' => 'XOF',
            'metadata' => ['order_id' => $order->id],
            'timestamp' => Carbon::now()->subMinutes(10)->toIso8601String()
        ];

        $this->expectException(Exception::class);
        $this->expectExceptionMessage('Webhook event too old');
        
        $this->paymentService->processWebhook($payload, $this->generateSignature($payload));
    }
}
