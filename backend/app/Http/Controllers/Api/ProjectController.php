<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (Schema::hasColumn('projects', 'order')) {
            $projects = Project::orderBy('order', 'asc')->orderBy('created_at', 'desc')->get();
        } else {
            $projects = Project::latest()->get();
        }

        // Apply saved custom project order sequence from database settings
        $savedOrderRaw = Setting::get('projects_order');
        if ($savedOrderRaw) {
            $savedOrder = is_array($savedOrderRaw) ? $savedOrderRaw : json_decode($savedOrderRaw, true);
            if (is_array($savedOrder) && !empty($savedOrder)) {
                $projects = $projects->sortBy(function ($item) use ($savedOrder) {
                    $idx = array_search($item->id, $savedOrder);
                    return $idx !== false ? $idx : 9999;
                })->values();
            }
        }

        // Ensure every project object has sequential order index attached
        $projects->each(function ($item, $idx) {
            $item->order = $idx;
        });

        return response()->json($projects);
    }

    /**
     * Update display order of projects.
     */
    public function reorder(Request $request)
    {
        try {
            $orders = $request->input('orders', []);
            if (!is_array($orders)) {
                return response()->json(['error' => 'Invalid orders payload format'], 422);
            }

            // 1. Permanently persist order sequence into database settings table
            $idOrder = [];
            foreach ($orders as $item) {
                if (isset($item['id'])) {
                    $idOrder[] = (int) $item['id'];
                }
            }
            if (!empty($idOrder)) {
                Setting::set('projects_order', json_encode($idOrder));
            }

            // 2. Try creating the 'order' column if not already present
            if (!Schema::hasColumn('projects', 'order')) {
                try {
                    Schema::table('projects', function ($table) {
                        $table->integer('order')->default(0)->nullable();
                    });
                } catch (\Exception $ex) {
                    Log::info('Could not auto-add order column: ' . $ex->getMessage());
                }
            }

            // 3. Update 'order' column on individual project rows if column exists
            if (Schema::hasColumn('projects', 'order')) {
                foreach ($orders as $item) {
                    if (isset($item['id']) && isset($item['order'])) {
                        Project::where('id', $item['id'])->update(['order' => (int) $item['order']]);
                    }
                }
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Projects display order updated successfully and permanently stored in database.'
            ]);
        } catch (\Exception $e) {
            Log::error('Projects reorder error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to save project order.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            Log::info('Project store request received', [
                'has_file' => $request->hasFile('image'),
                'all_files' => array_keys($request->allFiles()),
                'all_inputs' => array_keys($request->all())
            ]);

            $rules = [
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'tech_stack' => 'required|string',
                'image_url' => 'nullable|string',
                'demo_link' => 'nullable|string',
                'github_link' => 'nullable|string'
            ];

            // If an actual file is uploaded under 'image'
            if ($request->hasFile('image')) {
                $rules['image'] = 'nullable|file|mimes:jpeg,png,jpg,gif,webp,svg,avif,bmp|max:20480';
            } else {
                // If 'image' is passed as a string (URL or path) or empty
                $rules['image'] = 'nullable|string';
            }

            $validated = $request->validate($rules);

            $imageUrl = $validated['image_url'] ?? null;
            if (!$imageUrl && !empty($validated['image']) && is_string($validated['image'])) {
                $imageUrl = $validated['image'];
            }

            // If image file is uploaded, upload to Cloudinary or store locally
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                
                $cloudName = env('CLOUDINARY_CLOUD_NAME', 'dvwzujlid');
                $uploadPreset = env('CLOUDINARY_UPLOAD_PRESET', 'projects_upload');

                Log::info('Uploading to Cloudinary', [
                    'cloud_name' => $cloudName,
                    'upload_preset' => $uploadPreset,
                    'file_name' => $file->getClientOriginalName()
                ]);

                try {
                    // Upload to Cloudinary with timeout
                    $response = Http::timeout(15)->attach(
                        'file',
                        file_get_contents($file->getRealPath()),
                        $file->getClientOriginalName()
                    )->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload", [
                        'upload_preset' => $uploadPreset,
                        'folder' => 'portfolio/projects'
                    ]);

                    $data = $response->json();

                    if (isset($data['secure_url'])) {
                        $imageUrl = $data['secure_url'];
                        Log::info('Cloudinary upload successful', ['url' => $imageUrl]);
                    } else {
                        Log::warning('Cloudinary upload response without secure_url', ['response' => $data]);
                    }
                } catch (\Exception $e) {
                    Log::warning('Cloudinary upload failed: ' . $e->getMessage());
                }

                // If Cloudinary failed or didn't return a secure_url, fallback to local storage
                if (!$imageUrl) {
                    $originalName = $file->getClientOriginalName();
                    $cleanName = preg_replace('/[^A-Za-z0-9\-_\.]/', '_', $originalName);
                    $filename = time() . '_' . $cleanName;
                    $path = $file->storeAs('projects', $filename, 'public');
                    $imageUrl = asset('storage/' . $path);
                    Log::info('Stored image locally as fallback', ['url' => $imageUrl]);
                }
            }

            // Format demo and github links if provided without protocol
            $demoLink = $validated['demo_link'] ?? null;
            if ($demoLink && !preg_match('~^(?:f|ht)tps?://~i', $demoLink)) {
                $demoLink = 'https://' . $demoLink;
            }

            $githubLink = $validated['github_link'] ?? null;
            if ($githubLink && !preg_match('~^(?:f|ht)tps?://~i', $githubLink)) {
                $githubLink = 'https://' . $githubLink;
            }

            $newProjectData = [
                'title' => $validated['title'],
                'description' => $validated['description'],
                'tech_stack' => $validated['tech_stack'],
                'image' => $imageUrl,
                'demo_link' => $demoLink,
                'github_link' => $githubLink
            ];

            if (Schema::hasColumn('projects', 'order')) {
                $maxOrder = Project::max('order');
                $newProjectData['order'] = ($maxOrder !== null) ? ($maxOrder + 1) : 0;
            }

            $project = Project::create($newProjectData);

            Log::info('Project created successfully', ['id' => $project->id]);

            return response()->json($project, 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation failed', ['errors' => $e->errors()]);
            return response()->json([
                'error' => 'Validation failed',
                'message' => implode(' ', array_map(fn($errs) => implode(' ', (array)$errs), $e->errors())),
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Project creation error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'error' => 'Failed to create project',
                'message' => $e->getMessage()
            ], 500);
        }
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
        try {
            $project = Project::findOrFail($id);
            
            $rules = [
                'title' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'tech_stack' => 'sometimes|string',
                'image_url' => 'nullable|string',
                'demo_link' => 'nullable|string',
                'github_link' => 'nullable|string'
            ];

            if ($request->hasFile('image')) {
                $rules['image'] = 'nullable|file|mimes:jpeg,png,jpg,gif,webp,svg,avif,bmp|max:20480';
            } else {
                $rules['image'] = 'nullable|string';
            }

            $validated = $request->validate($rules);

            // If image file is uploaded, upload to Cloudinary or store locally
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $cloudName = env('CLOUDINARY_CLOUD_NAME', 'dvwzujlid');
                $uploadPreset = env('CLOUDINARY_UPLOAD_PRESET', 'projects_upload');

                $imageUrl = null;
                try {
                    $response = Http::timeout(15)->attach(
                        'file',
                        file_get_contents($file->getRealPath()),
                        $file->getClientOriginalName()
                    )->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload", [
                        'upload_preset' => $uploadPreset,
                        'folder' => 'portfolio/projects'
                    ]);

                    $data = $response->json();
                    if (isset($data['secure_url'])) {
                        $imageUrl = $data['secure_url'];
                    }
                } catch (\Exception $e) {
                    Log::warning('Cloudinary update failed: ' . $e->getMessage());
                }

                if (!$imageUrl) {
                    $originalName = $file->getClientOriginalName();
                    $cleanName = preg_replace('/[^A-Za-z0-9\-_\.]/', '_', $originalName);
                    $filename = time() . '_' . $cleanName;
                    $path = $file->storeAs('projects', $filename, 'public');
                    $imageUrl = asset('storage/' . $path);
                }

                $validated['image'] = $imageUrl;
            } elseif (isset($validated['image_url'])) {
                $validated['image'] = $validated['image_url'];
            }

            if (isset($validated['demo_link']) && $validated['demo_link'] && !preg_match('~^(?:f|ht)tps?://~i', $validated['demo_link'])) {
                $validated['demo_link'] = 'https://' . $validated['demo_link'];
            }

            if (isset($validated['github_link']) && $validated['github_link'] && !preg_match('~^(?:f|ht)tps?://~i', $validated['github_link'])) {
                $validated['github_link'] = 'https://' . $validated['github_link'];
            }

            unset($validated['image_url']);
            $project->update($validated);
            
            return response()->json($project);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation failed on update', ['errors' => $e->errors()]);
            return response()->json([
                'error' => 'Validation failed',
                'message' => implode(' ', array_map(fn($errs) => implode(' ', (array)$errs), $e->errors())),
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Project update error', [
                'message' => $e->getMessage()
            ]);
            return response()->json([
                'error' => 'Failed to update project',
                'message' => $e->getMessage()
            ], 500);
        }
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
