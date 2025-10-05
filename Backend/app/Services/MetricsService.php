<?php

namespace App\Services;

use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class MetricsService
{
    public function getDashboardMetrics()
    {
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();
        $lastMonth = Carbon::now()->subMonth()->startOfMonth();

        return [
            'users' => $this->getUserMetrics($today, $thisMonth, $lastMonth),
            'orders' => $this->getOrderMetrics($today, $thisMonth, $lastMonth),
            'products' => $this->getProductMetrics(),
            'revenue' => $this->getRevenueMetrics($today, $thisMonth, $lastMonth),
            'categories' => $this->getCategoryMetrics()
        ];
    }

    private function getUserMetrics($today, $thisMonth, $lastMonth)
    {
        $totalUsers = User::where('is_admin', false)->count();
        $newUsersToday = User::where('is_admin', false)
            ->whereDate('created_at', $today)
            ->count();
        $newUsersThisMonth = User::where('is_admin', false)
            ->where('created_at', '>=', $thisMonth)
            ->count();
        $newUsersLastMonth = User::where('is_admin', false)
            ->whereBetween('created_at', [$lastMonth, $thisMonth])
            ->count();

        $growthRate = $newUsersLastMonth > 0 
            ? (($newUsersThisMonth - $newUsersLastMonth) / $newUsersLastMonth) * 100 
            : 0;

        return [
            'total' => $totalUsers,
            'new_today' => $newUsersToday,
            'new_this_month' => $newUsersThisMonth,
            'growth_rate' => round($growthRate, 2)
        ];
    }

    private function getOrderMetrics($today, $thisMonth, $lastMonth)
    {
        $totalOrders = Order::count();
        $ordersToday = Order::whereDate('created_at', $today)->count();
        $ordersThisMonth = Order::where('created_at', '>=', $thisMonth)->count();
        $ordersLastMonth = Order::whereBetween('created_at', [$lastMonth, $thisMonth])->count();

        $growthRate = $ordersLastMonth > 0 
            ? (($ordersThisMonth - $ordersLastMonth) / $ordersLastMonth) * 100 
            : 0;

        return [
            'total' => $totalOrders,
            'today' => $ordersToday,
            'this_month' => $ordersThisMonth,
            'growth_rate' => round($growthRate, 2)
        ];
    }

    private function getProductMetrics()
    {
        $totalProducts = Product::count();
        $activeProducts = Product::where('is_active', true)->count();
        $featuredProducts = Product::where('is_featured', true)->count();
        $lowStockProducts = Product::where('stock_quantity', '<', 10)->count();

        return [
            'total' => $totalProducts,
            'active' => $activeProducts,
            'featured' => $featuredProducts,
            'low_stock' => $lowStockProducts
        ];
    }

    private function getRevenueMetrics($today, $thisMonth, $lastMonth)
    {
        $totalRevenue = Order::where('status', '!=', 'cancelled')->sum('total_amount');
        $revenueToday = Order::where('status', '!=', 'cancelled')
            ->whereDate('created_at', $today)
            ->sum('total_amount');
        $revenueThisMonth = Order::where('status', '!=', 'cancelled')
            ->where('created_at', '>=', $thisMonth)
            ->sum('total_amount');
        $revenueLastMonth = Order::where('status', '!=', 'cancelled')
            ->whereBetween('created_at', [$lastMonth, $thisMonth])
            ->sum('total_amount');

        $growthRate = $revenueLastMonth > 0 
            ? (($revenueThisMonth - $revenueLastMonth) / $revenueLastMonth) * 100 
            : 0;

        return [
            'total' => round($totalRevenue, 2),
            'today' => round($revenueToday, 2),
            'this_month' => round($revenueThisMonth, 2),
            'growth_rate' => round($growthRate, 2)
        ];
    }

    private function getCategoryMetrics()
    {
        return Category::withCount('products')
            ->orderBy('products_count', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'products_count' => $category->products_count
                ];
            });
    }

    public function getSalesChartData(int $days = 30)
    {
        $data = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $revenue = Order::where('status', '!=', 'cancelled')
                ->whereDate('created_at', $date)
                ->sum('total_amount');
            
            $data[] = [
                'date' => $date->format('Y-m-d'),
                'revenue' => round($revenue, 2),
                'orders' => Order::whereDate('created_at', $date)->count()
            ];
        }

        return $data;
    }

    public function getTopProducts(int $limit = 10)
    {
        return Product::withCount(['orderItems'])
            ->orderBy('order_items_count', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'sales_count' => $product->order_items_count,
                    'revenue' => round($product->orderItems()->sum(DB::raw('quantity * price')), 2)
                ];
            });
    }

    public function getCustomerSegments()
    {
        return [
            'new_customers' => User::where('created_at', '>=', Carbon::now()->subDays(30))->count(),
            'returning_customers' => User::whereHas('orders', function($q) {
                $q->where('created_at', '>=', Carbon::now()->subDays(90));
            })->count(),
            'vip_customers' => User::whereHas('orders', function($q) {
                $q->where('total_amount', '>', 500);
            })->count(),
            'inactive_customers' => User::whereDoesntHave('orders', function($q) {
                $q->where('created_at', '>=', Carbon::now()->subDays(90));
            })->count()
        ];
    }

    public function getSystemHealth()
    {
        return [
            'database' => $this->checkDatabaseHealth(),
            'cache' => $this->checkCacheHealth(),
            'storage' => $this->checkStorageHealth(),
            'memory_usage' => $this->getMemoryUsage(),
            'uptime' => $this->getUptime()
        ];
    }

    private function checkDatabaseHealth()
    {
        try {
            DB::connection()->getPdo();
            return ['status' => 'healthy', 'response_time' => microtime(true)];
        } catch (\Exception $e) {
            return ['status' => 'unhealthy', 'error' => $e->getMessage()];
        }
    }

    private function checkCacheHealth()
    {
        try {
            $start = microtime(true);
            cache()->put('health_check', 'ok', 1);
            $value = cache()->get('health_check');
            $responseTime = microtime(true) - $start;
            
            return [
                'status' => $value === 'ok' ? 'healthy' : 'unhealthy',
                'response_time' => $responseTime
            ];
        } catch (\Exception $e) {
            return ['status' => 'unhealthy', 'error' => $e->getMessage()];
        }
    }

    private function checkStorageHealth()
    {
        $storagePath = storage_path();
        $freeSpace = disk_free_space($storagePath);
        $totalSpace = disk_total_space($storagePath);
        $usedSpace = $totalSpace - $freeSpace;
        $usagePercentage = ($usedSpace / $totalSpace) * 100;

        return [
            'status' => $usagePercentage < 90 ? 'healthy' : 'warning',
            'usage_percentage' => round($usagePercentage, 2),
            'free_space_gb' => round($freeSpace / (1024 * 1024 * 1024), 2),
            'total_space_gb' => round($totalSpace / (1024 * 1024 * 1024), 2)
        ];
    }

    private function getMemoryUsage()
    {
        return [
            'current_mb' => round(memory_get_usage(true) / (1024 * 1024), 2),
            'peak_mb' => round(memory_get_peak_usage(true) / (1024 * 1024), 2)
        ];
    }

    private function getUptime()
    {
        // Cette méthode devrait être adaptée selon votre environnement
        return [
            'server_uptime' => 'N/A', // À implémenter selon votre serveur
            'application_start' => config('app.start_time', 'N/A')
        ];
    }
}
