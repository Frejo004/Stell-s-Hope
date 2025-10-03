<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $currentMonth = Carbon::now()->startOfMonth();
        $lastMonth = Carbon::now()->subMonth()->startOfMonth();

        // Statistiques principales
        $totalRevenue = Order::where('status', '!=', 'cancelled')->sum('total_amount');
        $totalOrders = Order::count();
        $totalCustomers = User::where('is_admin', false)->count();
        $averageOrderValue = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;

        // Tendances mensuelles
        $currentMonthRevenue = Order::where('created_at', '>=', $currentMonth)
                                  ->where('status', '!=', 'cancelled')
                                  ->sum('total_amount');
        
        $lastMonthRevenue = Order::whereBetween('created_at', [$lastMonth, $currentMonth])
                                ->where('status', '!=', 'cancelled')
                                ->sum('total_amount');

        $revenueGrowth = $lastMonthRevenue > 0 ? 
            (($currentMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100 : 0;

        // Commandes récentes
        $recentOrders = Order::with(['user', 'items.product'])
                            ->orderBy('created_at', 'desc')
                            ->limit(5)
                            ->get();

        // Produits populaires
        $topProducts = Product::withCount(['orderItems'])
                             ->orderBy('order_items_count', 'desc')
                             ->limit(5)
                             ->get();

        // Revenus mensuels (12 derniers mois)
        $monthlyRevenue = [];
        for ($i = 11; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $revenue = Order::whereYear('created_at', $month->year)
                           ->whereMonth('created_at', $month->month)
                           ->where('status', '!=', 'cancelled')
                           ->sum('total_amount');
            
            $monthlyRevenue[] = [
                'month' => $month->format('M Y'),
                'revenue' => $revenue
            ];
        }

        return response()->json([
            'stats' => [
                'total_revenue' => $totalRevenue,
                'total_orders' => $totalOrders,
                'total_customers' => $totalCustomers,
                'average_order_value' => round($averageOrderValue, 2),
                'revenue_growth' => round($revenueGrowth, 2)
            ],
            'recent_orders' => $recentOrders,
            'top_products' => $topProducts,
            'monthly_revenue' => $monthlyRevenue,
            'alerts' => [
                'low_stock' => Product::where('stock_quantity', '<', 10)->count(),
                'pending_orders' => Order::where('status', 'pending')->count(),
                'new_customers' => User::where('created_at', '>=', Carbon::now()->subDays(7))->count()
            ]
        ]);
    }

    public function revenueAnalytics(Request $request)
    {
        $period = $request->get('period', '30'); // days
        $startDate = Carbon::now()->subDays($period);

        $dailyRevenue = Order::where('created_at', '>=', $startDate)
                           ->where('status', '!=', 'cancelled')
                           ->selectRaw('DATE(created_at) as date, SUM(total_amount) as revenue')
                           ->groupBy('date')
                           ->orderBy('date')
                           ->get();

        return response()->json($dailyRevenue);
    }

    public function productAnalytics()
    {
        $categoryStats = Product::join('categories', 'products.category_id', '=', 'categories.id')
                               ->selectRaw('categories.name, COUNT(*) as product_count, AVG(products.price) as avg_price')
                               ->groupBy('categories.id', 'categories.name')
                               ->get();

        return response()->json($categoryStats);
    }

    public function customerAnalytics()
    {
        $customerSegments = [
            'new' => User::where('created_at', '>=', Carbon::now()->subDays(30))->count(),
            'active' => User::whereHas('orders', function($q) {
                $q->where('created_at', '>=', Carbon::now()->subDays(90));
            })->count(),
            'inactive' => User::whereDoesntHave('orders', function($q) {
                $q->where('created_at', '>=', Carbon::now()->subDays(90));
            })->count()
        ];

        return response()->json($customerSegments);
    }
}