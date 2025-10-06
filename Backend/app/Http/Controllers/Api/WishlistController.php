<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $wishlist = $request->user()->wishlist()
                           ->with('product.category')
                           ->get();
        
        return response()->json($wishlist);
    }

    public function toggle(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id'
        ]);

        $wishlistItem = Wishlist::where('user_id', $request->user()->id)
                               ->where('product_id', $validated['product_id'])
                               ->first();

        if ($wishlistItem) {
            $wishlistItem->delete();
            return response()->json(['message' => 'Produit retiré de la liste de souhaits', 'added' => false]);
        } else {
            Wishlist::create([
                'user_id' => $request->user()->id,
                'product_id' => $validated['product_id']
            ]);
            return response()->json(['message' => 'Produit ajouté à la liste de souhaits', 'added' => true]);
        }
    }
}