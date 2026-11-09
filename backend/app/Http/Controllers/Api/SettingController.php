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
                'hero_title' => 'Full Stack',
                'hero_name' => 'Mekdelawit Habtamu',
                'hero_subtitle' => 'Developer & System Builder',
                'about_title' => 'About Me',
                'about_description' => 'A dedicated software engineer specializing in robust and scalable web applications. My foundation was built at Wollo University, focused on strong engineering principles and problem-solving. With a particular focus on Vue and Laravel, I develop complete end-to-end solutions that balance performance, clean architecture, and intuitive user experiences.',
                'skills_title' => 'Skills & Technologies',
                'projects_title' => 'My Projects',
                'contact_title' => "Let's Work Together"
            ];
        } else {
            // Clean up any placeholder values from legacy seeds
            if (isset($settings['hero_name']) && strtolower(trim($settings['hero_name'])) === 'your name') {
                $settings['hero_name'] = 'Mekdelawit Habtamu';
            }
            if (isset($settings['hero_title']) && (stripos($settings['hero_title'], "hi, i'm") !== false || stripos($settings['hero_title'], "hi i'm") !== false)) {
                $settings['hero_title'] = 'Full Stack';
            }
            if (isset($settings['contact_title']) && strtolower(trim($settings['contact_title'])) === 'get in touch') {
                $settings['contact_title'] = "Let's Work Together";
            }
            if (isset($settings['about_description'])) {
                $settings['about_description'] = str_ireplace('React and Laravel', 'Vue and Laravel', $settings['about_description']);
            }
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
