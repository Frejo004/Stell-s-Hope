<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_order_with_total_amount()
    {
        // 1. Setup
        $user = User::factory()->create();
        $category = Category::create(['name' => 'Fashion', 'is_active' => true]);
        $product = Product::create([
            'name' => 'Test Item',
            'description' => 'Test Description',
            'price' => 100.00,
            'category_id' => $category->id,
            'stock_quantity' => 10,
            'sku' => 'TEST-001',
            'is_active' => true,
        ]);

        Sanctum::actingAs($user);

        $payload = [
            'shipping_address' => [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'street' => '123 Main St',
                'city' => 'Dakar',
                'country' => 'Senegal'
            ],
            'billing_address' => [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'street' => '123 Main St',
                'city' => 'Dakar',
                'country' => 'Senegal'
            ],
            'payment_method' => 'card',
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 2
                ]
            ]
        ];

        // 2. Action
        $response = $this->postJson('/api/orders', $payload);

        // 3. Assert
        $response->assertStatus(201);
        
        $order = $response->json('order');
        $this->assertEquals(200.00, $order['total_amount']);

        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
            'total_amount' => 200.00,
            'payment_method' => 'card'
        ]);
    }
}
