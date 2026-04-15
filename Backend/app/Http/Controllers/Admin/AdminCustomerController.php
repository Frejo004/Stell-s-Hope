<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminCustomerController extends Controller
{
    public function index()
    {
        $customers = User::where('is_admin', false)
                        ->withCount('orders')
                        ->withSum('orders', 'total')
                        ->orderBy('created_at', 'desc')
                        ->paginate(20);

        $customers->getCollection()->transform(function ($customer) {
            $customer->total_spent = $customer->orders_sum_total ?? 0;
            return $customer;
        });

        return response()->json($customers);
    }

    public function show(User $customer)
    {
        $customer->load('orders');
        return response()->json($customer);
    }

    public function stats()
    {
        $total = User::where('is_admin', false)->count();
        $newThisMonth = User::where('is_admin', false)
            ->where('created_at', '>=', now()->startOfMonth())
            ->count();
        $active = User::where('is_admin', false)->where('is_active', true)->count();

        return response()->json([
            'total'          => $total,
            'new_this_month' => $newThisMonth,
            'active'         => $active,
        ]);
    }

    public function orders(User $customer)
    {
        $orders = $customer->orders()->with('orderItems.product')->latest()->paginate(10);
        return response()->json($orders);
    }

    public function updateStatus(Request $request, User $customer)
    {
        $request->validate([
            'is_active' => 'required|boolean',
        ]);
        $customer->update(['is_active' => $request->is_active]);
        return response()->json($customer);
    }

    public function export()
    {
        $customers = User::where('is_admin', false)
            ->withCount('orders')
            ->withSum('orders', 'total')
            ->get()
            ->map(function ($c) {
                return [
                    'id'          => $c->id,
                    'name'        => $c->first_name . ' ' . $c->last_name,
                    'email'       => $c->email,
                    'orders'      => $c->orders_count,
                    'total_spent' => $c->orders_sum_total ?? 0,
                    'created_at'  => $c->created_at->format('Y-m-d'),
                ];
            });

        return response()->json($customers);
    }
}
