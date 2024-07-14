<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostulantesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('postulante', function (Blueprint $table) {
            $table->increments('id_postulante');
            $table->unsignedBigInteger('id_ubicacion');
            $table->unsignedBigInteger('id_usuario');
            $table->string('nombres', 50);
            $table->string('apellidos', 50);
            $table->date('fecha_nac')->nullable();
            $table->integer('edad')->nullable();
            $table->string('estado_civil', 30)->nullable();
            $table->string('cedula', 10)->nullable();
            $table->string('telefono', 10)->nullable();
            $table->string('genero', 30)->nullable();
            $table->string('informacion_extra', 1000)->nullable();
            $table->string('foto', 500)->nullable();
            $table->string('cv', 500)->nullable();
            $table->boolean('vigencia')->default(1); 

            // Agregar claves foráneas
            $table->foreign('id_ubicacion')->references('id')->on('ubicacion')->onDelete('cascade');
            $table->foreign('id_usuario')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('postulante');
    }
}
