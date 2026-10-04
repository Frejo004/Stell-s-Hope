<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UploadedFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    protected $imageService;

    public function __construct(\App\Services\ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $path = $this->imageService->optimize($request->file('file'));

        $record = UploadedFile::create([
            'user_id' => $request->user()->id,
            'path'    => $path,
            'disk'    => 'public',
        ]);

        return response()->json([
            'id'  => $record->id,
            'url' => Storage::url($path),
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
        $request->validate(['id' => 'required|integer']);

        $record = UploadedFile::findOrFail($request->id);

        if ($record->user_id !== $request->user()->id && !$request->user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        Storage::disk($record->disk)->delete($record->path);
        $record->delete();

        return response()->json(['message' => 'File deleted']);
    }
}
