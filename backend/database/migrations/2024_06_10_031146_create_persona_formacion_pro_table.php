<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePersonaFormacionProTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('persona_formacion_pro', function (Blueprint $table) {
            $table->unsignedInteger('id_postulante');
            $table->unsignedBigInteger('id_titulo');
            $table->primary(['id_postulante', 'id_titulo']); // Definición de clave primaria compuesta
            $table->foreign('id_postulante')->references('id_postulante')->on('postulante')->onDelete('cascade');
            $table->foreign('id_titulo')->references('id')->on('titulo')->onDelete('cascade');
            $table->string('institucion', 220);
            $table->string('estado', 30);
            $table->date('fecha_ini')->nullable();
            $table->date('fecha_fin')->nullable();
            // Aquí puedes agregar más columnas si es necesario
           
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('persona_formacion_pro');
    }
}
