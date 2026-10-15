<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\Promotion;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ConvertPricesToXofTest extends TestCase
{
    use RefreshDatabase;

    public function test_converts_catalog_and_fixed_promotions(): void
    {
        $category = Category::create(['name' => 'Fashion', 'is_active' => true]);
        $product = Product::create([
            'name' => 'T-shirt',
            'description' => 'Coton',
            'price' => 10.00,
            'category_id' => $category->id,
            'stock_quantity' => 5,
            'sku' => 'TS-1',
        ]);
        $fixed = Promotion::create([
            'code' => 'SAVE20', 'type' => 'fixed', 'value' => 20, 'min_amount' => 100,
            'starts_at' => now(), 'expires_at' => now()->addDay(),
        ]);
        $percentage = Promotion::create([
            'code' => 'WELCOME10', 'type' => 'percentage', 'value' => 10, 'min_amount' => null,
            'starts_at' => now(), 'expires_at' => now()->addDay(),
        ]);

        $this->artisan('shop:convert-prices-to-xof')
            ->expectsConfirmation("Convertir tous les prix avec le taux 655.957 ? Cette opération ne doit être lancée qu'une fois.", 'yes')
            ->assertSuccessful();

        // 10 € x 655,957 = 6 559,57 -> arrondi au multiple de 5
        $this->assertEquals(6560, (float) $product->fresh()->price);
        $this->assertEquals(13120, (float) $fixed->fresh()->value);
        $this->assertEquals(65595, (float) $fixed->fresh()->min_amount);
        $this->assertEquals(10, (float) $percentage->fresh()->value);
        $this->assertNull($percentage->fresh()->min_amount);
    }

    public function test_dry_run_does_not_change_prices(): void
    {
        $category = Category::create(['name' => 'Fashion', 'is_active' => true]);
        $product = Product::create([
            'name' => 'T-shirt',
            'description' => 'Coton',
            'price' => 10.00,
            'category_id' => $category->id,
            'stock_quantity' => 5,
            'sku' => 'TS-2',
        ]);

        $this->artisan('shop:convert-prices-to-xof', ['--dry-run' => true])->assertSuccessful();

        $this->assertEquals(10, (float) $product->fresh()->price);
    }
}
