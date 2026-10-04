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
                $query->leftJoin('order_items as oi_pop', 'products.id', '=', 'oi_pop.product_id')
                    ->selectRaw('products.*, COALESCE(SUM(oi_pop.quantity), 0) as total_sold')
                    ->groupBy('products.id')
                    ->orderBy('total_sold', 'desc');
                break;
            case 'rating':
                $query->leftJoin('reviews as rv_rat', function ($join) {
                        $join->on('products.id', '=', 'rv_rat.product_id')
                             ->where('rv_rat.is_approved', true);
                    })
                    ->selectRaw('products.*, COALESCE(AVG(rv_rat.rating), 0) as avg_rating')
                    ->groupBy('products.id')
                    ->orderBy('avg_rating', 'desc');
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
            ->leftJoin('order_items as oi_bs', 'products.id', '=', 'oi_bs.product_id')
            ->leftJoin('orders as o_bs', function ($join) {
                $join->on('oi_bs.order_id', '=', 'o_bs.id')
                     ->where('o_bs.payment_status', 'paid');
            })
            ->selectRaw('products.*, COALESCE(SUM(oi_bs.quantity), 0) as total_sold')
            ->groupBy('products.id')
            ->orderBy('total_sold', 'desc')
            ->with('category')
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

}
