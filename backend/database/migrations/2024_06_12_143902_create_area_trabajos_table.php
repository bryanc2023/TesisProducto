<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAreaTrabajosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('area_trabajo', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_area');
            $table->boolean('vigencia');
            $table->timestamps();
        });

        Schema::table('oferta',function (Blueprint $table){
            $table->foreign('id_area')->references('id')->on('area_trabajo')->onDelete('cascade');
        });

        
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('area_trabajo');
        Schema::table('oferta',function (Blueprint $table){
            $table->dropForeign(['id_area']);
            $table->dropColumn('id_area');
        });
        
    }
}
