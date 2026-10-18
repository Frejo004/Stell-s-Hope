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
        if ($users->isEmpty()) {
            return;
        }

        $products = Product::where('is_active', true)->limit(50)->get();
        
        $luxuryComments = [
            'Une confection absolument sublime. Les finitions, le tombé du tissu et les coutures invisibles témoignent d\'un savoir-faire d\'exception.',
            'Pièce reçue dans un coffret parfumé magnifique avec son certificat. Coupe impeccable et élégance intemporelle.',
            'La qualité des matières est extraordinaire. Je l\'ai portée pour un gala et elle a fait l\'unanimité.',
            'Un vêtement d\'une rare préciosité. Les détails brodés à la main sont fascinants. Stell\'s Hope est à la hauteur de sa réputation.',
            'Très agréable à porter, le tissu respire le luxe discret. La livraison a été particulièrement rapide et soignée.',
            'Un tombé parfait, digne des plus grandes maisons de couture de l\'avenue Montaigne.',
            'Très beau produit, confort remarquable et allure sophistiquée. Je commanderai à nouveau sans hésitation.',
        ];

        foreach ($products as $product) {
            $count = min($users->count(), rand(2, 5));
            $selectedUsers = $users->random($count);

            foreach ($selectedUsers as $user) {
                // Éviter les doublons
                if (Review::where('user_id', $user->id)->where('product_id', $product->id)->exists()) {
                    continue;
                }

                $rating = rand(4, 5);
                $comment = $luxuryComments[array_rand($luxuryComments)];

                Review::create([
                    'user_id' => $user->id,
                    'product_id' => $product->id,
                    'rating' => $rating,
                    'comment' => $comment,
                    'is_approved' => true,
                    'status' => 'approved',
                ]);
            }
        }
    }
}