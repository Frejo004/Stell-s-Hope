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
                        ->withSum('orders', 'total_amount')
                        ->orderBy('created_at', 'desc')
                        ->paginate(20);
        
        $customers->getCollection()->transform(function ($customer) {
            $customer->total_spent = $customer->orders_sum_total_amount ?? 0;
            return $customer;
        });
        
        return response()->json($customers);
    }

    public function show(User $customer)
    {
        $customer->load('orders');
        return response()->json($customer);
    }
}