<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::getAll();
        
        // Return default values if no settings exist
        if (empty($settings)) {
            $settings = [
                'hero_title' => 'Hi, I\'m',
                'hero_name' => 'Your Name',
                'hero_subtitle' => 'Full Stack Developer',
                'about_title' => 'About Me',
                'about_description' => 'Your about description',
                'skills_title' => 'My Skills',
                'projects_title' => 'My Projects',
                'contact_title' => 'Get In Touch'
            ];
        }
        
        return response()->json($settings);
    }

    public function store(Request $request)
    {
        try {
            $data = $request->all();
            
            foreach ($data as $key => $value) {
                Setting::set($key, $value);
            }
            
            return response()->json([
                'message' => 'Settings saved successfully',
                'settings' => Setting::getAll()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to save settings',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
