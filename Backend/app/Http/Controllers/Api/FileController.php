<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'type' => 'required|in:product,category,user'
        ]);

        $file = $request->file('file');
        $type = $request->type;
        
        // Générer un nom de fichier unique
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        
        // Définir le chemin selon le type
        $path = match($type) {
            'product' => 'products',
            'category' => 'categories',
            'user' => 'users',
            default => 'uploads'
        };
        
        // Stocker le fichier
        $storedPath = $file->storeAs($path, $filename, 'public');
        
        return response()->json([
            'filename' => $filename,
            'path' => $storedPath,
            'url' => Storage::url($storedPath),
            'size' => $file->getSize(),
            'mime_type' => $file->getMimeType()
        ]);
    }

    public function delete(Request $request)
    {
        $request->validate([
            'path' => 'required|string'
        ]);

        $path = $request->path;
        
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
            return response()->json(['message' => 'File deleted successfully']);
        }

        return response()->json(['error' => 'File not found'], 404);
    }

    public function getImage($path)
    {
        if (Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->response($path);
        }

        return response()->json(['error' => 'Image not found'], 404);
    }
}