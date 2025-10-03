<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Créer un admin
        User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@stellshope.com',
            'password' => Hash::make('password'),
            'is_admin' => true,
            'is_active' => true,
        ]);

        // Créer des utilisateurs de test
        User::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'password' => Hash::make('password'),
            'phone' => '+33123456789',
            'is_admin' => false,
            'is_active' => true,
        ]);

        // Créer des catégories
        $categories = [
            ['name' => 'Homme', 'description' => 'Vêtements pour homme'],
            ['name' => 'Femme', 'description' => 'Vêtements pour femme'],
            ['name' => 'Unisexe', 'description' => 'Vêtements unisexe'],
            ['name' => 'Accessoires', 'description' => 'Accessoires de mode'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        // Créer des produits
        $products = [
            [
                'name' => 'T-shirt Premium Homme',
                'description' => 'T-shirt en coton bio de haute qualité',
                'price' => 29.99,
                'category_id' => 1,
                'stock_quantity' => 50,
                'is_featured' => true,
                'sku' => 'TSH-001'
            ],
            [
                'name' => 'Robe Élégante',
                'description' => 'Robe élégante pour toutes occasions',
                'price' => 89.99,
                'category_id' => 2,
                'stock_quantity' => 25,
                'is_bestseller' => true,
                'sku' => 'ROB-001'
            ],
            [
                'name' => 'Sweat à Capuche Unisexe',
                'description' => 'Sweat confortable pour tous',
                'price' => 49.99,
                'category_id' => 3,
                'stock_quantity' => 75,
                'is_featured' => true,
                'sku' => 'SWE-001'
            ],
            [
                'name' => 'Sac à Main Cuir',
                'description' => 'Sac à main en cuir véritable',
                'price' => 129.99,
                'category_id' => 4,
                'stock_quantity' => 15,
                'sku' => 'SAC-001'
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }

        // Créer des promotions de test
        \App\Models\Promotion::create([
            'code' => 'WELCOME10',
            'type' => 'percentage',
            'value' => 10,
            'min_amount' => 50,
            'max_uses' => 100,
            'starts_at' => now(),
            'expires_at' => now()->addMonth(),
        ]);

        \App\Models\Promotion::create([
            'code' => 'SAVE20',
            'type' => 'fixed',
            'value' => 20,
            'min_amount' => 100,
            'starts_at' => now(),
            'expires_at' => now()->addWeeks(2),
        ]);
    }
}