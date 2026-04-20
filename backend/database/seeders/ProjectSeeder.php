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
            'title' => 'unibite',
            'description' => 'fast delivery with delicious foods',
            'tech_stack' => 'React, Laravel, MySQL',
            'image' => 'https://via.placeholder.com/400x300',
            'demo_link' => ''
        ]);

        \App\Models\Project::create([
            'title' => 'inventory management system',
            'description' => 'reliable and really workable system',
            'tech_stack' => 'Laravel, MySQL',
            'image' => 'https://via.placeholder.com/400x300',
            'demo_link' => ''
        ]);
    }
}
