<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostulanteCompetenciasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('postulante_competencia', function (Blueprint $table) {
            $table->unsignedInteger('id_postulante');
            $table->unsignedBigInteger('id_competencia');
            $table->primary(['id_postulante', 'id_competencia']); // Definición de clave primaria compuesta
            $table->foreign('id_postulante')->references('id_postulante')->on('postulante')->onDelete('cascade');
            $table->foreign('id_competencia')->references('id')->on('competencia')->onDelete('cascade');
            $table->string('nivel', 20);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('postulante_competencia');
    }
}
