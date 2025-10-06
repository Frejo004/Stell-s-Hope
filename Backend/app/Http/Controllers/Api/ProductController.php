<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category')->where('is_active', true);
        
        if ($request->has('category')) {
            $query->where('category_id', $request->category);
        }
        
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        
        $products = $query->paginate(12);
        
        return response()->json($products);
    }

    public function show(Product $product)
    {
        if (!$product->is_active) {
            return response()->json(['message' => 'Produit non disponible'], 404);
        }
        
        $product->load('category', 'reviews.user');
        
        return response()->json($product);
    }

    public function featured()
    {
        $products = Product::where('is_active', true)
                          ->where('is_featured', true)
                          ->with('category')
                          ->limit(8)
                          ->get();
        
        return response()->json($products);
    }

    public function bestsellers()
    {
        $products = Product::where('is_active', true)
                          ->with('category')
                          ->orderBy('created_at', 'desc')
                          ->limit(8)
                          ->get();
        
        return response()->json($products);
    }

    public function search(Request $request)
    {
        $query = $request->get('q', '');
        
        if (empty($query)) {
            return response()->json([]);
        }
        
        $products = Product::where('is_active', true)
                          ->where(function($q) use ($query) {
                              $q->where('name', 'like', '%' . $query . '%')
                                ->orWhere('description', 'like', '%' . $query . '%');
                          })
                          ->with('category')
                          ->limit(10)
                          ->get();
        
        return response()->json($products);
    }
}