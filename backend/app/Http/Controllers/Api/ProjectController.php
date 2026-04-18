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
            \Log::info('Upload request received', [
                'has_file' => $request->hasFile('image'),
                'files' => $request->allFiles(),
                'content_length' => $request->header('Content-Length'),
                'content_type' => $request->header('Content-Type')
            ]);

            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:20480' // Increased to 20MB
            ]);

            if ($request->hasFile('image')) {
                $image = $request->file('image');
                \Log::info('Image file details', [
                    'name' => $image->getClientOriginalName(),
                    'size' => $image->getSize(),
                    'mime' => $image->getMimeType(),
                    'error' => $image->getError()
                ]);

                // Clean filename - remove spaces and special characters
                $originalName = $image->getClientOriginalName();
                $cleanName = preg_replace('/[^A-Za-z0-9\-_\.]/', '_', $originalName);
                $filename = time() . '_' . $cleanName;
                
                $path = $image->storeAs('projects', $filename, 'public');
                
                \Log::info('Image stored', ['path' => $path]);

                return response()->json([
                    'success' => true,
                    'url' => asset('storage/' . $path),
                    'path' => $path
                ], 200);
            }

            \Log::error('No image file in request');
            return response()->json([
                'success' => false,
                'message' => 'No image file provided'
            ], 400);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation error', ['errors' => $e->errors()]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Upload error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
