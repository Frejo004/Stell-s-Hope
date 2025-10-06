<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    public function index()
    {
        $orders = Order::with('user')
                      ->orderBy('created_at', 'desc')
                      ->paginate(20);
        
        return response()->json($orders);
    }

    public function show(Order $order)
    {
        $order->load('user');
        return response()->json($order);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled'
        ]);

        $order->update($validated);
        return response()->json($order);
    }
}