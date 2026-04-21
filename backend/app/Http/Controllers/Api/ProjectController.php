<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $projects = Project::latest()->get();
        return response()->json($projects);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'tech_stack' => 'required|string',
            'image' => 'nullable|string',
            'demo_link' => 'nullable|url',
            'github_link' => 'nullable|url'
        ]);

        $project = Project::create($validated);
        return response()->json($project, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $project = Project::findOrFail($id);
        return response()->json($project);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $project = Project::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'tech_stack' => 'sometimes|string',
            'image' => 'nullable|string',
            'demo_link' => 'nullable|url',
            'github_link' => 'nullable|url'
        ]);

        $project->update($validated);
        return response()->json($project);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $project = Project::findOrFail($id);
        $project->delete();
        return response()->json(['message' => 'Project deleted successfully']);
    }

    /**
     * Upload project image
     */
    public function uploadImage(Request $request)
    {
        try {
            \Log::info('=== IMAGE UPLOAD REQUEST START ===');
            \Log::info('Request method: ' . $request->method());
            \Log::info('Content-Type: ' . $request->header('Content-Type'));
            \Log::info('Content-Length: ' . $request->header('Content-Length'));
            \Log::info('Has file "image": ' . ($request->hasFile('image') ? 'YES' : 'NO'));
            \Log::info('All files: ' . json_encode(array_keys($request->allFiles())));
            \Log::info('Request size: ' . strlen($request->getContent()) . ' bytes');

            // Check if file exists in request
            if (!$request->hasFile('image')) {
                \Log::error('No image file found in request');
                \Log::info('Request input keys: ' . json_encode(array_keys($request->all())));
                return response()->json([
                    'success' => false,
                    'message' => 'No image file found in request. Make sure the field name is "image".'
                ], 400);
            }

            $image = $request->file('image');
            
            \Log::info('Image file received:', [
                'original_name' => $image->getClientOriginalName(),
                'size' => $image->getSize(),
                'mime_type' => $image->getMimeType(),
                'extension' => $image->getClientOriginalExtension(),
                'error' => $image->getError(),
                'is_valid' => $image->isValid()
            ]);

            // Check for upload errors
            if (!$image->isValid()) {
                $errorCode = $image->getError();
                $errorMessages = [
                    UPLOAD_ERR_INI_SIZE => 'File exceeds upload_max_filesize in php.ini',
                    UPLOAD_ERR_FORM_SIZE => 'File exceeds MAX_FILE_SIZE in HTML form',
                    UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
                    UPLOAD_ERR_NO_FILE => 'No file was uploaded',
                    UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
                    UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
                    UPLOAD_ERR_EXTENSION => 'A PHP extension stopped the file upload'
                ];
                $errorMessage = $errorMessages[$errorCode] ?? 'Unknown upload error';
                \Log::error('Upload error: ' . $errorMessage . ' (Code: ' . $errorCode . ')');
                return response()->json([
                    'success' => false,
                    'message' => $errorMessage,
                    'error_code' => $errorCode
                ], 400);
            }

            // Validate file
            $validator = \Validator::make($request->all(), [
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:20480' // 20MB
            ]);

            if ($validator->fails()) {
                \Log::error('Validation failed:', $validator->errors()->toArray());
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Clean filename - remove spaces and special characters
            $originalName = $image->getClientOriginalName();
            $cleanName = preg_replace('/[^A-Za-z0-9\-_\.]/', '_', $originalName);
            $filename = time() . '_' . $cleanName;
            
            \Log::info('Storing file as: ' . $filename);
            
            // Store the file
            $path = $image->storeAs('projects', $filename, 'public');
            
            if (!$path) {
                \Log::error('Failed to store file');
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to store file on server'
                ], 500);
            }
            
            $fullPath = storage_path('app/public/' . $path);
            \Log::info('File stored successfully:', [
                'path' => $path,
                'full_path' => $fullPath,
                'exists' => file_exists($fullPath),
                'size' => file_exists($fullPath) ? filesize($fullPath) : 0
            ]);

            $url = asset('storage/' . $path);
            \Log::info('Generated URL: ' . $url);
            \Log::info('=== IMAGE UPLOAD SUCCESS ===');

            return response()->json([
                'success' => true,
                'url' => $url,
                'path' => $path,
                'filename' => $filename
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation exception:', ['errors' => $e->errors()]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Upload exception:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Server error: ' . $e->getMessage()
            ], 500);
        }
    }
}
