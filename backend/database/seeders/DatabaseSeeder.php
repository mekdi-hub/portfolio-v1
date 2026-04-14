<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed projects
        $this->call([
            ProjectSeeder::class,
        ]);

        // Seed sample messages
        \App\Models\Message::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'message' => 'Hi! I love your portfolio. Would you be interested in working on a project together?'
        ]);

        \App\Models\Message::create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'message' => 'Great work! I would like to discuss a potential collaboration opportunity.'
        ]);

        // Seed sample demo orders
        \App\Models\DemoOrder::create([
            'status' => 'pending',
            'assigned_rider' => null
        ]);

        \App\Models\DemoOrder::create([
            'status' => 'in_progress',
            'assigned_rider' => 'Rider #123'
        ]);

        \App\Models\DemoOrder::create([
            'status' => 'completed',
            'assigned_rider' => 'Rider #456'
        ]);

        // Create test user
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
