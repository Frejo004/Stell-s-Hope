<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Créer un admin
        User::create([
            'name' => 'Admin Stell\'s Hope',
            'email' => 'admin@stellshope.com',
            'password' => Hash::make('password'),
            'is_admin' => true,
            'email_verified_at' => now(),
        ]);

        // Créer des catégories
        $categories = [
            ['name' => 'Hauts', 'slug' => 'hauts', 'description' => 'T-shirts, chemises, pulls'],
            ['name' => 'Bas', 'slug' => 'bas', 'description' => 'Pantalons, jeans, shorts'],
            ['name' => 'Accessoires', 'slug' => 'accessoires', 'description' => 'Sacs, bijoux, chaussures'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        // Créer des produits de démonstration
        $products = [
            [
                'name' => 'T-shirt Premium Coton',
                'description' => 'T-shirt en coton bio de haute qualité',
                'price' => 29.99,
                'category_id' => 1,
                'type' => 'hauts',
                'gender' => 'unisexe',
                'images' => ['/images/tshirt1.jpg'],
                'sizes' => ['S', 'M', 'L', 'XL'],
                'colors' => ['blanc', 'noir', 'bleu'],
                'stock_quantity' => 50,
                'is_featured' => true,
                'is_new' => true,
            ],
            [
                'name' => 'Jean Slim Fit',
                'description' => 'Jean coupe slim en denim stretch',
                'price' => 79.99,
                'category_id' => 2,
                'type' => 'bas',
                'gender' => 'unisexe',
                'images' => ['/images/jean1.jpg'],
                'sizes' => ['28', '30', '32', '34', '36'],
                'colors' => ['bleu', 'noir'],
                'stock_quantity' => 30,
                'is_bestseller' => true,
            ],
            [
                'name' => 'Sac à Main Cuir',
                'description' => 'Sac à main en cuir véritable',
                'price' => 149.99,
                'category_id' => 3,
                'type' => 'accessoires',
                'gender' => 'femme',
                'images' => ['/images/sac1.jpg'],
                'sizes' => ['Unique'],
                'colors' => ['noir', 'marron', 'beige'],
                'stock_quantity' => 20,
                'is_featured' => true,
                'discount_percentage' => 15,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}