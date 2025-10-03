<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AdminOrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['user', 'items.product']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('order_number', 'like', '%' . $search . '%')
                  ->orWhereHas('user', function($userQuery) use ($search) {
                      $userQuery->where('first_name', 'like', '%' . $search . '%')
                               ->orWhere('last_name', 'like', '%' . $search . '%')
                               ->orWhere('email', 'like', '%' . $search . '%');
                  });
            });
        }

        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $orders = $query->orderBy('created_at', 'desc')
                       ->paginate($request->get('per_page', 15));

        return response()->json($orders);
    }

    public function show(Order $order)
    {
        return response()->json($order->load(['user', 'items.product']));
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,processing,shipped,delivered,cancelled'
        ]);

        $order->update([
            'status' => $request->status,
            'status_updated_at' => now()
        ]);

        // Ajouter un tracking number si l'ordre est expédié
        if ($request->status === 'shipped' && !$order->tracking_number) {
            $order->update([
                'tracking_number' => 'TRK-' . time() . '-' . $order->id,
                'shipped_at' => now()
            ]);
        }

        return response()->json($order);
    }

    public function stats()
    {
        $stats = [
            'total' => Order::count(),
            'pending' => Order::where('status', 'pending')->count(),
            'confirmed' => Order::where('status', 'confirmed')->count(),
            'processing' => Order::where('status', 'processing')->count(),
            'shipped' => Order::where('status', 'shipped')->count(),
            'delivered' => Order::where('status', 'delivered')->count(),
            'cancelled' => Order::where('status', 'cancelled')->count(),
        ];

        $revenueStats = [
            'today' => Order::whereDate('created_at', today())
                           ->where('status', '!=', 'cancelled')
                           ->sum('total_amount'),
            'this_week' => Order::whereBetween('created_at', [
                               Carbon::now()->startOfWeek(),
                               Carbon::now()->endOfWeek()
                           ])
                           ->where('status', '!=', 'cancelled')
                           ->sum('total_amount'),
            'this_month' => Order::whereMonth('created_at', now()->month)
                                ->where('status', '!=', 'cancelled')
                                ->sum('total_amount'),
        ];

        return response()->json([
            'order_stats' => $stats,
            'revenue_stats' => $revenueStats
        ]);
    }

    public function bulkUpdate(Request $request)
    {
        $request->validate([
            'order_ids' => 'required|array',
            'status' => 'required|in:pending,confirmed,processing,shipped,delivered,cancelled'
        ]);

        Order::whereIn('id', $request->order_ids)
             ->update([
                 'status' => $request->status,
                 'status_updated_at' => now()
             ]);

        return response()->json(['message' => 'Orders updated successfully']);
    }

    public function export(Request $request)
    {
        $query = Order::with(['user', 'items.product']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $orders = $query->get();

        $csvData = [];
        $csvData[] = [
            'Order Number',
            'Customer',
            'Email',
            'Status',
            'Total Amount',
            'Created At',
            'Items'
        ];

        foreach ($orders as $order) {
            $items = $order->items->map(function($item) {
                return $item->product->name . ' (x' . $item->quantity . ')';
            })->implode(', ');

            $csvData[] = [
                $order->order_number,
                $order->user->first_name . ' ' . $order->user->last_name,
                $order->user->email,
                $order->status,
                $order->total_amount,
                $order->created_at->format('Y-m-d H:i:s'),
                $items
            ];
        }

        $filename = 'orders_export_' . date('Y-m-d_H-i-s') . '.csv';
        
        return response()->streamDownload(function() use ($csvData) {
            $file = fopen('php://output', 'w');
            foreach ($csvData as $row) {
                fputcsv($file, $row);
            }
            fclose($file);
        }, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }
}