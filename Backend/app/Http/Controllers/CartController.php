<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Cart;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cartItems = $request->user()->cart()->with('product.category')->get();
        $total = $cartItems->sum('subtotal');
        $count = $cartItems->sum('quantity');

        return response()->json([
            'items' => $cartItems,
            'total' => $total,
            'count' => $count
        ]);
    }

    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'size' => 'nullable|string',
            'color' => 'nullable|string'
        ]);

        $product = Product::find($request->product_id);
        
        if (!$product->is_active) {
            return response()->json(['error' => 'Product is not available'], 400);
        }

        $cartItem = Cart::where('user_id', $request->user()->id)
                       ->where('product_id', $request->product_id)
                       ->where('size', $request->size)
                       ->where('color', $request->color)
                       ->first();

        if ($cartItem) {
            $cartItem->quantity += $request->quantity;
            $cartItem->save();
        } else {
            Cart::create([
                'user_id' => $request->user()->id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
                'size' => $request->size,
                'color' => $request->color
            ]);
        }

        return response()->json(['message' => 'Product added to cart']);
    }

    public function update(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:0',
            'size' => 'nullable|string',
            'color' => 'nullable|string'
        ]);

        $cartItem = Cart::where('user_id', $request->user()->id)
                       ->where('product_id', $request->product_id)
                       ->where('size', $request->size)
                       ->where('color', $request->color)
                       ->first();

        if (!$cartItem) {
            return response()->json(['error' => 'Item not found in cart'], 404);
        }

        if ($request->quantity == 0) {
            $cartItem->delete();
            return response()->json(['message' => 'Item removed from cart']);
        }

        $cartItem->quantity = $request->quantity;
        $cartItem->save();

        return response()->json(['message' => 'Cart updated']);
    }

    public function remove(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'size' => 'nullable|string',
            'color' => 'nullable|string'
        ]);

        $cartItem = Cart::where('user_id', $request->user()->id)
                       ->where('product_id', $request->product_id)
                       ->where('size', $request->size)
                       ->where('color', $request->color)
                       ->first();

        if (!$cartItem) {
            return response()->json(['error' => 'Item not found in cart'], 404);
        }

        $cartItem->delete();
        return response()->json(['message' => 'Product removed from cart']);
    }

    public function clear(Request $request)
    {
        $request->user()->cart()->delete();
        return response()->json(['message' => 'Cart cleared']);
    }
}