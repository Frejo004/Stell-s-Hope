<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class AdminInventoryController extends Controller
{
    public function index()
    {
        $inventory = Product::select('id', 'name', 'price', 'stock_quantity', 'category_id', 'images')
                           ->with('category:id,name')
                           ->get()
                           ->map(function ($product) {
                               return [
                                   'id' => $product->id,
                                   'name' => $product->name,
                                   'price' => $product->price,
                                   'stock' => $product->stock_quantity ?? 0,
                                   'reserved' => rand(0, 5),
                                   'reorderLevel' => 5,
                                   'category' => $product->category->name ?? 'Non catégorisé',
                                   'image' => $product->images[0] ?? '/placeholder.jpg',
                                   'supplier' => 'Fournisseur ' . rand(1, 3)
                               ];
                           });

        $stats = [
            'total' => $inventory->count(),
            'inStock' => $inventory->where('stock', '>', 5)->count(),
            'lowStock' => $inventory->where('stock', '<=', 5)->where('stock', '>', 0)->count(),
            'outOfStock' => $inventory->where('stock', 0)->count(),
            'totalUnits' => $inventory->sum('stock')
        ];

        return response()->json([
            'inventory' => $inventory,
            'stats' => $stats
        ]);
    }

    public function updateStock(Request $request, Product $product)
    {
        $request->validate([
            'stock' => 'required|integer|min:0'
        ]);

        $product->update(['stock_quantity' => $request->stock]);

        return response()->json(['message' => 'Stock mis à jour']);
    }
}