<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductAttribute;
use Illuminate\Http\Request;

class AdminAttributeController extends Controller
{
    public function index()
    {
        $attributes = ProductAttribute::all();
        return response()->json($attributes);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'values' => 'required|array',
            'values.*' => 'string|max:255',
        ]);

        $attribute = ProductAttribute::create($validated);
        return response()->json($attribute, 201);
    }

    public function show(ProductAttribute $attribute)
    {
        return response()->json($attribute);
    }

    public function update(Request $request, ProductAttribute $attribute)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'values' => 'sometimes|array',
            'values.*' => 'string|max:255',
        ]);

        $attribute->update($validated);
        return response()->json($attribute);
    }

    public function destroy(ProductAttribute $attribute)
    {
        $attribute->delete();
        return response()->json(null, 204);
    }
}
