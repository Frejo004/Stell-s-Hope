<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class AdminProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category');
        
        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        
        if ($request->has('category') && $request->category) {
            $query->whereHas('category', function($q) use ($request) {
                $q->where('name', $request->category);
            });
        }
        
        if ($request->has('price') && $request->price) {
            switch ($request->price) {
                case '0-25':
                    $query->whereBetween('price', [0, 25]);
                    break;
                case '25-50':
                    $query->whereBetween('price', [25, 50]);
                    break;
                case '50-100':
                    $query->whereBetween('price', [50, 100]);
                    break;
                case '100+':
                    $query->where('price', '>', 100);
                    break;
            }
        }
        
        if ($request->has('stock') && $request->stock) {
            switch ($request->stock) {
                case 'in-stock':
                    $query->where('stock_quantity', '>', 0);
                    break;
                case 'low-stock':
                    $query->whereBetween('stock_quantity', [1, 10]);
                    break;
                case 'out-of-stock':
                    $query->where('stock_quantity', 0);
                    break;
            }
        }
        
        if ($request->has('status') && $request->status) {
            switch ($request->status) {
                case 'active':
                    $query->where('is_active', true);
                    break;
                case 'inactive':
                    $query->where('is_active', false);
                    break;
                case 'featured':
                    $query->where('is_featured', true);
                    break;
            }
        }
        
        $products = $query->orderBy('name', 'asc')->paginate(20);
        
        return response()->json($products);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'is_active' => 'boolean',
            'is_featured' => 'boolean'
        ]);

        $product = Product::create($validated);
        return response()->json($product, 201);
    }

    public function show(Product $product)
    {
        $product->load('category');
        return response()->json($product);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'is_active' => 'boolean',
            'is_featured' => 'boolean'
        ]);

        $product->update($validated);
        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(['message' => 'Produit supprimé']);
    }
}