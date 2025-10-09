<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $file = $request->file('file');
        $path = $file->store('images', 'public');

        return response()->json([
            'path' => $path,
            'url' => Storage::url($path)
        ]);
    }

    public function getImage($path)
    {
        if (!Storage::disk('public')->exists('images/' . $path)) {
            abort(404);
        }

        return response()->file(storage_path('app/public/images/' . $path));
    }

    public function delete(Request $request)
    {
        $request->validate(['path' => 'required|string']);
        
        if (Storage::disk('public')->exists($request->path)) {
            Storage::disk('public')->delete($request->path);
        }

        return response()->json(['message' => 'File deleted']);
    }
}