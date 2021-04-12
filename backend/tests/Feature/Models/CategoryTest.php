<?php

namespace Tests\Feature\Models;

use App\Models\Category;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use DatabaseMigrations;

    public function testCreate()
    {
        $category = Category::create(['name' => 'test1']);
        $category->refresh();

        $this->assertEquals('test1', $category->name);
        $this->assertNull($category->description);
        $this->assertTrue($category->is_active);
        $this->assertTrue((bool)preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/', $category->id));

        $category = Category::create(['name' => 'test1', 'description' => null]);
        $this->assertNull($category->description);

        $category = Category::create(['name' => 'test1', 'description' => 'test description']);
        $this->assertEquals('test description', $category->description);

        $category = Category::create(['name' => 'test1', 'is_active' => false]);
        $this->assertFalse($category->is_active);

        $category = Category::create(['name' => 'test1', 'is_active' => true]);
        $this->assertTrue($category->is_active);
    }

    public function testUpdate()
    {
        $category = factory(Category::class)->create([
            'description' => 'test description',
            'is_active' => false
        ])->first();

        $category->update([
            'name' => 'test name updated',
            'description' => 'test description updated',
            'is_active' => true
        ]);

        $this->assertEquals('test name updated', $category->name);
        $this->assertEquals('test description updated', $category->description);
        $this->assertTrue($category->is_active);
    }

    public function testList()
    {
        factory(Category::class, 1)->create();
        $categories = Category::all();

        $categoryKeys = array_keys($categories->first()->getAttributes());

        $this->assertCount(1, $categories);
        $this->assertEqualsCanonicalizing(
            ['id', 'name', 'description', 'created_at', 'updated_at', 'deleted_at', 'is_active'],
            $categoryKeys
        );
    }

    public function testDelete()
    {
        $category = Category::create(['name' => 'Test Delete']);
        $category->refresh();
        Category::where('id', $category->id)->delete();
        $categories = Category::find($category->id);
        $this->assertNull($categories);
    }
}
