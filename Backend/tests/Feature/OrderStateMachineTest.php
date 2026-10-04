<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use Exception;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderStateMachineTest extends TestCase
{
    use RefreshDatabase;

    private function createOrder(string $status = 'pending', string $paymentStatus = 'pending'): Order
    {
        $user = User::factory()->create();
        return Order::create([
            'user_id' => $user->id,
            'total' => 100,
            'currency' => 'XOF',
            'status' => $status,
            'payment_status' => $paymentStatus,
            'shipping_address' => json_encode(['city' => 'Test']),
            'billing_address' => json_encode(['city' => 'Test']),
            'payment_method' => 'moneroo'
        ]);
    }

    public function test_allows_valid_status_transitions()
    {
        $order = $this->createOrder('pending');
        
        $order->update(['status' => 'confirmed']);
        $this->assertEquals('confirmed', $order->fresh()->status);

        $order->update(['status' => 'processing']);
        $this->assertEquals('processing', $order->fresh()->status);

        $order->update(['status' => 'shipped']);
        $this->assertEquals('shipped', $order->fresh()->status);

        $order->update(['status' => 'delivered']);
        $this->assertEquals('delivered', $order->fresh()->status);
    }

    public function test_prevents_invalid_status_transitions()
    {
        $order = $this->createOrder('delivered');
        
        $this->expectException(Exception::class);
        $this->expectExceptionMessage('Invalid status transition');
        
        $order->update(['status' => 'pending']);
    }

    public function test_allows_cancellation_from_valid_states()
    {
        $order = $this->createOrder('pending');
        $order->update(['status' => 'cancelled']);
        $this->assertEquals('cancelled', $order->fresh()->status);
    }

    public function test_prevents_cancellation_from_shipped_state()
    {
        $order = $this->createOrder('shipped');
        
        $this->expectException(Exception::class);
        $this->expectExceptionMessage('Invalid status transition');
        
        $order->update(['status' => 'cancelled']);
    }

    public function test_prevents_changes_to_cancelled_orders()
    {
        $order = $this->createOrder('cancelled');
        
        $this->expectException(Exception::class);
        $this->expectExceptionMessage('Invalid status transition');
        
        $order->update(['status' => 'pending']);
    }

    public function test_allows_valid_payment_status_transitions()
    {
        $order = $this->createOrder('pending', 'pending');
        
        $order->update(['payment_status' => 'paid']);
        $this->assertEquals('paid', $order->fresh()->payment_status);
    }

    public function test_prevents_invalid_payment_status_transitions()
    {
        $order = $this->createOrder('pending', 'paid');
        
        $this->expectException(Exception::class);
        $this->expectExceptionMessage('Invalid payment_status transition');
        
        $order->update(['payment_status' => 'pending']);
    }
}
