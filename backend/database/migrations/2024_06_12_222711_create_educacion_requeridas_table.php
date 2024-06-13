<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEducacionRequeridasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('educacion_requerida', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_oferta');
            $table->unsignedBigInteger('titulo');
            $table->foreign('id_oferta')->references('id_oferta')->on('oferta')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('educacion_requerida');
    }
}
