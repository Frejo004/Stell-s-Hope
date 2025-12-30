<?php

namespace Tests\Feature\Api;

use App\Models\Product;
use App\Models\User;
use App\Models\Category;
use App\Models\Wishlist;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WishlistTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $product;

    protected function setUp(): void
    {
        parent::setUp();
        
        $category = Category::create([
            'name' => 'Fashion',
            'is_active' => true
        ]);

        $this->user = User::factory()->create();
        $this->product = Product::create([
            'name' => 'Test Item',
            'description' => 'A test item description',
            'price' => 100,
            'stock_quantity' => 10,
            'category_id' => $category->id,
            'is_active' => true,
            'sku' => 'TEST-' . uniqid()
        ]);
    }

    public function test_can_list_wishlist()
    {
        Wishlist::create([
            'user_id' => $this->user->id,
            'product_id' => $this->product->id
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
                         ->getJson('/api/wishlist');

        $response->assertStatus(200)
                 ->assertJsonCount(1);
    }

    public function test_can_add_to_wishlist()
    {
        $response = $this->actingAs($this->user, 'sanctum')
                         ->postJson('/api/wishlist', [
                             'product_id' => $this->product->id
                         ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('wishlists', [
            'user_id' => $this->user->id,
            'product_id' => $this->product->id
        ]);
    }

    public function test_can_remove_from_wishlist()
    {
        Wishlist::create([
            'user_id' => $this->user->id,
            'product_id' => $this->product->id
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
                         ->deleteJson("/api/wishlist/{$this->product->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('wishlists', [
            'user_id' => $this->user->id,
            'product_id' => $this->product->id
        ]);
    }

    public function test_can_toggle_wishlist()
    {
        // Add via toggle
        $response = $this->actingAs($this->user, 'sanctum')
                         ->postJson('/api/wishlist/toggle', [
                             'product_id' => $this->product->id
                         ]);
        $response->assertStatus(200)
                 ->assertJson(['in_wishlist' => true]);

        // Remove via toggle
        $response = $this->actingAs($this->user, 'sanctum')
                         ->postJson('/api/wishlist/toggle', [
                             'product_id' => $this->product->id
                         ]);
        $response->assertStatus(200)
                 ->assertJson(['in_wishlist' => false]);
    }
}
