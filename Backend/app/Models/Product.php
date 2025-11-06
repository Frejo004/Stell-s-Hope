<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'type',
        'price',
        'stock_quantity',
        'category_id',
        'images',
        'is_active',
        'is_featured',
        'is_bestseller',
        'sku',
        'weight',
        'dimensions'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'stock_quantity' => 'integer',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'is_bestseller' => 'boolean',
        'weight' => 'decimal:2'
    ];

    public function getImagesAttribute($value)
    {
        if (is_string($value)) {
            // Premier décodage
            $firstDecode = json_decode($value, true);
            
            // Si c'est encore une chaîne, décoder à nouveau (double échappement)
            if (is_string($firstDecode)) {
                $secondDecode = json_decode($firstDecode, true);
                return is_array($secondDecode) ? $secondDecode : [];
            }
            
            return is_array($firstDecode) ? $firstDecode : [];
        }
        
        return is_array($value) ? $value : [];
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function wishlist()
    {
        return $this->hasMany(Wishlist::class);
    }

    public function cart()
    {
        return $this->hasMany(Cart::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function getAvailableAttributesAttribute()
    {
        if ($this->type !== 'variable') {
            return [];
        }

        $attributes = [];
        foreach ($this->variants as $variant) {
            foreach ($variant->attributes as $attribute) {
                if (!isset($attributes[$attribute->id])) {
                    $attributes[$attribute->id] = [
                        'id' => $attribute->id,
                        'name' => $attribute->name,
                        'values' => []
                    ];
                }
                if (!in_array($attribute->pivot->value, $attributes[$attribute->id]['values'])) {
                    $attributes[$attribute->id]['values'][] = $attribute->pivot->value;
                }
            }
        }

        return array_values($attributes);
    }
}