<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\Category;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'revenue' => Order::sum('total') ?? 0,
            'orders' => Order::count(),
            'customers' => User::where('is_admin', false)->count(),
            'average_order' => Order::avg('total') ?? 0
        ];

        $categories = Category::withCount('products')->get();
        
        $recentOrders = Order::with('user')
                           ->orderBy('created_at', 'desc')
                           ->limit(5)
                           ->get();

        $topProducts = Product::orderBy('created_at', 'desc')
                             ->limit(5)
                             ->get();

        return response()->json([
            'stats' => $stats,
            'categories' => $categories,
            'recent_orders' => $recentOrders,
            'top_products' => $topProducts
        ]);
    }

    public function getCustomers()
    {
        $customers = User::where('is_admin', false)
                        ->withCount('orders')
                        ->withSum('orders', 'total')
                        ->get()
                        ->map(function ($user) {
                            return [
                                'id' => $user->id,
                                'name' => $user->first_name . ' ' . $user->last_name,
                                'email' => $user->email,
                                'phone' => $user->phone ?? 'Non renseigné',
                                'orders' => $user->orders_count,
                                'total' => number_format($user->orders_sum_total ?? 0, 2) . '€',
                                'status' => $user->orders_sum_total > 500 ? 'vip' : 'active',
                                'joined' => $user->created_at->format('Y-m-d')
                            ];
                        });

        $stats = [
            'total' => $customers->count(),
            'active' => $customers->where('status', 'active')->count(),
            'vip' => $customers->where('status', 'vip')->count(),
            'totalOrders' => $customers->sum('orders')
        ];

        return response()->json([
            'customers' => $customers,
            'stats' => $stats
        ]);
    }
}