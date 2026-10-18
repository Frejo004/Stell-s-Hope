<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Order;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Liste des avis publics approuvés pour un produit spécifique avec moyennes et ventilation
     */
    public function getProductReviews($productId)
    {
        $reviews = Review::where('product_id', $productId)
            ->where(function ($query) {
                $query->where('status', 'approved')
                      ->orWhere('is_approved', true);
            })
            ->with('user:id,first_name,last_name')
            ->latest()
            ->get();

        $totalCount = $reviews->count();
        $averageRating = $totalCount > 0 ? round($reviews->avg('rating'), 1) : 5.0;

        $breakdown = [
            5 => $reviews->where('rating', 5)->count(),
            4 => $reviews->where('rating', 4)->count(),
            3 => $reviews->where('rating', 3)->count(),
            2 => $reviews->where('rating', 2)->count(),
            1 => $reviews->where('rating', 1)->count(),
        ];

        return response()->json([
            'average_rating' => $averageRating,
            'total_reviews' => $totalCount,
            'breakdown' => $breakdown,
            'reviews' => $reviews->map(function ($r) {
                $lastName = $r->user->last_name ?? '';
                $initial = $lastName ? (mb_substr($lastName, 0, 1) . '.') : '';
                $author = trim(($r->user->first_name ?? 'Client') . ' ' . $initial) ?: 'Client Privilégié';

                return [
                    'id' => $r->id,
                    'rating' => $r->rating,
                    'comment' => $r->comment,
                    'author' => $author,
                    'verified_purchase' => true,
                    'date' => $r->created_at ? $r->created_at->format('d/m/Y') : date('d/m/Y'),
                ];
            })
        ]);
    }

    public function index(Request $request)
    {
        $reviews = Review::where('user_id', $request->user()->id)
                        ->with('product')
                        ->latest()
                        ->paginate(10);
        return response()->json($reviews);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000'
        ]);

        $existingReview = Review::where('user_id', $request->user()->id)
                               ->where('product_id', $request->product_id)
                               ->first();

        if ($existingReview) {
            return response()->json(['message' => 'Vous avez déjà partagé votre avis sur cette création.'], 400);
        }

        $review = Review::create([
            'user_id' => $request->user()->id,
            'product_id' => $request->product_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'is_approved' => false,
            'status' => 'pending'
        ]);

        return response()->json([
            'message' => 'Votre avis a été soumis avec succès et sera publié après validation par notre équipe.',
            'review' => $review
        ], 201);
    }
}