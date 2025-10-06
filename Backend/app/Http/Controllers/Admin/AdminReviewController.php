<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class AdminReviewController extends Controller
{
    public function index()
    {
        $reviews = Review::with(['user:id,first_name,last_name', 'product:id,name'])
                        ->orderBy('created_at', 'desc')
                        ->get()
                        ->map(function ($review) {
                            return [
                                'id' => $review->id,
                                'customer' => ($review->user->first_name ?? 'Client') . ' ' . ($review->user->last_name ?? ''),
                                'product' => $review->product->name ?? 'Produit supprimé',
                                'rating' => $review->rating,
                                'comment' => $review->comment,
                                'status' => $review->status ?? 'pending',
                                'date' => $review->created_at->format('Y-m-d')
                            ];
                        });

        $stats = [
            'total' => $reviews->count(),
            'pending' => $reviews->where('status', 'pending')->count(),
            'approved' => $reviews->where('status', 'approved')->count(),
            'averageRating' => $reviews->avg('rating') ?? 0
        ];

        return response()->json([
            'reviews' => $reviews,
            'stats' => $stats
        ]);
    }

    public function updateStatus(Request $request, Review $review)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected'
        ]);

        $review->update(['status' => $request->status]);

        return response()->json(['message' => 'Statut mis à jour']);
    }
}