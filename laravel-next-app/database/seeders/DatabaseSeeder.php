<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'name' => 'testUser2',
            'email' => 'test2@example.com',
            'password' => Hash::make('password'),
        ]);

        $this->call([
            ProductSeeder::class
        ]);
            Product::factory()->count(8)->create();
    }
}
