<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $wishlist = $request->user()->wishlist()->with('product.category')->get();
        return response()->json($wishlist);
    }

    public function toggle(Request $request)
    {
        $request->validate(['product_id' => 'required|exists:products,id']);

        $wishlist = Wishlist::where('user_id', $request->user()->id)
                           ->where('product_id', $request->product_id)
                           ->first();

        if ($wishlist) {
            $wishlist->delete();
            return response()->json(['message' => 'Retiré des favoris', 'liked' => false]);
        }

        Wishlist::create([
            'user_id' => $request->user()->id,
            'product_id' => $request->product_id
        ]);

        return response()->json(['message' => 'Ajouté aux favoris', 'liked' => true]);
    }
}