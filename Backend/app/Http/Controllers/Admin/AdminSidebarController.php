<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\Ticket;
use Illuminate\Http\Request;

class AdminSidebarController extends Controller
{
    public function getSidebarStats()
    {
        $stats = [
            'orders' => Order::count(),
            'low_stock' => Product::where('stock_quantity', '<=', 5)->count(),
            'pending_reviews' => 0, // Review model doesn't exist yet
            'support_tickets' => Ticket::where('status', 'open')->count()
        ];

        return response()->json($stats);
    }
}