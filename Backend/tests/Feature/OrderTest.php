<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\Promotion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_order_with_server_total_and_stock_snapshot(): void
    {
        $user = User::factory()->create();
        $product = $this->createProduct(['price' => 100.00, 'stock_quantity' => 10]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/orders', $this->payload($product, 2));

        $response->assertStatus(201)
            ->assertJsonPath('order.total', '200.00')
            ->assertJsonPath('order.subtotal', '200.00')
            ->assertJsonPath('order.shipping_amount', '0.00')
            ->assertJsonPath('order.order_items.0.unit_price', '100.00')
            ->assertJsonPath('order.order_items.0.line_total', '200.00');

        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
            'total' => 200.00,
            'payment_method' => 'card',
        ]);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock_quantity' => 8,
        ]);
    }

    public function test_total_includes_shipping_and_promotion(): void
    {
        $user = User::factory()->create();
        $product = $this->createProduct(['price' => 50.00, 'stock_quantity' => 5]);

        Promotion::create([
            'code' => 'WELCOME10',
            'type' => 'percentage',
            'value' => 10,
            'starts_at' => now()->subDay(),
            'expires_at' => now()->addDay(),
            'is_active' => true,
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/orders', $this->payload($product, 1, [
            'promotion_code' => 'WELCOME10',
        ]));

        $response->assertStatus(201)
            ->assertJsonPath('order.subtotal', '50.00')
            ->assertJsonPath('order.shipping_amount', '5.99')
            ->assertJsonPath('order.discount_amount', '5.00')
            ->assertJsonPath('order.total', '50.99')
            ->assertJsonPath('order.promotion_code', 'WELCOME10');
    }

    public function test_rejects_order_when_stock_is_insufficient(): void
    {
        $user = User::factory()->create();
        $product = $this->createProduct(['price' => 25.00, 'stock_quantity' => 1]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/orders', $this->payload($product, 2));

        $response->assertStatus(422);
        $this->assertDatabaseCount('orders', 0);
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock_quantity' => 1,
        ]);
    }

    public function test_second_order_cannot_reuse_reserved_stock(): void
    {
        $firstUser = User::factory()->create();
        $secondUser = User::factory()->create();
        $product = $this->createProduct(['price' => 30.00, 'stock_quantity' => 1]);

        Sanctum::actingAs($firstUser);
        $this->postJson('/api/orders', $this->payload($product, 1))->assertStatus(201);

        Sanctum::actingAs($secondUser);
        $this->postJson('/api/orders', $this->payload($product, 1))->assertStatus(422);

        $this->assertDatabaseCount('orders', 1);
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock_quantity' => 0,
        ]);
    }

    public function test_cancelled_order_restores_stock(): void
    {
        $user = User::factory()->create();
        $product = $this->createProduct(['price' => 30.00, 'stock_quantity' => 3]);

        Sanctum::actingAs($user);
        $orderId = $this->postJson('/api/orders', $this->payload($product, 2))->json('id');

        $this->postJson("/api/orders/{$orderId}/cancel")->assertOk();

        $this->assertDatabaseHas('orders', [
            'id' => $orderId,
            'status' => 'cancelled',
        ]);
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock_quantity' => 3,
        ]);
    }

    private function createProduct(array $overrides = []): Product
    {
        $category = Category::create(['name' => 'Fashion', 'is_active' => true]);

        return Product::create(array_merge([
            'name' => 'Test Item',
            'description' => 'Test Description',
            'price' => 100.00,
            'category_id' => $category->id,
            'stock_quantity' => 10,
            'sku' => 'TEST-' . uniqid(),
            'is_active' => true,
        ], $overrides));
    }

    private function payload(Product $product, int $quantity, array $overrides = []): array
    {
        return array_merge([
            'shipping_address' => [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'street' => '123 Main St',
                'city' => 'Dakar',
                'country' => 'Senegal',
            ],
            'billing_address' => [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'street' => '123 Main St',
                'city' => 'Dakar',
                'country' => 'Senegal',
            ],
            'payment_method' => 'card',
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price' => 1,
                ],
            ],
        ], $overrides);
    }
}
