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
        'price',
        'category_id',
        'type',
        'gender',
        'images',
        'sizes',
        'colors',
        'composition',
        'care_instructions',
        'stock_quantity',
        'is_active',
        'is_featured',
        'is_new',
        'is_bestseller',
        'discount_percentage'
    ];

    protected function casts(): array
    {
        return [
            'images' => 'array',
            'sizes' => 'array',
            'colors' => 'array',
            'price' => 'decimal:2',
            'discount_percentage' => 'decimal:2',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'is_new' => 'boolean',
            'is_bestseller' => 'boolean',
        ];
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function getAverageRatingAttribute()
    {
        return $this->reviews()->avg('rating') ?? 0;
    }

    public function getDiscountedPriceAttribute()
    {
        if ($this->discount_percentage > 0) {
            return $this->price * (1 - $this->discount_percentage / 100);
        }
        return $this->price;
    }
}