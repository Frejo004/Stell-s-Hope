<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use Illuminate\Http\Request;
use Carbon\Carbon;

class PromotionController extends Controller
{
    public function validate(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'subtotal' => 'sometimes|numeric|min:0',
            'amount' => 'sometimes|numeric|min:0',
        ]);

        $amount = $request->input('subtotal', $request->input('amount', 0));

        $promotion = Promotion::where('code', strtoupper($request->code))
            ->where('is_active', true)
            ->where('starts_at', '<=', Carbon::now())
            ->where('expires_at', '>=', Carbon::now())
            ->first();

        if (!$promotion) {
            return response()->json(['error' => 'Code promo invalide ou expiré'], 400);
        }

        if ($promotion->max_uses && $promotion->used_count >= $promotion->max_uses) {
            return response()->json(['error' => 'Code promo épuisé'], 400);
        }

        if ($promotion->min_amount && $amount < $promotion->min_amount) {
            return response()->json(['error' => "Montant minimum requis: {$promotion->min_amount}€"], 400);
        }

        return response()->json([
            'code' => $promotion->code,
            'type' => $promotion->type,
            'value' => $promotion->value
        ]);
    }

    public function apply(Request $request)
    {
        $request->validate([
            'code' => 'required|string'
        ]);

        $promotion = Promotion::where('code', $request->code)->first();
        
        if ($promotion) {
            $promotion->increment('used_count');
        }

        return response()->json(['success' => true]);
    }
}