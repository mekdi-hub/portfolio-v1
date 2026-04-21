<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Project::create([
            'title' => 'Unibite',
            'description' => 'A fast food delivery platform with real-time order tracking and delicious food options. Features include user authentication, restaurant management, and seamless checkout experience.',
            'tech_stack' => 'React, Laravel, MySQL, Tailwind CSS',
            'image' => 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
            'demo_link' => '',
            'github_link' => ''
        ]);

        \App\Models\Project::create([
            'title' => 'Inventory Management System',
            'description' => 'A comprehensive inventory management solution for tracking products, managing stock levels, and generating reports. Built with robust backend architecture for reliability and scalability.',
            'tech_stack' => 'Laravel, MySQL, Bootstrap, Chart.js',
            'image' => 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop',
            'demo_link' => '',
            'github_link' => ''
        ]);
    }
}
