<?php

namespace Tests\Feature\Models;

use App\Models\CastMember;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class CastMemberTest extends TestCase
{
    use DatabaseMigrations;

    public function testCreate()
    {
        $castMember = CastMember::create(['name' => 'test1', 'type' => CastMember::TYPE_ACTOR]);
        $castMember->refresh();

        $this->assertEquals('test1', $castMember->name);
        $this->assertEquals(CastMember::TYPE_ACTOR, $castMember->type);
        $this->assertTrue((bool)preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/', $castMember->id));

        $castMember = CastMember::create(['name' => 'test1', 'type' =>  CastMember::TYPE_DIRECTOR]);
        $this->assertEquals(CastMember::TYPE_DIRECTOR, $castMember->type);
    }

    public function testUpdate()
    {
        $castMember = factory(CastMember::class)->create([
            'type' => CastMember::TYPE_ACTOR
        ])->first();

        $castMember->update([
            'name' => 'test name updated',
            'type' => CastMember::TYPE_DIRECTOR
        ]);

        $this->assertEquals('test name updated', $castMember->name);
        $this->assertEquals(CastMember::TYPE_DIRECTOR, $castMember->type);
    }

    public function testList()
    {
        factory(CastMember::class, 1)->create();
        $castMembers = CastMember::all();

        $castMemberKeys = array_keys($castMembers->first()->getAttributes());

        $this->assertCount(1, $castMembers);
        $this->assertEqualsCanonicalizing(
            ['created_at', 'deleted_at', 'id', 'name', 'type', 'updated_at'],
            $castMemberKeys
        );
    }

    public function testDelete()
    {
        factory(CastMember::class, 1)->create();
        CastMember::truncate();
        $castMemberKeys = CastMember::all();
        $this->assertCount(0, $castMemberKeys);
    }
}
