<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'reviews']);

        if ($request->has('category')) {
            $query->where('category_id', $request->category);
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        $products = $query->where('is_active', true)
                         ->paginate($request->get('per_page', 12));

        return response()->json($products);
    }

    public function show(Product $product)
    {
        $product->load(['category', 'reviews.user']);
        return response()->json($product);
    }

    public function featured()
    {
        $products = Product::where('is_featured', true)
                          ->where('is_active', true)
                          ->with('category')
                          ->limit(8)
                          ->get();

        return response()->json($products);
    }

    public function bestsellers()
    {
        $products = Product::where('is_bestseller', true)
                          ->where('is_active', true)
                          ->with('category')
                          ->limit(8)
                          ->get();

        return response()->json($products);
    }

    public function search(Request $request)
    {
        $query = $request->get('q');
        
        $products = Product::where('name', 'like', '%' . $query . '%')
                          ->orWhere('description', 'like', '%' . $query . '%')
                          ->where('is_active', true)
                          ->with('category')
                          ->paginate(12);

        return response()->json($products);
    }
}