<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'variants.attributes']);
        
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
            'type' => 'required|in:simple,variable',
            'price' => 'required_if:type,simple|numeric|min:0|nullable',
            'stock_quantity' => 'required_if:type,simple|integer|min:0|nullable',
            'category_id' => 'required|exists:categories,id',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'images' => 'array',
            'variants' => 'required_if:type,variable|array',
            'variants.*.sku' => 'required|string|unique:product_variants,sku',
            'variants.*.price' => 'required|numeric|min:0',
            'variants.*.stock_quantity' => 'required|integer|min:0',
            'variants.*.attributes' => 'required|array',
        ]);

        DB::beginTransaction();

        try {
            $product = Product::create($validated);

            if ($request->type === 'variable' && !empty($request->variants)) {
                foreach ($request->variants as $variantData) {
                    $variant = $product->variants()->create([
                        'sku' => $variantData['sku'],
                        'price' => $variantData['price'],
                        'stock_quantity' => $variantData['stock_quantity'],
                    ]);

                    foreach ($variantData['attributes'] as $attributeId => $value) {
                        $variant->attributes()->attach($attributeId, ['value' => $value]);
                    }
                }
            }

            DB::commit();
            return response()->json($product->load('variants.attributes'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function show(Product $product)
    {
        $product->load(['category', 'variants.attributes']);
        return response()->json($product);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'type' => 'sometimes|in:simple,variable',
            'price' => 'sometimes|numeric|min:0|nullable',
            'stock_quantity' => 'sometimes|integer|min:0|nullable',
            'category_id' => 'sometimes|exists:categories,id',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'images' => 'array',
            'variants' => 'sometimes|array',
            'variants.*.id' => 'sometimes|exists:product_variants,id',
            'variants.*.sku' => 'sometimes|string',
            'variants.*.price' => 'sometimes|numeric|min:0',
            'variants.*.stock_quantity' => 'sometimes|integer|min:0',
            'variants.*.attributes' => 'sometimes|array',
        ]);

        DB::beginTransaction();

        try {
            $product->update($validated);

            if ($request->has('variants') && $product->type === 'variable') {
                $existingVariantIds = $product->variants->pluck('id')->toArray();
                $updatedVariantIds = [];

                foreach ($request->variants as $variantData) {
                    if (isset($variantData['id'])) {
                        // Mettre à jour la variante existante
                        $variant = $product->variants()->findOrFail($variantData['id']);
                        $variant->update([
                            'sku' => $variantData['sku'],
                            'price' => $variantData['price'],
                            'stock_quantity' => $variantData['stock_quantity'],
                        ]);

                        // Mettre à jour les attributs
                        $variant->attributes()->detach();
                        foreach ($variantData['attributes'] as $attributeId => $value) {
                            $variant->attributes()->attach($attributeId, ['value' => $value]);
                        }

                        $updatedVariantIds[] = $variant->id;
                    } else {
                        // Créer une nouvelle variante
                        $variant = $product->variants()->create([
                            'sku' => $variantData['sku'],
                            'price' => $variantData['price'],
                            'stock_quantity' => $variantData['stock_quantity'],
                        ]);

                        foreach ($variantData['attributes'] as $attributeId => $value) {
                            $variant->attributes()->attach($attributeId, ['value' => $value]);
                        }

                        $updatedVariantIds[] = $variant->id;
                    }
                }

                // Supprimer les variantes qui ne sont plus présentes
                $product->variants()
                    ->whereNotIn('id', $updatedVariantIds)
                    ->delete();
            }

            DB::commit();
            return response()->json($product->load('variants.attributes'));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function destroy(Product $product)
    {
        DB::beginTransaction();

        try {
            $product->variants()->delete();
            $product->delete();
            
            DB::commit();
            return response()->json(['message' => 'Produit supprimé']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erreur lors de la suppression du produit'], 500);
        }
    }
}