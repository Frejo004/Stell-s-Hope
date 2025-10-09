<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_users' => User::where('is_admin', false)->count(),
            'total_products' => Product::count(),
            'total_orders' => Order::count(),
            'total_revenue' => Order::where('status', 'completed')->sum('total'),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'low_stock_products' => Product::where('stock_quantity', '<', 10)->count(),
            'open_tickets' => Ticket::where('status', 'open')->count(),
            'recent_orders' => Order::with('user')->latest()->take(5)->get()
        ];

        return response()->json($stats);
    }

    public function revenueAnalytics()
    {
        $monthlyRevenue = Order::where('status', 'completed')
                              ->where('created_at', '>=', Carbon::now()->subMonths(12))
                              ->selectRaw('MONTH(created_at) as month, SUM(total) as revenue')
                              ->groupBy('month')
                              ->get();

        return response()->json($monthlyRevenue);
    }

    public function productAnalytics()
    {
        $topProducts = Product::withCount('orderItems')
                             ->orderBy('order_items_count', 'desc')
                             ->take(10)
                             ->get();

        return response()->json($topProducts);
    }

    public function customerAnalytics()
    {
        $newCustomers = User::where('is_admin', false)
                           ->where('created_at', '>=', Carbon::now()->subDays(30))
                           ->count();

        return response()->json(['new_customers' => $newCustomers]);
    }

    public function getCustomers()
    {
        $customers = User::where('is_admin', false)->latest()->paginate(10);
        return response()->json($customers);
    }
}