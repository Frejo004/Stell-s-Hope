<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderIdempotencyTest extends TestCase
{
    use RefreshDatabase;

    public function test_order_creation_is_idempotent()
    {
        $user = User::factory()->create();
        $category = \App\Models\Category::create([
            'name' => 'Test Category',
            'slug' => 'test-category'
        ]);

        $product = Product::create([
            'name' => 'Test Product',
            'slug' => 'test-product',
            'description' => 'Test',
            'price' => 50,
            'stock_quantity' => 10,
            'category_id' => $category->id,
            'status' => 'active'
        ]);

        $payload = [
            'shipping_address' => ['city' => 'Test', 'country' => 'FR'],
            'billing_address' => ['city' => 'Test', 'country' => 'FR'],
            'payment_method' => 'card',
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 1,
                ]
            ]
        ];

        $idempotencyKey = 'idemp_test_123';

        $response1 = $this->actingAs($user)->postJson('/api/orders', $payload, [
            'Idempotency-Key' => $idempotencyKey
        ]);

        $response1->assertStatus(201);
        $orderId = $response1->json('order.id');

        // Second request with same key
        $response2 = $this->actingAs($user)->postJson('/api/orders', $payload, [
            'Idempotency-Key' => $idempotencyKey
        ]);

        $response2->assertStatus(200);
        $this->assertEquals('Order already created (idempotent request)', $response2->json('message'));
        $this->assertEquals($orderId, $response2->json('order.id'));

        // Verify only one order was created
        $this->assertEquals(1, $user->orders()->count());
    }

    public function test_payment_initiation_is_idempotent()
    {
        $user = User::factory()->create();
        $order = \App\Models\Order::create([
            'user_id' => $user->id,
            'total' => 100,
            'payment_status' => 'pending',
            'status' => 'pending',
            'payment_method' => 'moneroo',
            'currency' => 'XOF',
            'shipping_address' => json_encode(['city' => 'Test']),
            'billing_address' => json_encode(['city' => 'Test']),
            'payment_id' => 'pay_abc123',
            'payment_url' => 'https://checkout.moneroo.io/123'
        ]);

        $paymentService = new \App\Services\PaymentService();
        $result = $paymentService->initiatePayment($order);

        $this->assertEquals('pay_abc123', $result['id']);
        $this->assertEquals('https://checkout.moneroo.io/123', $result['checkout_url']);
    }
}
