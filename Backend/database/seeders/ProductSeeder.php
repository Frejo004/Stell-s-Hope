<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::all();
        
        $products = [
            // Homme
            ['T-shirt Basique', 'T-shirt en coton confortable', [19.99, 24.99, 29.99]],
            ['Polo Classique', 'Polo élégant pour toutes occasions', [39.99, 44.99, 49.99]],
            ['Chemise Business', 'Chemise professionnelle', [59.99, 69.99, 79.99]],
            ['Jean Slim', 'Jean moderne coupe ajustée', [79.99, 89.99, 99.99]],
            ['Pantalon Chino', 'Pantalon décontracté chic', [49.99, 59.99, 69.99]],
            ['Sweat à Capuche', 'Sweat confortable et chaud', [45.99, 55.99, 65.99]],
            ['Veste Bomber', 'Veste tendance urbaine', [89.99, 109.99, 129.99]],
            ['Costume Complet', 'Ensemble veste et pantalon', [199.99, 249.99, 299.99]],
            ['Short Sport', 'Short pour activités sportives', [29.99, 34.99, 39.99]],
            ['Pull Laine', 'Pull chaud en laine mérinos', [69.99, 79.99, 89.99]],
            
            // Femme
            ['Robe Cocktail', 'Robe élégante pour soirées', [89.99, 119.99, 149.99]],
            ['Blouse Soie', 'Blouse raffinée en soie', [79.99, 99.99, 119.99]],
            ['Jupe Plissée', 'Jupe moderne et féminine', [49.99, 59.99, 69.99]],
            ['Pantalon Tailleur', 'Pantalon professionnel', [69.99, 79.99, 89.99]],
            ['Top Dentelle', 'Haut délicat en dentelle', [39.99, 49.99, 59.99]],
            ['Cardigan Cachemire', 'Gilet doux et luxueux', [99.99, 129.99, 159.99]],
            ['Robe Maxi', 'Robe longue bohème', [79.99, 99.99, 119.99]],
            ['Blazer Femme', 'Veste structurée chic', [89.99, 109.99, 129.99]],
            ['Legging Sport', 'Legging technique fitness', [34.99, 39.99, 44.99]],
            ['Combinaison Élégante', 'Combinaison moderne', [109.99, 129.99, 149.99]],
            
            // Unisexe
            ['Hoodie Oversize', 'Sweat ample tendance', [55.99, 65.99, 75.99]],
            ['T-shirt Vintage', 'T-shirt style rétro', [24.99, 29.99, 34.99]],
            ['Jogger Confort', 'Pantalon de détente', [39.99, 49.99, 59.99]],
            ['Veste Teddy', 'Veste universitaire', [79.99, 99.99, 119.99]],
            ['Short Bermuda', 'Short mi-long décontracté', [34.99, 39.99, 44.99]],
            
            // Accessoires
            ['Sac à Dos Cuir', 'Sac élégant et pratique', [129.99, 159.99, 189.99]],
            ['Montre Classique', 'Montre intemporelle', [199.99, 299.99, 399.99]],
            ['Écharpe Laine', 'Écharpe chaude et douce', [29.99, 39.99, 49.99]],
            ['Ceinture Cuir', 'Ceinture de qualité', [39.99, 49.99, 59.99]],
            ['Casquette Baseball', 'Casquette sport urbain', [19.99, 24.99, 29.99]],
            ['Lunettes Soleil', 'Lunettes protection UV', [49.99, 69.99, 89.99]],
            ['Portefeuille Cuir', 'Portefeuille compact', [39.99, 49.99, 59.99]],
            ['Bijoux Fantaisie', 'Accessoires mode', [14.99, 19.99, 24.99]],
        ];

        $colors = ['Noir', 'Blanc', 'Gris', 'Bleu', 'Rouge', 'Vert', 'Beige', 'Marine', 'Bordeaux', 'Camel'];
        $materials = ['Coton', 'Polyester', 'Laine', 'Soie', 'Lin', 'Cuir', 'Denim', 'Cachemire'];
        
        $productCount = 0;
        
        foreach ($categories as $category) {
            $categoryProducts = array_slice($products, $productCount * 8, 8);
            
            foreach ($categoryProducts as $baseProduct) {
                foreach ($colors as $colorIndex => $color) {
                    if ($productCount >= 500) break 3;
                    
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
}