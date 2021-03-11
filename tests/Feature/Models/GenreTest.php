<?php

namespace Tests\Feature\Models;

use App\Models\Genre;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class GenreTest extends TestCase
{
    use DatabaseMigrations;

    public function testCreate()
    {
        $genre = Genre::create(['name' => 'test1']);
        $genre->refresh();

        $this->assertEquals('test1', $genre->name);
        $this->assertTrue($genre->is_active);
        $this->assertTrue((bool)preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/', $genre->id));

        $genre = Genre::create(['name' => 'test1', 'is_active' => false]);
        $this->assertFalse($genre->is_active);

        $genre = Genre::create(['name' => 'test1', 'is_active' => true]);
        $this->assertTrue($genre->is_active);
    }

    public function testUpdate()
    {
        $genre = factory(Genre::class)->create([
            'is_active' => false
        ])->first();

        $genre->update([
            'name' => 'test name updated',
            'is_active' => true
        ]);

        $this->assertEquals('test name updated', $genre->name);
        $this->assertTrue($genre->is_active);
    }

    public function testList()
    {
        factory(Genre::class, 1)->create();
        $genres = Genre::all();

        $genreKeys = array_keys($genres->first()->getAttributes());

        $this->assertCount(1, $genres);
        $this->assertEqualsCanonicalizing(
            ['id', 'name', 'created_at', 'updated_at', 'deleted_at', 'is_active'],
            $genreKeys
        );
    }

    public function testDelete()
    {
        $genre = Genre::create(['name' => 'Test Delete']);
        $genre->refresh();
        Genre::where('id', $genre->id)->delete();
        $genres = Genre::find($genre->id);
        $this->assertNull($genres);
    }
}
