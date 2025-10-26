<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProductAttribute;

class ProductAttributesSeeder extends Seeder
{
    public function run()
    {
        $attributes = [
            [
                'name' => 'Taille',
                'values' => json_encode(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
            ],
            [
                'name' => 'Couleur',
                'values' => json_encode(['Noir', 'Blanc', 'Rouge', 'Bleu', 'Vert', 'Jaune', 'Rose', 'Gris', 'Beige']),
            ],
            [
                'name' => 'Matière',
                'values' => json_encode(['Coton', 'Polyester', 'Laine', 'Soie', 'Lin', 'Cuir', 'Daim']),
            ],
        ];

        foreach ($attributes as $attribute) {
            ProductAttribute::create($attribute);
        }
    }
}
