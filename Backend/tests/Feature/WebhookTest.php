<?php

namespace Tests\Feature;

use App\Mail\OrderConfirmation;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Models\WebhookEvent;
use App\Services\MonerooGateway;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Mail;
use Moneroo\Laravel\Exceptions\ServerErrorException;
use Tests\TestCase;

class WebhookTest extends TestCase
{
    use RefreshDatabase;

    private ?\Mockery\MockInterface $gatewayMock = null;

    private const SECRET = 'whsec_test';

    protected function setUp(): void
    {
        parent::setUp();
        Config::set('moneroo.webhookSecret', self::SECRET);
        Mail::fake();
    }

    public function test_rejects_missing_signature(): void
    {
        $this->sendWebhook($this->body('pay_123'), null)->assertStatus(403);
    }

    public function test_rejects_invalid_signature(): void
    {
        $this->sendWebhook($this->body('pay_123'), 'invalid-sig')->assertStatus(403);
    }

    public function test_rejects_signature_computed_with_another_algorithm(): void
    {
        $body = $this->body('pay_123');

        $this->sendWebhook($body, hash_hmac('sha512', $body, self::SECRET))->assertStatus(403);
    }

    public function test_rejects_webhook_when_secret_is_not_configured(): void
    {
        Config::set('moneroo.webhookSecret', null);
        $body = $this->body('pay_123');

        $this->sendWebhook($body, hash_hmac('sha256', $body, ''))->assertStatus(500);
    }

    public function test_signature_is_checked_on_raw_body(): void
    {
        $order = $this->createOrder();
        $this->mockVerify('pay_123', 'success');

        // Slashs non échappés et décimales : json_encode(json_decode()) produirait d'autres octets
        $body = '{"event":"payment.success","data":{"id":"pay_123","amount":25000.0,"status":"success","checkout_url":"https://checkout.moneroo.io/pay_123"}}';
        $this->assertNotSame($body, json_encode(json_decode($body, true)));

        $this->sendWebhook($body)->assertOk();
        $this->assertSame('paid', $order->fresh()->payment_status);
    }

    public function test_rejects_payload_without_payment_id(): void
    {
        $this->sendWebhook('{"event":"payment.success","data":{}}')->assertStatus(400);
    }

    public function test_unknown_payment_returns_not_found(): void
    {
        $this->gateway()->shouldReceive('verify')->never();

        $this->sendWebhook($this->body('pay_unknown'))->assertStatus(404);
    }

    public function test_successful_payment_confirms_order_and_sends_email(): void
    {
        $order = $this->createOrder();
        $this->mockVerify('pay_123', 'success');

        $this->sendWebhook($this->body('pay_123'))->assertOk();

        $order->refresh();
        $this->assertSame('paid', $order->payment_status);
        $this->assertSame('confirmed', $order->status);
        $this->assertFalse($order->needs_refund);
        Mail::assertSent(OrderConfirmation::class, 1);
    }

    public function test_status_comes_from_moneroo_api_not_from_payload(): void
    {
        $order = $this->createOrder();
        // Le payload prétend « success » mais l'API Moneroo dit « pending »
        $this->mockVerify('pay_123', 'pending');

        $this->sendWebhook($this->body('pay_123', 'success'))->assertOk();

        $this->assertSame('pending', $order->fresh()->payment_status);
        Mail::assertNothingSent();
    }

    public function test_rejects_amount_mismatch(): void
    {
        $order = $this->createOrder();
        $this->mockVerify('pay_123', 'success', amount: 100);

        $this->sendWebhook($this->body('pay_123'))->assertStatus(422);

        $this->assertSame('pending', $order->fresh()->payment_status);
        $this->assertSame(0, WebhookEvent::count());
    }

    public function test_rejects_currency_mismatch(): void
    {
        $order = $this->createOrder();
        $this->mockVerify('pay_123', 'success', currency: 'EUR');

        $this->sendWebhook($this->body('pay_123'))->assertStatus(422);

        $this->assertSame('pending', $order->fresh()->payment_status);
    }

    public function test_rejects_metadata_order_mismatch(): void
    {
        $order = $this->createOrder();
        $this->mockVerify('pay_123', 'success', metadataOrderId: (string) ($order->id + 1));

        $this->sendWebhook($this->body('pay_123'))->assertStatus(422);

        $this->assertSame('pending', $order->fresh()->payment_status);
    }

    public function test_failed_payment_cancels_order_and_restores_stock(): void
    {
        [$order, $product] = $this->createOrderWithStock(stockLeft: 3, quantity: 2);
        $this->mockVerify('pay_123', 'failed');

        $this->sendWebhook($this->body('pay_123', 'failed'))->assertOk();

        $order->refresh();
        $this->assertSame('failed', $order->payment_status);
        $this->assertSame('cancelled', $order->status);
        $this->assertSame(5, $product->fresh()->stock_quantity);
    }

    public function test_failed_payment_on_cancelled_order_does_not_restore_stock_twice(): void
    {
        [$order, $product] = $this->createOrderWithStock(stockLeft: 3, quantity: 2);
        $this->actingAs($order->user)->postJson("/api/orders/{$order->id}/cancel")->assertOk();
        $this->assertSame(5, $product->fresh()->stock_quantity);

        $this->mockVerify('pay_123', 'failed');
        $this->sendWebhook($this->body('pay_123', 'failed'))->assertOk();

        $this->assertSame(5, $product->fresh()->stock_quantity);
        $this->assertSame('failed', $order->fresh()->payment_status);
    }

    public function test_payment_on_cancelled_order_is_flagged_for_refund(): void
    {
        $order = $this->createOrder(['status' => 'cancelled']);
        $this->mockVerify('pay_123', 'success');

        $this->sendWebhook($this->body('pay_123'))->assertOk();

        $order->refresh();
        $this->assertSame('paid', $order->payment_status);
        $this->assertSame('cancelled', $order->status);
        $this->assertTrue($order->needs_refund);
        Mail::assertNothingSent();
    }

    public function test_duplicate_webhook_is_processed_once(): void
    {
        $order = $this->createOrder();
        $this->mockVerify('pay_123', 'success');
        $body = $this->body('pay_123');

        $this->sendWebhook($body)->assertOk();
        $this->sendWebhook($body)->assertOk();

        $this->assertSame(1, WebhookEvent::count());
        $this->assertSame('paid', $order->fresh()->payment_status);
        Mail::assertSent(OrderConfirmation::class, 1);
    }

    public function test_gateway_error_is_not_recorded_so_moneroo_can_retry(): void
    {
        $order = $this->createOrder();
        $this->gateway()->shouldReceive('verify')->once()->andThrow(new ServerErrorException('timeout'));

        $this->sendWebhook($this->body('pay_123'))
            ->assertStatus(502)
            ->assertJsonMissing(['message' => 'timeout']);

        $this->assertSame(0, WebhookEvent::count());
        $this->assertSame('pending', $order->fresh()->payment_status);
    }

    public function test_callback_redirects_according_to_verified_status(): void
    {
        Config::set('app.frontend_url', 'https://shop.test');
        $order = $this->createOrder();
        $this->mockVerify('pay_123', 'success');

        $this->get("/api/payment/callback?order_id={$order->id}&paymentId=pay_123&paymentStatus=success")
            ->assertRedirect("https://shop.test/order-confirmation/{$order->id}?status=success");

        $this->assertSame('paid', $order->fresh()->payment_status);
    }

    public function test_callback_ignores_status_from_query_string(): void
    {
        Config::set('app.frontend_url', 'https://shop.test');
        $order = $this->createOrder();
        $this->mockVerify('pay_123', 'failed');

        $this->get("/api/payment/callback?order_id={$order->id}&paymentId=pay_123&paymentStatus=success")
            ->assertRedirect("https://shop.test/payment-error?error=payment_failed&order_id={$order->id}");
    }

    public function test_callback_with_foreign_payment_id_does_not_sync(): void
    {
        Config::set('app.frontend_url', 'https://shop.test');
        $order = $this->createOrder();
        $this->gateway()->shouldReceive('verify')->never();

        $this->get("/api/payment/callback?order_id={$order->id}&paymentId=pay_other")
            ->assertRedirect("https://shop.test/order-confirmation/{$order->id}?status=pending");
    }

    private function sendWebhook(string $body, ?string $signature = 'auto')
    {
        $headers = ['CONTENT_TYPE' => 'application/json', 'HTTP_ACCEPT' => 'application/json'];
        if ($signature === 'auto') {
            $signature = hash_hmac('sha256', $body, self::SECRET);
        }
        if ($signature !== null) {
            $headers['HTTP_X_MONEROO_SIGNATURE'] = $signature;
        }

        return $this->call('POST', '/api/payment/webhook', [], [], [], $headers, $body);
    }

    private function body(string $paymentId, string $status = 'success'): string
    {
        return json_encode([
            'event' => "payment.{$status}",
            'data' => ['id' => $paymentId, 'amount' => 25000, 'currency' => 'XOF', 'status' => $status],
        ]);
    }

    private function mockVerify(string $paymentId, string $status, int $amount = 25000, string $currency = 'XOF', ?string $metadataOrderId = null): void
    {
        $this->gateway()->shouldReceive('verify')->with($paymentId)->andReturn((object) [
            'id' => $paymentId,
            'status' => $status,
            'amount' => $amount,
            'currency' => (object) ['code' => $currency],
            'metadata' => (object) array_filter(['order_id' => $metadataOrderId]),
        ]);
    }

    private function gateway(): \Mockery\MockInterface
    {
        return $this->gatewayMock ??= $this->mock(MonerooGateway::class);
    }

    private function createOrder(array $overrides = []): Order
    {
        $user = User::factory()->create();

        return Order::create(array_merge([
            'user_id' => $user->id,
            'payment_id' => 'pay_123',
            'total' => 25000,
            'currency' => 'XOF',
            'status' => 'pending',
            'payment_status' => 'pending',
            'shipping_address' => ['city' => 'Cotonou'],
            'billing_address' => ['city' => 'Cotonou'],
            'payment_method' => 'moneroo',
        ], $overrides));
    }

    /**
     * @return array{0: Order, 1: Product}
     */
    private function createOrderWithStock(int $stockLeft, int $quantity): array
    {
        $category = Category::create(['name' => 'Fashion', 'is_active' => true]);
        $product = Product::create([
            'name' => 'T-shirt',
            'description' => 'Coton',
            'price' => 12500,
            'category_id' => $category->id,
            'stock_quantity' => $stockLeft,
            'sku' => 'TS-' . uniqid(),
        ]);
        $order = $this->createOrder();
        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => $quantity,
            'price' => 12500,
            'unit_price' => 12500,
            'line_total' => 25000,
        ]);

        return [$order, $product];
    }
}
