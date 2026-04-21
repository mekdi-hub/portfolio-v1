<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class UploadController extends Controller
{
    /**
     * Upload image to Cloudinary
     */
    public function uploadImage(Request $request)
    {
        try {
            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
            ]);

            $file = $request->file('image');
            
            // Cloudinary credentials
            $cloudName = 'dvwzujlid';
            $uploadPreset = 'projects_upload';

            Log::info('Uploading to Cloudinary', [
                'cloud_name' => $cloudName,
                'upload_preset' => $uploadPreset,
                'file_name' => $file->getClientOriginalName()
            ]);

            // Upload to Cloudinary
            $response = Http::attach(
                'file',
                file_get_contents($file->getRealPath()),
                $file->getClientOriginalName()
            )->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload", [
                'upload_preset' => $uploadPreset,
                'folder' => 'portfolio/projects'
            ]);

            $data = $response->json();

            // Check if upload was successful
            if (!isset($data['secure_url'])) {
                Log::error('Cloudinary upload failed', ['response' => $data]);
                
                return response()->json([
                    'error' => 'Image upload failed',
                    'message' => $data['error']['message'] ?? 'Unknown error occurred',
                    'details' => $data
                ], 500);
            }

            Log::info('Cloudinary upload successful', [
                'url' => $data['secure_url'],
                'public_id' => $data['public_id']
            ]);

            // Return the image URL
            return response()->json([
                'success' => true,
                'url' => $data['secure_url'],
                'public_id' => $data['public_id'],
                'width' => $data['width'],
                'height' => $data['height'],
                'format' => $data['format']
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'message' => $e->getMessage(),
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Image upload error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Upload failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete image from Cloudinary
     */
    public function deleteImage(Request $request)
    {
        try {
            $request->validate([
                'public_id' => 'required|string'
            ]);

            // Cloudinary credentials
            $cloudName = 'dvwzujlid';
            $apiKey = '437222665867748';
            $apiSecret = 'ca0QxPDlanPTUxoP-Qvq1jKyxWs';

            // Generate signature for deletion
            $timestamp = time();
            $publicId = $request->public_id;
            $signature = sha1("public_id={$publicId}&timestamp={$timestamp}{$apiSecret}");

            // Delete from Cloudinary
            $response = Http::asForm()->post(
                "https://api.cloudinary.com/v1_1/{$cloudName}/image/destroy",
                [
                    'public_id' => $publicId,
                    'signature' => $signature,
                    'api_key' => $apiKey,
                    'timestamp' => $timestamp
                ]
            );

            $data = $response->json();

            return response()->json([
                'success' => true,
                'result' => $data['result'] ?? 'deleted'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Image deletion error', [
                'message' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Deletion failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
