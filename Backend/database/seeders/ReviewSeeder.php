<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Review;
use App\Models\User;
use App\Models\Product;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('is_admin', false)->get();
        $products = Product::where('is_active', true)->limit(100)->get();
        
        $comments = [
            'Excellent produit, très satisfait de mon achat !',
            'Qualité au rendez-vous, je recommande vivement.',
            'Bon rapport qualité-prix, conforme à mes attentes.',
            'Produit correct mais sans plus.',
            'Déçu de la qualité, ne correspond pas à la description.',
            'Parfait ! Exactement ce que je cherchais.',
            'Très bonne qualité, livraison rapide.',
            'Produit moyen, j\'ai vu mieux ailleurs.',
            'Super ! Je rachèterai sans hésiter.',
            'Qualité décevante pour le prix.',
        ];

        foreach ($products as $product) {
            $reviewCount = rand(0, 8);
            $reviewedUsers = $users->random($reviewCount);

            foreach ($reviewedUsers as $user) {
                $rating = rand(1, 5);
                $comment = $rating >= 4 ? $comments[rand(0, 6)] : $comments[rand(7, 9)];

                Review::create([
                    'user_id' => $user->id,
                    'product_id' => $product->id,
                    'rating' => $rating,
                    'comment' => $comment,
                    'is_approved' => rand(0, 10) > 2,
                ]);
            }
        }
    }
}