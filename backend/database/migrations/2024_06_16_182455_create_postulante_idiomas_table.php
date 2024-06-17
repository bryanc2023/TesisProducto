<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostulanteIdiomasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('postulante_idioma', function (Blueprint $table) {
            $table->unsignedInteger('id_postulante');
            $table->unsignedBigInteger('id_idioma');
            $table->primary(['id_postulante', 'id_idioma']); // Definición de clave primaria compuesta
            $table->foreign('id_postulante')->references('id_postulante')->on('postulante')->onDelete('cascade');
            $table->foreign('id_idioma')->references('id')->on('idioma')->onDelete('cascade');
            $table->string('nivel_oral', 20);
            $table->string('nivel_escrito', 20);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('postulante_idioma');
    }
}
