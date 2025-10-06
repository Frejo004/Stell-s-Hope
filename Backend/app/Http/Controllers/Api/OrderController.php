<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = $request->user()->orders()
                         ->orderBy('created_at', 'desc')
                         ->paginate(10);
        
        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'total' => 'required|numeric|min:0',
            'shipping_address' => 'required|array',
            'billing_address' => 'required|array'
        ]);

        $order = $request->user()->orders()->create([
            'total' => $validated['total'],
            'status' => 'pending',
            'shipping_address' => $validated['shipping_address'],
            'billing_address' => $validated['billing_address']
        ]);

        return response()->json($order, 201);
    }

    public function show(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        return response()->json($order);
    }

    public function track(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        return response()->json([
            'order' => $order,
            'status' => $order->status,
            'tracking_info' => 'Commande en cours de traitement'
        ]);
    }

    public function cancel(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Impossible d\'annuler cette commande'], 400);
        }

        $order->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Commande annulée']);
    }
}