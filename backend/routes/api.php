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
    Route::resource('genres', 'GenreController', $exceptCreateEdit);
    Route::resource('cast_members', 'CastMemberController', $exceptCreateEdit);
    Route::resource('videos', 'VideoController', $exceptCreateEdit);
});
