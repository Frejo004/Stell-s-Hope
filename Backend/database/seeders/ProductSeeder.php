<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Créer les catégories si elles n'existent pas
        $categoryNames = [
            'Vêtements Homme', 'Vêtements Femme', 'Chaussures', 'Accessoires', 'Sport & Fitness',
            'Bijoux', 'Maroquinerie', 'Électronique', 'Maison & Décoration', 'Beauté & Cosmétiques',
            'Enfants', 'Vintage & Rétro'
        ];
        
        foreach ($categoryNames as $categoryName) {
            Category::firstOrCreate(['name' => $categoryName], [
                'description' => 'Catégorie ' . $categoryName,
                'is_active' => true
            ]);
        }
        
        $categories = Category::all();
        
        $products = [
            ['T-shirt Premium', 'T-shirt haute qualité', [13000, 19500, 26000]],
            ['Polo Élégant', 'Polo raffiné', [26000, 33000, 39500]],
            ['Chemise Oxford', 'Chemise classique', [39500, 52500, 65500]],
            ['Jean Droit', 'Jean coupe droite', [52500, 65500, 78500]],
            ['Pantalon Slim', 'Pantalon ajusté', [33000, 46000, 59000]],
            ['Sweat Moderne', 'Sweat contemporain', [30000, 43500, 56500]],
            ['Veste Casual', 'Veste décontractée', [59000, 85500, 111500]],
            ['Costume Élégant', 'Ensemble complet', [131000, 197000, 262500]],
            ['Short Été', 'Short léger', [19500, 26000, 33000]],
            ['Pull Classique', 'Pull intemporel', [46000, 59000, 72000]],
            ['Robe Soirée', 'Robe chic', [59000, 98500, 131000]],
            ['Blouse Moderne', 'Blouse tendance', [52500, 78500, 105000]],
            ['Jupe Midi', 'Jupe mi-longue', [33000, 46000, 59000]],
            ['Pantalon Femme', 'Pantalon féminin', [46000, 59000, 72000]],
            ['Top Fashion', 'Haut mode', [26000, 39500, 52500]],
            ['Cardigan Doux', 'Gilet confortable', [65500, 92000, 118000]],
            ['Robe Longue', 'Robe maxi', [52500, 78500, 105000]],
            ['Blazer Chic', 'Veste structurée', [59000, 85500, 111500]],
            ['Legging Pro', 'Legging technique', [23000, 29500, 36000]],
            ['Combinaison Mode', 'Combinaison stylée', [72000, 98500, 124500]],
            ['Sneakers Urban', 'Baskets urbaines', [52500, 78500, 105000]],
            ['Bottes Cuir', 'Bottes élégantes', [85500, 118000, 151000]],
            ['Sandales Été', 'Sandales confort', [26000, 39500, 52500]],
            ['Escarpins Chic', 'Chaussures habillées', [59000, 85500, 111500]],
            ['Sac Main', 'Sac à main élégant', [85500, 124500, 164000]],
            ['Montre Design', 'Montre moderne', [131000, 229500, 328000]],
            ['Écharpe Mode', 'Écharpe tendance', [19500, 33000, 46000]],
            ['Ceinture Style', 'Ceinture fashion', [26000, 39500, 52500]],
            ['Casquette Trend', 'Casquette moderne', [13000, 19500, 26000]],
            ['Lunettes Fashion', 'Lunettes stylées', [33000, 59000, 85500]]
        ];

        $colors = ['Noir', 'Blanc', 'Gris', 'Bleu', 'Rouge', 'Vert', 'Beige', 'Marine', 'Bordeaux', 'Camel', 'Rose', 'Violet'];
        $materials = ['Coton', 'Polyester', 'Laine', 'Soie', 'Lin', 'Cuir', 'Denim', 'Cachemire', 'Viscose', 'Élasthanne'];
        
        $productCount = 0;
        
        // Créer 300 produits
        while ($productCount < 300) {
            foreach ($categories as $category) {
                if ($productCount >= 300) break;
                
                $baseProduct = $products[array_rand($products)];
                $color = $colors[array_rand($colors)];
                $material = $materials[array_rand($materials)];
                $prices = $baseProduct[2];
                $price = $prices[array_rand($prices)];
                
                Product::create([
                    'name' => $baseProduct[0] . ' ' . $color,
                    'description' => $baseProduct[1] . ' en ' . $material . '. Couleur: ' . $color,
                    'price' => $price,
                    'category_id' => $category->id,
                    'stock_quantity' => rand(5, 100),
                    'is_active' => rand(0, 10) > 1,
                    'is_featured' => rand(0, 10) > 7,
                    'is_bestseller' => rand(0, 10) > 8,
                    'sku' => strtoupper(substr($category->name, 0, 3)) . '-' . str_pad($productCount + 1, 4, '0', STR_PAD_LEFT),
                    'weight' => rand(100, 2000) / 100,
                    'images' => json_encode([
                        'https://picsum.photos/400/400?random=' . ($productCount + 1),
                        'https://picsum.photos/400/400?random=' . ($productCount + 1000)
                    ])
                ]);
                
                $productCount++;
            }
        }
    }
}