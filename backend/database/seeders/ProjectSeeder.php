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
            'title' => 'E-Commerce Platform',
            'description' => 'A full-featured e-commerce platform with payment integration',
            'tech_stack' => 'Laravel, Vue.js, MySQL, Stripe',
            'image' => 'https://via.placeholder.com/400x300',
            'demo_link' => 'https://example.com/demo1'
        ]);

        \App\Models\Project::create([
            'title' => 'Task Management App',
            'description' => 'Real-time task management application with team collaboration',
            'tech_stack' => 'React, Node.js, MongoDB, Socket.io',
            'image' => 'https://via.placeholder.com/400x300',
            'demo_link' => 'https://example.com/demo2'
        ]);

        \App\Models\Project::create([
            'title' => 'Portfolio Website',
            'description' => 'Modern portfolio website with admin dashboard',
            'tech_stack' => 'Laravel, React, Tailwind CSS',
            'image' => 'https://via.placeholder.com/400x300',
            'demo_link' => 'https://example.com/demo3'
        ]);
    }
}
