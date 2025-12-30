<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageService
{
    /**
     * Create optimized versions of an uploaded image.
     *
     * @param UploadedFile $file
     * @param string $folder
     * @param int $quality
     * @return string Path to the optimized image
     */
    public function optimize(UploadedFile $file, string $folder = 'images', int $quality = 80): string
    {
        $filename = Str::random(40) . '.webp';
        $path = $folder . '/' . $filename;

        // Get original extension and dimensions
        $extension = $file->getClientOriginalExtension();
        $originalPath = $file->getRealPath();
        
        // Load image based on type
        switch (strtolower($extension)) {
            case 'jpeg':
            case 'jpg':
                $image = imagecreatefromjpeg($originalPath);
                break;
            case 'png':
                $image = imagecreatefrompng($originalPath);
                imagepalettetotruecolor($image);
                imagealphablending($image, true);
                imagesavealpha($image, true);
                break;
            case 'gif':
                $image = imagecreatefromgif($originalPath);
                break;
            default:
                // Fallback to basic storage if not supported by GD
                return $file->store($folder, 'public');
        }

        if (!$image) {
            return $file->store($folder, 'public');
        }

        // Capture output in a buffer
        ob_start();
        imagewebp($image, null, $quality);
        $content = ob_get_clean();

        // Save to public disk
        Storage::disk('public')->put($path, $content);

        // Free memory
        imagedestroy($image);

        return $path;
    }

    /**
     * Delete an image and its thumbnails if any.
     *
     * @param string $path
     * @return bool
     */
    public function delete(string $path): bool
    {
        if (Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->delete($path);
        }
        return false;
    }
}
