<?php

use App\Models\Genre;
use App\Models\Video;
use App\Models\CastMember;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File as FacadesFile;
use Illuminate\Support\Facades\Storage;

class VideoSeeder extends Seeder
{
    private $allGenres;
    private $allCastMembers;
    private $relations = [
        'genres_id' => [],
        'categories_id' => []
    ];

    public function run()
    {
        $dir = Storage::getDriver()->getAdapter()->getPathPrefix();
        FacadesFile::deleteDirectory($dir, true);

        $self = $this;
        $this->allGenres = Genre::all();
        $this->allCastMembers = CastMember::all();
        Model::reguard();
        factory(Video::class, 30)
            ->make()
            ->each(function (Video $video) use ($self) {
                $self->fetchRelations();
                Video::create(
                    array_merge(
                        $video->toArray(),
                        [
                            'thumb_file' => $self->getImageFile(),
                            'banner_file' => $self->getImageFile(),
                            'trailer_file' => $self->getVideoFile(),
                            'video_file' => $self->getVideoFile(),
                        ]
                    )
                );
            });
        Model::unguard();
    }

    private function fetchRelations()
    {
        $subGenres = $this->allGenres->random(5)->load('categories');
        $categoriesId = [];
        foreach ($subGenres as $genre) {
            array_push($categoriesId, ...$genre->categories->pluck('id')->toArray());
        }
        $categoriesId = array_unique($categoriesId);
        $genresId = $subGenres->pluck('id')->toArray();
        $this->relations['categories_id'] = $categoriesId;
        $this->relations['genres_id'] = $genresId;
        $this->relations['cast_members_id'] = $this->allCastMembers->random(3)->pluck('id')->toArray();
    }

    public function getImageFile()
    {
        return new UploadedFile(
            storage_path('faker/thumbs/Laravel Framework.jpg'),
            'Laravel Framework.png'
        );
    }

    public function getVideoFile()
    {
        return new UploadedFile(
            storage_path('faker/videos/Como Instalar o Laravel.mp4'),
            'Como Instalar o Laravel.mp4'
        );
    }
}
