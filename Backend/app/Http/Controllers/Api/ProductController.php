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
        
        // Filtre par catégorie
        if ($request->has('category')) {
            $query->where('category_id', $request->category);
        }
        
        // Filtre par recherche
        if ($request->has('search') && !empty($request->search)) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }
        
        // Filtre par prix
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }
        
        // Tri
        $sortBy = $request->get('sort', 'created_at');
        switch ($sortBy) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'popularity':
                $query->orderBy('created_at', 'desc'); // Temporaire
                break;
            case 'rating':
                $query->orderBy('created_at', 'desc'); // Temporaire
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }
        
        // Gérer le paramètre per_page avec une valeur par défaut de 20
        $perPage = $request->get('per_page', 20);
        $perPage = min($perPage, 100); // Limiter à 100 maximum
        
        $products = $query->paginate($perPage);
        
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

    public function searchSuggestions(Request $request)
    {
        $query = $request->get('query', '');

        if (empty($query)) {
            return response()->json([]);
        }

        $suggestions = Product::where('is_active', true)
                              ->where('name', 'like', '%' . $query . '%')
                              ->limit(10)
                              ->pluck('name');

        return response()->json($suggestions);
    }

    public function debug()
    {
        $product = Product::first();
        return response()->json([
            'raw_images' => $product->getRawOriginal('images'),
            'processed_images' => $product->images,
            'product' => $product
        ]);
    }
}