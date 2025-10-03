<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Promotion;
use Illuminate\Http\Request;

class AdminPromotionController extends Controller
{
    public function index()
    {
        $promotions = Promotion::orderBy('created_at', 'desc')->get();
        return response()->json($promotions);
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|unique:promotions',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'min_amount' => 'nullable|numeric|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'starts_at' => 'required|date',
            'expires_at' => 'required|date|after:starts_at'
        ]);

        $promotion = Promotion::create($request->all());
        return response()->json($promotion, 201);
    }

    public function update(Request $request, Promotion $promotion)
    {
        $request->validate([
            'code' => 'required|string|unique:promotions,code,' . $promotion->id,
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'is_active' => 'boolean'
        ]);

        $promotion->update($request->all());
        return response()->json($promotion);
    }

    public function destroy(Promotion $promotion)
    {
        $promotion->delete();
        return response()->json(['message' => 'Promotion supprimée']);
    }
}