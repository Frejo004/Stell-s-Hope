<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Order::with(['user', 'orderItems']);
            
            if ($request->has('search') && $request->search) {
                $query->where('id', 'like', '%' . $request->search . '%');
            }
            
            if ($request->has('status') && $request->status) {
                $query->where('status', $request->status);
            }
            
            $orders = $query->orderBy('id', 'desc')->paginate(20);
            
            return response()->json($orders);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Order $order)
    {
        try {
            $order->load(['user', 'orderItems.product']);
            return response()->json($order);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,shipped,delivered,cancelled'
        ]);

        $order->update($validated);
        return response()->json($order);
    }

    public function stats()
    {
        $stats = [
            'pending' => Order::where('status', 'pending')->count(),
            'confirmed' => Order::where('status', 'confirmed')->count(),
            'shipped' => Order::where('status', 'shipped')->count(),
            'delivered' => Order::where('status', 'delivered')->count(),
            'cancelled' => Order::where('status', 'cancelled')->count(),
        ];

        return response()->json($stats);
    }
}