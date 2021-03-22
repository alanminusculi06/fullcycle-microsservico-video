<?php

use App\Models\Category;
use Illuminate\Database\Seeder;
use App\Models\Genre;

class GenreSeeder extends Seeder
{
    public function run()
    {
        // factory(Genre::class, 10)->create();
        $categories = Category::all();
        factory(Genre::class, 100)
            ->create()
            ->each(function (Genre $genre) use ($categories) {
                $categoriesId = $categories->random(5)->pluck('id')->toArray();
                $genre->categories()->attach($categoriesId);
            });
    }
}
