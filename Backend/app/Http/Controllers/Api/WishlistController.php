<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use App\Models\Product;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $productIds = $request->user()->wishlist()->pluck('product_id');
        $products = Product::whereIn('id', $productIds)
                           ->with('category')
                           ->get();
            
        return response()->json($products);
    }

    public function toggle(Request $request)
    {
        $request->validate(['product_id' => 'required|exists:products,id']);

        $wishlistItem = Wishlist::where('user_id', $request->user()->id)
                               ->where('product_id', $request->product_id)
                               ->first();

        if ($wishlistItem) {
            $wishlistItem->delete();
            return response()->json(['message' => 'Removed from wishlist', 'in_wishlist' => false]);
        } else {
            Wishlist::create([
                'user_id' => $request->user()->id,
                'product_id' => $request->product_id
            ]);
            return response()->json(['message' => 'Added to wishlist', 'in_wishlist' => true]);
        }
    }

    public function store(Request $request)
    {
        $request->validate(['product_id' => 'required|exists:products,id']);

        Wishlist::firstOrCreate([
            'user_id' => $request->user()->id,
            'product_id' => $request->product_id
        ]);

        return response()->json(['message' => 'Added to wishlist']);
    }

    public function destroy(Request $request, $productId)
    {
        Wishlist::where('user_id', $request->user()->id)
                ->where('product_id', $productId)
                ->delete();

        return response()->json(['message' => 'Removed from wishlist']);
    }
}