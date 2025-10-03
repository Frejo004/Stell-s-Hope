<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AdminCustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('is_admin', false)->withCount('orders');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', '%' . $search . '%')
                  ->orWhere('last_name', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%');
            });
        }

        if ($request->has('status')) {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            } elseif ($request->status === 'vip') {
                $query->whereHas('orders', function($q) {
                    $q->selectRaw('SUM(total_amount) as total_spent')
                      ->groupBy('user_id')
                      ->havingRaw('SUM(total_amount) > 1000');
                });
            }
        }

        $customers = $query->orderBy('created_at', 'desc')
                          ->paginate($request->get('per_page', 15));

        // Ajouter les statistiques pour chaque client
        $customers->getCollection()->transform(function ($customer) {
            $customer->total_spent = $customer->orders()->sum('total_amount');
            $customer->last_order = $customer->orders()->latest()->first()?->created_at;
            return $customer;
        });

        return response()->json($customers);
    }

    public function show(User $customer)
    {
        if ($customer->is_admin) {
            return response()->json(['error' => 'Not a customer'], 404);
        }

        $customer->load(['orders.items.product']);
        
        $stats = [
            'total_orders' => $customer->orders->count(),
            'total_spent' => $customer->orders->sum('total_amount'),
            'average_order_value' => $customer->orders->count() > 0 ? 
                $customer->orders->sum('total_amount') / $customer->orders->count() : 0,
            'last_order_date' => $customer->orders->max('created_at'),
            'favorite_category' => $this->getFavoriteCategory($customer),
        ];

        return response()->json([
            'customer' => $customer,
            'stats' => $stats
        ]);
    }

    public function orders(User $customer)
    {
        $orders = $customer->orders()
                          ->with(['items.product'])
                          ->orderBy('created_at', 'desc')
                          ->paginate(10);

        return response()->json($orders);
    }

    public function stats()
    {
        $totalCustomers = User::where('is_admin', false)->count();
        $activeCustomers = User::where('is_admin', false)
                              ->where('is_active', true)
                              ->count();
        
        $newCustomers = User::where('is_admin', false)
                           ->where('created_at', '>=', Carbon::now()->subDays(30))
                           ->count();

        $vipCustomers = User::where('is_admin', false)
                           ->whereHas('orders', function($q) {
                               $q->selectRaw('SUM(total_amount) as total_spent')
                                 ->groupBy('user_id')
                                 ->havingRaw('SUM(total_amount) > 1000');
                           })
                           ->count();

        $customerGrowth = [];
        for ($i = 11; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $count = User::where('is_admin', false)
                        ->whereYear('created_at', $month->year)
                        ->whereMonth('created_at', $month->month)
                        ->count();
            
            $customerGrowth[] = [
                'month' => $month->format('M Y'),
                'count' => $count
            ];
        }

        return response()->json([
            'total_customers' => $totalCustomers,
            'active_customers' => $activeCustomers,
            'new_customers' => $newCustomers,
            'vip_customers' => $vipCustomers,
            'customer_growth' => $customerGrowth
        ]);
    }

    public function updateStatus(Request $request, User $customer)
    {
        $request->validate([
            'is_active' => 'required|boolean'
        ]);

        $customer->update(['is_active' => $request->is_active]);
        return response()->json($customer);
    }

    public function export(Request $request)
    {
        $query = User::where('is_admin', false)->with('orders');

        if ($request->has('status')) {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        $customers = $query->get();

        $csvData = [];
        $csvData[] = [
            'First Name',
            'Last Name',
            'Email',
            'Phone',
            'Status',
            'Total Orders',
            'Total Spent',
            'Registration Date',
            'Last Order Date'
        ];

        foreach ($customers as $customer) {
            $csvData[] = [
                $customer->first_name,
                $customer->last_name,
                $customer->email,
                $customer->phone,
                $customer->is_active ? 'Active' : 'Inactive',
                $customer->orders->count(),
                $customer->orders->sum('total_amount'),
                $customer->created_at->format('Y-m-d'),
                $customer->orders->max('created_at')?->format('Y-m-d') ?? 'Never'
            ];
        }

        $filename = 'customers_export_' . date('Y-m-d_H-i-s') . '.csv';
        
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

    private function getFavoriteCategory(User $customer)
    {
        $categoryStats = $customer->orders()
            ->join('order_items', 'orders.id', '=', 'order_items.order_id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->selectRaw('categories.name, COUNT(*) as count')
            ->groupBy('categories.id', 'categories.name')
            ->orderBy('count', 'desc')
            ->first();

        return $categoryStats?->name ?? 'None';
    }
}