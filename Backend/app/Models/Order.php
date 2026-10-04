<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_number',
        'total',
        'subtotal',
        'shipping_amount',
        'discount_amount',
        'promotion_code',
        'currency',
        'status',
        'shipping_address',
        'billing_address',
        'payment_method',
        'payment_id',
        'payment_url',
        'payment_status',
        'idempotency_key'
    ];

    protected static function booted()
    {
        static::creating(function ($order) {
            if (empty($order->order_number)) {
                $order->order_number = 'CMD-' . date('Ymd') . '-' . strtoupper(uniqid());
            }
        });

        static::updating(function ($order) {
            // Status State Machine
            if ($order->isDirty('status')) {
                $oldStatus = $order->getOriginal('status');
                $newStatus = $order->status;

                $validTransitions = [
                    'pending' => ['confirmed', 'cancelled'],
                    'confirmed' => ['processing', 'cancelled'],
                    'processing' => ['shipped', 'cancelled'],
                    'shipped' => ['delivered'],
                    'delivered' => [],
                    'cancelled' => []
                ];

                if (isset($validTransitions[$oldStatus]) && !in_array($newStatus, $validTransitions[$oldStatus])) {
                    throw new \DomainException("Invalid status transition from {$oldStatus} to {$newStatus}");
                }
            }

            // Payment Status State Machine
            if ($order->isDirty('payment_status')) {
                $oldPaymentStatus = $order->getOriginal('payment_status');
                $newPaymentStatus = $order->payment_status;

                $validPaymentTransitions = [
                    'pending' => ['paid', 'failed'],
                    'failed' => ['pending', 'paid'],
                    'paid' => ['refunded'],
                    'refunded' => []
                ];

                if (isset($validPaymentTransitions[$oldPaymentStatus]) && !in_array($newPaymentStatus, $validPaymentTransitions[$oldPaymentStatus])) {
                    throw new \DomainException("Invalid payment_status transition from {$oldPaymentStatus} to {$newPaymentStatus}");
                }
            }
        });
    }

    protected $casts = [
        'total' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'shipping_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'shipping_address' => 'array',
        'billing_address' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
