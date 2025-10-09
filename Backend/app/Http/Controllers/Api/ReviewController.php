<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
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
            return response()->json(['message' => 'You have already reviewed this product'], 400);
        }

        $review = Review::create([
            'user_id' => $request->user()->id,
            'product_id' => $request->product_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'is_approved' => false
        ]);

        return response()->json($review, 201);
    }
}