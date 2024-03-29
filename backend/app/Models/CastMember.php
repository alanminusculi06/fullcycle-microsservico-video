<?php

namespace App\Models;

use App\Models\Traits\Uuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CastMember extends Model
{
    use Uuid, SoftDeletes;

    const TYPE_ACTOR = 1;
    const TYPE_DIRECTOR = 2;

    protected $keyType = 'string';
    protected $fillable = ['name', 'type'];
    protected $dates = ['deleted_at'];
    protected $casts = [
        'id' => 'string',
        'is_active' => 'boolean',
    ];
    public $incrementing = false;

    public static $types = [CastMember::TYPE_ACTOR, CastMember::TYPE_DIRECTOR];
}
