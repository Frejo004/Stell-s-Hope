<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'reviews'])
            ->where('is_active', true);

        // Filtres
        if ($request->has('category')) {
            $query->where('category_id', $request->category);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('gender')) {
            $query->where('gender', $request->gender);
        }

        if ($request->has('search')) {
            $query->where('name', 'ILIKE', '%' . $request->search . '%');
        }

        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Tri
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $products = $query->paginate($request->get('per_page', 12));

        return response()->json($products);
    }

    public function show($id)
    {
        $product = Product::with(['category', 'reviews.user'])
            ->where('is_active', true)
            ->findOrFail($id);

        return response()->json($product);
    }

    public function featured()
    {
        $products = Product::where('is_featured', true)
            ->where('is_active', true)
            ->with(['category', 'reviews'])
            ->limit(8)
            ->get();

        return response()->json($products);
    }

    public function bestsellers()
    {
        $products = Product::where('is_bestseller', true)
            ->where('is_active', true)
            ->with(['category', 'reviews'])
            ->limit(8)
            ->get();

        return response()->json($products);
    }
}