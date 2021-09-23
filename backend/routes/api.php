<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['namespace' => 'Api'], function () {
    $exceptCreateEdit = [
        'except' => ['create', 'edit']
    ];
    Route::resource('categories', 'CategoryController', $exceptCreateEdit);
    Route::delete('categories', 'CategoryController@destroyCollection');
    Route::resource('genres', 'GenreController', $exceptCreateEdit);
    Route::delete('genres', 'GenreController@destroyCollection');
    Route::resource('cast-members', 'CastMemberController', $exceptCreateEdit);
    Route::delete('cast-members', 'CastMemberController@destroyCollection');
    Route::resource('videos', 'VideoController', $exceptCreateEdit);
    Route::delete('videos', 'VideoController@destroyCollection');
});
