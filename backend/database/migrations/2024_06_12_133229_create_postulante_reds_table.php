<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostulanteRedsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('postulante_red', function (Blueprint $table) {
            $table->id('id_postulante_red');
            $table->unsignedInteger('id_postulante')->nullable();
            $table->string('nombre_red', 100)->nullable();
            $table->string('enlace', 100)->nullable();

            // Asegúrate de que la columna de clave foránea tenga el mismo tipo que la columna referenciada
            $table->foreign('id_postulante')->references('id_postulante')->on('postulante')->onDelete('cascade');
            
            $table->timestamps(); // Agregar timestamps por si acaso
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('postulante_red');
    }
}
