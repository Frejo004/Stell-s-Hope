<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductAttribute extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'values',
    ];

    protected $casts = [
        'values' => 'array',
    ];

    public function variants()
    {
        return $this->belongsToMany(
            ProductVariant::class,
            'product_variant_attributes',
            'product_attribute_id',
            'product_variant_id'
        )->withPivot('value')->withTimestamps();
    }
}
