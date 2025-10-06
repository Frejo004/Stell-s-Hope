<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $reviews = $request->user()->reviews()
                          ->with('product')
                          ->orderBy('created_at', 'desc')
                          ->paginate(10);
        
        return response()->json($reviews);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000'
        ]);

        // Vérifier si l'utilisateur a déjà laissé un avis pour ce produit
        $existingReview = Review::where('user_id', $request->user()->id)
                               ->where('product_id', $validated['product_id'])
                               ->first();

        if ($existingReview) {
            return response()->json(['message' => 'Vous avez déjà laissé un avis pour ce produit'], 400);
        }

        $review = Review::create([
            'user_id' => $request->user()->id,
            'product_id' => $validated['product_id'],
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
            'is_approved' => false
        ]);

        return response()->json($review, 201);
    }
}