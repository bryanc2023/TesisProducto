<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $roles = [
            ['name' => 'admin'],
            ['name' => 'postulante'],
            ['name' => 'empresa_oferente'],
            ['name' => 'empresa_gestora'],
        ];

        DB::table('roles')->insert($roles);
    }
}
