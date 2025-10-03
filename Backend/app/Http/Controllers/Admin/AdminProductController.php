<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category');

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->has('category')) {
            $query->where('category_id', $request->category);
        }

        if ($request->has('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $products = $query->orderBy('created_at', 'desc')
                         ->paginate($request->get('per_page', 15));

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'stock_quantity' => 'required|integer|min:0',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $product = Product::create($request->except('images'));

        if ($request->hasFile('images')) {
            $images = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                $images[] = Storage::url($path);
            }
            $product->update(['images' => json_encode($images)]);
        }

        return response()->json($product->load('category'), 201);
    }

    public function show(Product $product)
    {
        return response()->json($product->load(['category', 'reviews.user']));
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'stock_quantity' => 'required|integer|min:0',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $product->update($request->except('images'));

        if ($request->hasFile('images')) {
            // Supprimer les anciennes images
            if ($product->images) {
                $oldImages = json_decode($product->images, true);
                foreach ($oldImages as $oldImage) {
                    $path = str_replace('/storage/', '', $oldImage);
                    Storage::disk('public')->delete($path);
                }
            }

            // Ajouter les nouvelles images
            $images = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                $images[] = Storage::url($path);
            }
            $product->update(['images' => json_encode($images)]);
        }

        return response()->json($product->load('category'));
    }

    public function destroy(Product $product)
    {
        // Supprimer les images
        if ($product->images) {
            $images = json_decode($product->images, true);
            foreach ($images as $image) {
                $path = str_replace('/storage/', '', $image);
                Storage::disk('public')->delete($path);
            }
        }

        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }

    public function updateStatus(Request $request, Product $product)
    {
        $request->validate([
            'is_active' => 'required|boolean'
        ]);

        $product->update(['is_active' => $request->is_active]);
        return response()->json($product);
    }

    public function bulkUpdate(Request $request)
    {
        $request->validate([
            'product_ids' => 'required|array',
            'action' => 'required|in:activate,deactivate,delete'
        ]);

        $products = Product::whereIn('id', $request->product_ids);

        switch ($request->action) {
            case 'activate':
                $products->update(['is_active' => true]);
                break;
            case 'deactivate':
                $products->update(['is_active' => false]);
                break;
            case 'delete':
                $products->delete();
                break;
        }

        return response()->json(['message' => 'Bulk update completed']);
    }

    public function inventory()
    {
        $products = Product::select('id', 'name', 'stock_quantity', 'price')
                          ->where('stock_quantity', '<', 20)
                          ->orderBy('stock_quantity')
                          ->get();

        return response()->json($products);
    }

    public function updateStock(Request $request, Product $product)
    {
        $request->validate([
            'stock_quantity' => 'required|integer|min:0'
        ]);

        $product->update(['stock_quantity' => $request->stock_quantity]);
        return response()->json($product);
    }
}