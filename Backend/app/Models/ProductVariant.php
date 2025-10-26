<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'sku',
        'price',
        'stock_quantity',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'stock_quantity' => 'integer',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function attributes()
    {
        return $this->belongsToMany(
            ProductAttribute::class,
            'product_variant_attributes',
            'product_variant_id',
            'product_attribute_id'
        )->withPivot('value')->withTimestamps();
    }

    public function getAttributesArrayAttribute()
    {
        $result = [];
        foreach ($this->attributes as $attribute) {
            $result[$attribute->id] = $attribute->pivot->value;
        }
        return $result;
    }
}
