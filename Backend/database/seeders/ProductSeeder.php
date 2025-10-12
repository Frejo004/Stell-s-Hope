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
            ['T-shirt Premium', 'T-shirt haute qualité', [19.99, 29.99, 39.99]],
            ['Polo Élégant', 'Polo raffiné', [39.99, 49.99, 59.99]],
            ['Chemise Oxford', 'Chemise classique', [59.99, 79.99, 99.99]],
            ['Jean Droit', 'Jean coupe droite', [79.99, 99.99, 119.99]],
            ['Pantalon Slim', 'Pantalon ajusté', [49.99, 69.99, 89.99]],
            ['Sweat Moderne', 'Sweat contemporain', [45.99, 65.99, 85.99]],
            ['Veste Casual', 'Veste décontractée', [89.99, 129.99, 169.99]],
            ['Costume Élégant', 'Ensemble complet', [199.99, 299.99, 399.99]],
            ['Short Été', 'Short léger', [29.99, 39.99, 49.99]],
            ['Pull Classique', 'Pull intemporel', [69.99, 89.99, 109.99]],
            ['Robe Soirée', 'Robe chic', [89.99, 149.99, 199.99]],
            ['Blouse Moderne', 'Blouse tendance', [79.99, 119.99, 159.99]],
            ['Jupe Midi', 'Jupe mi-longue', [49.99, 69.99, 89.99]],
            ['Pantalon Femme', 'Pantalon féminin', [69.99, 89.99, 109.99]],
            ['Top Fashion', 'Haut mode', [39.99, 59.99, 79.99]],
            ['Cardigan Doux', 'Gilet confortable', [99.99, 139.99, 179.99]],
            ['Robe Longue', 'Robe maxi', [79.99, 119.99, 159.99]],
            ['Blazer Chic', 'Veste structurée', [89.99, 129.99, 169.99]],
            ['Legging Pro', 'Legging technique', [34.99, 44.99, 54.99]],
            ['Combinaison Mode', 'Combinaison stylée', [109.99, 149.99, 189.99]],
            ['Sneakers Urban', 'Baskets urbaines', [79.99, 119.99, 159.99]],
            ['Bottes Cuir', 'Bottes élégantes', [129.99, 179.99, 229.99]],
            ['Sandales Été', 'Sandales confort', [39.99, 59.99, 79.99]],
            ['Escarpins Chic', 'Chaussures habillées', [89.99, 129.99, 169.99]],
            ['Sac Main', 'Sac à main élégant', [129.99, 189.99, 249.99]],
            ['Montre Design', 'Montre moderne', [199.99, 349.99, 499.99]],
            ['Écharpe Mode', 'Écharpe tendance', [29.99, 49.99, 69.99]],
            ['Ceinture Style', 'Ceinture fashion', [39.99, 59.99, 79.99]],
            ['Casquette Trend', 'Casquette moderne', [19.99, 29.99, 39.99]],
            ['Lunettes Fashion', 'Lunettes stylées', [49.99, 89.99, 129.99]]
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
                        'https://via.placeholder.com/400x400/000000/FFFFFF?text=' . urlencode($baseProduct[0]),
                        'https://via.placeholder.com/400x400/333333/FFFFFF?text=' . urlencode($color)
                    ])
                ]);
                
                $productCount++;
            }
        }
    }
}