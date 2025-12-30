<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\Ticket;
use App\Models\Category;
use App\Models\Review;
use App\Models\Promotion;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // Statistiques principales avec comparaison mois précédent
        $currentMonth = Carbon::now()->startOfMonth();
        $previousMonth = Carbon::now()->subMonth()->startOfMonth();
        
        $currentRevenue = Order::where('payment_status', 'paid')
            ->where('created_at', '>=', $currentMonth)
            ->sum('total_amount');
        $previousRevenue = Order::where('payment_status', 'paid')
            ->whereBetween('created_at', [$previousMonth, $currentMonth])
            ->sum('total_amount');
        $revenueChange = $previousRevenue > 0 ? round((($currentRevenue - $previousRevenue) / $previousRevenue) * 100, 1) : ($currentRevenue > 0 ? 100 : 0);
        
        $currentOrders = Order::where('created_at', '>=', $currentMonth)->count();
        $previousOrders = Order::whereBetween('created_at', [$previousMonth, $currentMonth])->count();
        $ordersChange = $previousOrders > 0 ? round((($currentOrders - $previousOrders) / $previousOrders) * 100, 1) : ($currentOrders > 0 ? 100 : 0);
        
        $currentCustomers = User::where('is_admin', false)->where('created_at', '>=', $currentMonth)->count();
        $previousCustomers = User::where('is_admin', false)->whereBetween('created_at', [$previousMonth, $currentMonth])->count();
        $customersChange = $previousCustomers > 0 ? round((($currentCustomers - $previousCustomers) / $previousCustomers) * 100, 1) : ($currentCustomers > 0 ? 100 : 0);
        
        $currentAvgOrder = Order::where('created_at', '>=', $currentMonth)->avg('total_amount') ?? 0;
        $previousAvgOrder = Order::whereBetween('created_at', [$previousMonth, $currentMonth])->avg('total_amount') ?? 0;
        $avgOrderChange = $previousAvgOrder > 0 ? round((($currentAvgOrder - $previousAvgOrder) / $previousAvgOrder) * 100, 1) : ($previousAvgOrder > 0 ? 100 : 0);
        
        // Données mensuelles pour le graphique (6 derniers mois)
        $monthlyRevenue = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $revenue = Order::where('payment_status', 'paid')
                ->whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->sum('total_amount');
            $ordersCount = Order::whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->count();
            
            $monthlyRevenue[] = [
                'month' => $month->translatedFormat('M'),
                'revenue' => round($revenue, 2),
                'orders' => $ordersCount
            ];
        }
        
        $stats = [
            'revenue' => round($currentRevenue, 0),
            'revenue_change' => ($revenueChange >= 0 ? '+' : '') . $revenueChange . '%',
            'orders' => $currentOrders,
            'orders_change' => ($ordersChange >= 0 ? '+' : '') . $ordersChange . '%',
            'customers' => User::where('is_admin', false)->count(),
            'customers_change' => ($customersChange >= 0 ? '+' : '') . $customersChange . '%',
            'average_order' => round($currentAvgOrder, 0),
            'average_order_change' => ($avgOrderChange >= 0 ? '+' : '') . $avgOrderChange . '%'
        ];
        
        $quickStats = [
            'active_promotions' => Promotion::where('is_active', true)->where('expires_at', '>', now())->count(),
            'shipping_methods' => 4, // Fixe pour le moment
            'payment_methods' => 3, // Fixe pour le moment
            'pending_reviews' => Review::where('is_approved', false)->count(),
            'support_tickets' => Ticket::where('status', 'open')->count(),
            'low_stock' => Product::where('stock_quantity', '<', 10)->count()
        ];
        
        $categoryStatsData = Category::withCount('products')->get();
        $totalProductsForAll = $categoryStatsData->sum('products_count');
        $categoryStats = $categoryStatsData->map(function($category, $index) use ($totalProductsForAll) {
            $colors = ['bg-rose-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-blue-500'];
            return [
                'name' => $category->name,
                'sales' => $category->products_count,
                'percentage' => $totalProductsForAll > 0 ? round(($category->products_count / $totalProductsForAll) * 100) : 0,
                'color' => $colors[$index % count($colors)]
            ];
        });
        
        $topProductsData = Product::select('products.*')
            ->join('order_items', 'products.id', '=', 'order_items.product_id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.payment_status', 'paid')
            ->selectRaw('SUM(order_items.quantity) as total_sales, SUM(order_items.quantity * order_items.price) as total_revenue')
            ->groupBy('products.id')
            ->orderBy('total_sales', 'desc')
            ->take(5)
            ->get()
            ->map(function($product) {
                return [
                    'name' => $product->name,
                    'sales' => (int)$product->total_sales,
                    'revenue' => round($product->total_revenue, 0) . ' €'
                ];
            });
        
        // Si vide, on met des données par défaut pour éviter un dashboard vide
        if ($topProductsData->isEmpty()) {
            $topProductsData = Product::take(3)->get()->map(function($p) {
                return ['name' => $p->name, 'sales' => 0, 'revenue' => '0 €'];
            });
        }
        
        $totalOrders = Order::count();
        $deliveredOrders = Order::where('status', 'delivered')->count();
        
        // Estimation conversion (simulée avec un baseline de visiteurs)
        $visitors = max(1000, $totalOrders * 20); 
        
        $salesFunnel = [
            ['name' => 'Visiteurs', 'value' => $visitors, 'percentage' => 100, 'color' => 'bg-indigo-500'],
            ['name' => 'Ajouts Panier', 'value' => round($visitors * 0.15), 'percentage' => 15, 'color' => 'bg-emerald-500'],
            ['name' => 'Commandes', 'value' => $totalOrders, 'percentage' => $visitors > 0 ? round(($totalOrders / $visitors) * 100, 1) : 0, 'color' => 'bg-rose-500'],
            ['name' => 'Paiements', 'value' => Order::where('payment_status', 'paid')->count(), 'percentage' => $visitors > 0 ? round((Order::where('payment_status', 'paid')->count() / $visitors) * 100, 1) : 0, 'color' => 'bg-amber-500']
        ];
        
        $paymentGrouping = Order::select('payment_method', DB::raw('count(*) as count'), DB::raw('sum(total_amount) as total'))
            ->groupBy('payment_method')
            ->get();
            
        $paymentMethods = $paymentGrouping->map(function($item) use ($totalOrders) {
            return [
                'name' => ucfirst(str_replace('_', ' ', $item->payment_method)),
                'percentage' => $totalOrders > 0 ? round(($item->count / $totalOrders) * 100) : 0,
                'transactions' => $item->count
            ];
        });
        
        $liveMetrics = [
            'online_visitors' => rand(15, 45), // Simulé
            'active_carts' => rand(5, 12), // Simulé
            'orders_per_hour' => Order::where('created_at', '>=', Carbon::now()->subHour())->count(),
            'today_revenue' => Order::where('payment_status', 'paid')
                ->whereDate('created_at', Carbon::today())
                ->sum('total_amount')
        ];
        
        $recentActivity = [];
        
        // On récupère les 2 dernières commandes
        $lastOrders = Order::latest()->take(2)->get();
        foreach($lastOrders as $o) {
            $recentActivity[] = [
                'type' => 'order',
                'message' => 'Commande #' . $o->id . ' par ' . ($o->user->first_name ?? 'Client'),
                'time' => $o->created_at->diffForHumans(),
                'icon' => 'ShoppingCart',
                'color' => 'text-rose-600'
            ];
        }
        
        // Derniers clients
        $lastUsers = User::where('is_admin', false)->latest()->take(1)->get();
        foreach($lastUsers as $u) {
            $recentActivity[] = [
                'type' => 'customer',
                'message' => 'Nouveau client: ' . $u->first_name,
                'time' => $u->created_at->diffForHumans(),
                'icon' => 'Users',
                'color' => 'text-indigo-600'
            ];
        }

        // Si vide
        if (empty($recentActivity)) {
             $recentActivity = [['type' => 'system', 'message' => 'Initialisation du système terminée', 'time' => '1h', 'icon' => 'Activity', 'color' => 'text-slate-400']];
        }
        
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
            'sales_funnel' => $salesFunnel,
            'sales_funnel_conversion' => $visitors > 0 ? round((Order::where('payment_status', 'paid')->count() / $visitors) * 100, 1) . '%' : '0%',
            'payment_methods' => $paymentMethods,
            'payment_success_rate' => $totalOrders > 0 ? round((Order::where('payment_status', 'paid')->count() / $totalOrders) * 100, 1) . '%' : '0%'
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