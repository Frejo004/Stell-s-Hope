<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\Ticket;
use App\Models\Category;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // Statistiques principales avec comparaison mois précédent
        $currentMonth = Carbon::now()->startOfMonth();
        $previousMonth = Carbon::now()->subMonth()->startOfMonth();
        
        $currentRevenue = Order::where('status', 'delivered')
            ->where('created_at', '>=', $currentMonth)
            ->sum('total_amount');
        $previousRevenue = Order::where('status', 'delivered')
            ->whereBetween('created_at', [$previousMonth, $currentMonth])
            ->sum('total_amount');
        $revenueChange = $previousRevenue > 0 ? round((($currentRevenue - $previousRevenue) / $previousRevenue) * 100, 1) : 0;
        
        $currentOrders = Order::where('created_at', '>=', $currentMonth)->count();
        $previousOrders = Order::whereBetween('created_at', [$previousMonth, $currentMonth])->count();
        $ordersChange = $previousOrders > 0 ? round((($currentOrders - $previousOrders) / $previousOrders) * 100, 1) : 0;
        
        $currentCustomers = User::where('is_admin', false)->where('created_at', '>=', $currentMonth)->count();
        $previousCustomers = User::where('is_admin', false)->whereBetween('created_at', [$previousMonth, $currentMonth])->count();
        $customersChange = $previousCustomers > 0 ? round((($currentCustomers - $previousCustomers) / $previousCustomers) * 100, 1) : 0;
        
        $currentAvgOrder = Order::where('created_at', '>=', $currentMonth)->avg('total_amount') ?? 0;
        $previousAvgOrder = Order::whereBetween('created_at', [$previousMonth, $currentMonth])->avg('total_amount') ?? 0;
        $avgOrderChange = $previousAvgOrder > 0 ? round((($currentAvgOrder - $previousAvgOrder) / $previousAvgOrder) * 100, 1) : 0;
        
        // Données mensuelles pour le graphique
        $monthlyRevenue = [];
        for ($i = 3; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $revenue = Order::where('status', 'delivered')
                ->whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->sum('total_amount');
            $orders = Order::whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->count();
            $prevMonth = $month->copy()->subMonth();
            $prevRevenue = Order::where('status', 'delivered')
                ->whereYear('created_at', $prevMonth->year)
                ->whereMonth('created_at', $prevMonth->month)
                ->sum('total_amount');
            $growth = $prevRevenue > 0 ? round((($revenue - $prevRevenue) / $prevRevenue) * 100) : 0;
            
            $monthlyRevenue[] = [
                'month' => $month->format('M'),
                'revenue' => $revenue,
                'orders' => $orders,
                'growth' => $growth
            ];
        }
        
        $stats = [
            'revenue' => $currentRevenue,
            'revenue_change' => ($revenueChange >= 0 ? '+' : '') . $revenueChange . '%',
            'orders' => $currentOrders,
            'orders_change' => ($ordersChange >= 0 ? '+' : '') . $ordersChange . '%',
            'customers' => User::where('is_admin', false)->count(),
            'customers_change' => ($customersChange >= 0 ? '+' : '') . $customersChange . '%',
            'average_order' => $currentAvgOrder,
            'average_order_change' => ($avgOrderChange >= 0 ? '+' : '') . $avgOrderChange . '%'
        ];
        
        $quickStats = [
            'active_promotions' => 0,
            'shipping_methods' => 0,
            'payment_methods' => 0,
            'pending_reviews' => 0,
            'support_tickets' => Ticket::where('status', 'open')->count(),
            'low_stock' => Product::where('stock_quantity', '<', 10)->count()
        ];
        
        $categoryStats = Category::withCount('products')->get()->map(function($category, $index) {
            $colors = ['bg-blue-500', 'bg-pink-500', 'bg-purple-500', 'bg-green-500'];
            $totalProducts = Category::withCount('products')->get()->sum('products_count');
            return [
                'name' => $category->name,
                'sales' => $category->products_count,
                'percentage' => $totalProducts > 0 ? round(($category->products_count / $totalProducts) * 100) : 0,
                'color' => $colors[$index % count($colors)]
            ];
        });
        
        $topProductsData = Product::where('is_active', true)
            ->take(5)
            ->get()
            ->map(function($product) {
                return [
                    'name' => $product->name,
                    'sales' => 0,
                    'revenue' => '0€'
                ];
            });
        
        $totalOrders = Order::count();
        $performance = [
            'conversion' => $totalOrders > 0 ? min(round(($totalOrders / 1000) * 100), 100) : 0,
            'satisfaction' => 0
        ];
        
        $visitors = 1000;
        $orders = Order::count();
        $payments = Order::where('status', 'delivered')->count();
        
        $salesFunnel = [
            ['name' => 'Visiteurs', 'value' => $visitors, 'percentage' => 100, 'color' => 'bg-blue-500'],
            ['name' => 'Ajouts Panier', 'value' => 0, 'percentage' => 0, 'color' => 'bg-green-500'],
            ['name' => 'Commandes', 'value' => $orders, 'percentage' => $visitors > 0 ? round(($orders / $visitors) * 100) : 0, 'color' => 'bg-yellow-500'],
            ['name' => 'Paiements', 'value' => $payments, 'percentage' => $visitors > 0 ? round(($payments / $visitors) * 100) : 0, 'color' => 'bg-purple-500']
        ];
        
        $paymentMethods = [
            ['name' => 'Carte Bancaire', 'percentage' => 0, 'transactions' => 0],
            ['name' => 'PayPal', 'percentage' => 0, 'transactions' => 0],
            ['name' => 'Virement', 'percentage' => 0, 'transactions' => 0],
            ['name' => 'Autres', 'percentage' => 0, 'transactions' => 0]
        ];
        
        $liveMetrics = [
            'online_visitors' => 0,
            'active_carts' => 0,
            'orders_per_hour' => Order::where('created_at', '>=', Carbon::now()->subHour())->count(),
            'today_revenue' => Order::where('status', 'delivered')
                ->whereDate('created_at', Carbon::today())
                ->sum('total_amount')
        ];
        
        $recentActivity = [
            ['type' => 'order', 'message' => 'Nouvelle commande #CMD' . str_pad(Order::latest()->first()->id ?? 1, 3, '0', STR_PAD_LEFT), 'time' => '2 min', 'icon' => 'ShoppingCart', 'color' => 'text-blue-600'],
            ['type' => 'customer', 'message' => 'Nouveau client inscrit', 'time' => '15 min', 'icon' => 'Users', 'color' => 'text-green-600'],
            ['type' => 'review', 'message' => 'Nouvel avis 5 étoiles', 'time' => '1h', 'icon' => 'Star', 'color' => 'text-yellow-600'],
            ['type' => 'stock', 'message' => 'Stock faible: ' . (Product::where('stock_quantity', '<', 10)->first()->name ?? 'Produit'), 'time' => '2h', 'icon' => 'AlertCircle', 'color' => 'text-red-600']
        ];
        
        $data = [
            'stats' => $stats,
            'quick_stats' => $quickStats,
            'live_metrics' => $liveMetrics,
            'monthly_revenue' => $monthlyRevenue,
            'recent_activity' => $recentActivity,
            'recent_orders' => Order::with('user')->latest()->take(5)->get(),
            'top_products' => $topProductsData,
            'categories' => Category::withCount('products')->get(),
            'category_stats' => $categoryStats,
            'performance' => $performance,
            'sales_funnel' => $salesFunnel,
            'sales_funnel_conversion' => $visitors > 0 ? round(($payments / $visitors) * 100, 1) . '%' : '0%',
            'payment_methods' => $paymentMethods,
            'payment_success_rate' => $totalOrders > 0 ? round(($payments / $totalOrders) * 100, 1) . '%' : '0%'
        ];

        return response()->json($data);
    }

    public function revenueAnalytics()
    {
        $monthlyRevenue = Order::where('status', 'delivered')
                              ->where('created_at', '>=', Carbon::now()->subMonths(12))
                              ->selectRaw('MONTH(created_at) as month, SUM(total_amount) as revenue')
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