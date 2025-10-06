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
            'notifications' => $this->getTotalNotifications(),
            'messages' => Ticket::where('status', 'open')->count(),
            'pendingOrders' => Order::where('status', 'pending')->count(),
            'lowStock' => Product::where('stock', '<=', 5)->count(),
            'pendingReviews' => Review::where('status', 'pending')->count(),
            'supportTickets' => Ticket::where('priority', 'high')->count()
        ];

        return response()->json($stats);
    }

    private function getTotalNotifications()
    {
        return Order::where('status', 'pending')->count() +
               Product::where('stock', '<=', 5)->count() +
               Review::where('status', 'pending')->count();
    }
}