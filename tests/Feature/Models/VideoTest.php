<?php

namespace Tests\Feature\Models;

use App\Models\Video;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class VideoTest extends TestCase
{
    use DatabaseMigrations;

    public function testRollbackCreate()
    {
        $error = false;
        try {
            Video::create([
                'title' => 'title test',
                'description' => 'description test',
                'year_launched' => 2020,
                'rating' => Video::RATING_LIST[0],
                'duration' => 90,
                'opened' => true,
                'categories_id' => [0, 1, 2]
            ]);
        } catch (QueryException $e) {
            $this->assertCount(0, Video::all());
            $error = true;
        }

        $this->assertTrue($error);
    }

    public function testRollbackUpdate()
    {
        $video = factory(Video::class)->create();
        $videoTitle = $video->title;

        try {
            $video->update([
                'title' => 'title test',
                'description' => 'description test',
                'year_launched' => 2020,
                'rating' => Video::RATING_LIST[0],
                'duration' => 90,
                'opened' => true,
                'categories_id' => [0, 1, 2]
            ]);
        } catch (QueryException $e) {
            $this->assertDatabaseHas('videos', [
                'title' => $videoTitle
            ]);
            $error = true;
        }

        $this->assertTrue($error);
    }
}
