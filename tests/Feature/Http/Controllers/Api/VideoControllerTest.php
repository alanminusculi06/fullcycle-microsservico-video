<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Http\Controllers\Api\VideoController;
use App\Models\Category;
use App\Models\Genre;
use App\Models\Video;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Http\Request;
use Mockery;
use Tests\Exceptions\TestException;
use Tests\TestCase;
use Tests\Traits\TestSaves;
use Tests\Traits\TestValidations;

class VideoControllerTest extends TestCase
{
    use DatabaseMigrations, TestValidations, TestSaves;

    private $video;
    private $category;
    private $genre;
    private $sendData;

    protected function setUp(): void
    {
        parent::setUp();
        $this->video = factory(Video::class)->create();
        $this->category = factory(Category::class)->create();
        $this->genre = factory(Genre::class)->create();
        $this->sendData = [
            'title' => 'title test',
            'description' => 'description test',
            'year_launched' => 2020,
            'rating' => Video::RATING_LIST[0],
            'duration' => 90,
            'opened' => true,
        ];
    }

    public function testIndex()
    {
        $response = $this->get(route('videos.index'));
        $response
            ->assertStatus(200)
            ->assertJson([$this->video->toArray()]);
    }

    public function testInvalidationRequired()
    {
        $data = [
            'title' => '',
            'description' => '',
            'year_launched' => '',
            'rating' => '',
            'duration' => '',
            'categories_id' => '',
            'genres_id' => '',
        ];
        $this->assertInvalidationInStoreAction($data, 'required');
        $this->assertInvalidationInUpdateAction($data, 'required');
    }

    public function testInvalidationMax()
    {
        $data = [
            'title' => str_repeat('a', 256)
        ];
        $this->assertInvalidationInStoreAction($data, 'max.string', ['max' => 255]);
        $this->assertInvalidationInUpdateAction($data, 'max.string', ['max' => 255]);
    }

    public function testInvalidationInteger()
    {
        $data = [
            'duration' => 's'
        ];
        $this->assertInvalidationInStoreAction($data, 'integer');
        $this->assertInvalidationInUpdateAction($data, 'integer');
    }

    public function testInvalidationYearLaunchedField()
    {
        $data = [
            'year_launched' => 's'
        ];
        $this->assertInvalidationInStoreAction($data, 'date_format', ['format' => 'Y']);
        $this->assertInvalidationInUpdateAction($data, 'date_format', ['format' => 'Y']);
    }

    public function testInvalidationOpenedField()
    {
        $data = [
            'opened' => 's'
        ];
        $this->assertInvalidationInStoreAction($data, 'boolean');
        $this->assertInvalidationInUpdateAction($data, 'boolean');
    }

    public function testInvalidationRatingField()
    {
        $data = [
            'rating' => 's'
        ];
        $this->assertInvalidationInStoreAction($data, 'in');
        $this->assertInvalidationInUpdateAction($data, 'in');
    }

    public function testInvalidationCategoriesIdField()
    {
        $data = [
            'categories_id' => 'a'
        ];
        $this->assertInvalidationInStoreAction($data, 'array');
        $this->assertInvalidationInUpdateAction($data, 'array');

        $data = [
            'categories_id' => [100]
        ];
        $this->assertInvalidationInStoreAction($data, 'exists');
        $this->assertInvalidationInUpdateAction($data, 'exists');

        $category = factory(Category::class)->create();
        $category->delete();
        $data = [
            'categories_id' => [$category->id]
        ];
        $this->assertInvalidationInStoreAction($data, 'exists');
        $this->assertInvalidationInUpdateAction($data, 'exists');
    }

    public function testInvalidationGenresIdField()
    {
        $data = [
            'genres_id' => 'a'
        ];
        $this->assertInvalidationInStoreAction($data, 'array');
        $this->assertInvalidationInUpdateAction($data, 'array');

        $data = [
            'genres_id' => [100]
        ];
        $this->assertInvalidationInStoreAction($data, 'exists');
        $this->assertInvalidationInUpdateAction($data, 'exists');

        $genre = factory(Genre::class)->create();
        $genre->delete();
        $data = [
            'genres_id' => [$genre->id]
        ];
        $this->assertInvalidationInStoreAction($data, 'exists');
        $this->assertInvalidationInUpdateAction($data, 'exists');
    }

    public function testStore()
    {
        $this->assertStore(
            $this->sendData + ['categories_id' => [$this->category->id], 'genres_id' => [$this->genre->id]],
            $this->sendData
        );
        $response = $this->assertStore(
            $this->sendData + ['categories_id' => [$this->category->id], 'genres_id' => [$this->genre->id], 'opened' => false],
            $this->sendData + ['opened' => false]
        );
        $response->assertJsonStructure([
            'created_at',
            'deleted_at'
        ]);
    }

    public function testUpdate()
    {
        $this->assertUpdate(
            $this->sendData + ['categories_id' => [$this->category->id], 'genres_id' => [$this->genre->id]],
            $this->sendData
        );
        $response = $this->assertUpdate(
            $this->sendData + ['categories_id' => [$this->category->id], 'genres_id' => [$this->genre->id], 'opened' => false],
            $this->sendData + ['opened' => false]
        );
        $response->assertJsonStructure([
            'created_at',
            'deleted_at'
        ]);
    }

    protected function assertHasCategory($videoId, $categoryId)
    {
        $this->assertDatabaseHas('category_genre', [
            'video_id' => $videoId,
            'category_id' => $categoryId
        ]);
    }

    protected function assertHasGenre($videoId, $genreId)
    {
        $this->assertDatabaseHas('category_genre', [
            'video_id' => $videoId,
            'genre_id' => $genreId
        ]);
    }

    public function testRollbackStore()
    {
        $controller = Mockery::mock(VideoController::class)
            ->makePartial()
            ->shouldAllowMockingProtectedMethods();

        $controller
            ->shouldReceive('validate')
            ->withAnyArgs()
            ->andReturn($this->sendData);

        $controller
            ->shouldReceive('rulesStore')
            ->withAnyArgs()
            ->andReturn([]);

        $controller
            ->shouldReceive('handleRelations')
            ->once()
            ->andThrow(new TestException());

        $request = Mockery::mock(Request::class);

        $error = false;
        try {
            $controller->store($request);
        } catch (TestException $e) {
            $this->assertCount(1, Video::all());
            $error = true;
        }

        $this->assertTrue($error);
    }

    public function testRollbackUpdate()
    {
        $controller = Mockery::mock(VideoController::class)
            ->makePartial()
            ->shouldAllowMockingProtectedMethods();

        $controller
            ->shouldReceive('findOrFail')
            ->withAnyArgs()
            ->andReturns($this->video);

        $controller
            ->shouldReceive('validate')
            ->withAnyArgs()
            ->andReturn(['name' => 'test',]);

        $controller
            ->shouldReceive('rulesUpdate')
            ->withAnyArgs()
            ->andReturn([]);

        $controller
            ->shouldReceive('handleRelations')
            ->once()
            ->andThrow(new TestException());

        $request = Mockery::mock(Request::class);

        $error = false;
        try {
            $controller->update($request, 1);
        } catch (TestException $e) {
            $this->assertCount(1, Video::all());
            $error = true;
        }

        $this->assertTrue($error);
    }

    public function testSyncCategories()
    {
        $categoriesId = factory(Category::class, 3)->create()->pluck('id')->toArray();
        $genre = factory(Genre::class)->create();
        $genre->categories()->sync($categoriesId);
        $genreId = $genre->id;

        $response = $this->json(
            'POST',
            $this->routeStore(),
            $this->sendData + [
                'genres_id' => [$genreId],
                'categories_id' => [$categoriesId[0]]
            ]
        );
        $this->assertDatabaseHas('category_video', [
            'category_id' => $categoriesId[0],
            'video_id' => $response->json('id')
        ]);

        $response = $this->json(
            'PUT',
            route('videos.update', ['video' => $response->json('id')]),
            $this->sendData + [
                'genres_id' => [$genreId],
                'categories_id' => [$categoriesId[1], $categoriesId[2]]
            ]
        );
        $this->assertDatabaseMissing('category_video', [
            'category_id' => $categoriesId[0],
            'video_id' => $response->json('id')
        ]);
        $this->assertDatabaseHas('category_video', [
            'category_id' => $categoriesId[1],
            'video_id' => $response->json('id')
        ]);
        $this->assertDatabaseHas('category_video', [
            'category_id' => $categoriesId[2],
            'video_id' => $response->json('id')
        ]);
    }

    public function testSyncGenres()
    {
        $genres = factory(Genre::class, 3)->create();
        $genresId = $genres->pluck('id')->toArray();
        $categoryId = factory(Category::class)->create()->id;
        $genres->each(function ($genre) use ($categoryId) {
            $genre->categories()->sync($categoryId);
        });

        $response = $this->json(
            'POST',
            $this->routeStore(),
            $this->sendData + [
                'categories_id' => [$categoryId],
                'genres_id' => [$genresId[0]]
            ]
        );
        $this->assertDatabaseHas('genre_video', [
            'genre_id' => $genresId[0],
            'video_id' => $response->json('id')
        ]);

        $response = $this->json(
            'PUT',
            route('videos.update', ['video' => $response->json('id')]),
            $this->sendData + [
                'categories_id' => [$categoryId],
                'genres_id' => [$genresId[1], $genresId[2]]
            ]
        );
        $this->assertDatabaseMissing('genre_video', [
            'genre_id' => $genresId[0],
            'video_id' => $response->json('id')
        ]);
        $this->assertDatabaseHas('genre_video', [
            'genre_id' => $genresId[1],
            'video_id' => $response->json('id')
        ]);
        $this->assertDatabaseHas('genre_video', [
            'genre_id' => $genresId[2],
            'video_id' => $response->json('id')
        ]);
    }

    public function testShow()
    {
        $response = $this->json('GET', route('videos.show', [$this->video->id]));
        $response
            ->assertStatus(200)
            ->assertJson($this->video->toArray());
    }

    public function testDelete()
    {
        $response = $this->json('DELETE', route('videos.destroy', ['video' => $this->video->id]));
        $response->assertStatus(204);
        $this->assertNull(Video::find($this->video->id));
        $this->assertNotNull(Video::withTrashed()->find($this->video->id));
    }

    protected function routeStore()
    {
        return route('videos.store');
    }

    protected function routeUpdate()
    {
        return route('videos.update', ['video' => $this->video->id]);
    }

    protected function model()
    {
        return Video::class;
    }
}
