use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

public function store(Request $request)
{
    $request->validate([
        'title' => 'required|string',
        'image' => 'required|image|max:2048',
    ]);

    $file = $request->file('image');

    // Upload to Cloudinary
    $response = Http::attach(
        'file',
        file_get_contents($file),
        $file->getClientOriginalName()
    )->post('https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', [
        'upload_preset' => 'YOUR_UPLOAD_PRESET'
    ]);

    $data = $response->json();

    if (!isset($data['secure_url'])) {
        return response()->json([
            'error' => 'Image upload failed',
            'details' => $data
        ], 500);
    }

    // Save project
    $project = new Project();
    $project->title = $request->title;
    $project->image = $data['secure_url']; // 🔥 THIS IS THE FIX
    $project->save();

    return response()->json($project, 201);
}