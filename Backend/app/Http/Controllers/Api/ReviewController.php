<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000'
        ]);

        $review = Review::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'product_id' => $request->product_id
            ],
            [
                'rating' => $request->rating,
                'comment' => $request->comment,
                'is_approved' => false
            ]
        );

        return response()->json($review->load('user'), 201);
    }

    public function index(Request $request)
    {
        $reviews = $request->user()->reviews()->with('product')->get();
        return response()->json($reviews);
    }
}