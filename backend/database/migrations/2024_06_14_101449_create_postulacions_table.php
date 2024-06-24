<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostulacionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('postulacion', function (Blueprint $table) {
            $table->unsignedBigInteger('id_oferta');
            $table->unsignedInteger('id_postulante');
            $table->primary(['id_oferta', 'id_postulante']); 
            $table->foreign('id_oferta')->references('id_oferta')->on('oferta')->onDelete('cascade');
            $table->foreign('id_postulante')->references('id_postulante')->on('postulante')->onDelete('cascade');
            $table->date('fecha_postulacion')->nullable();
            $table->date('fecha_revision')->nullable();
            $table->char('estado_postulacion',1)->nullable();
            $table->string('comentario',100)->nullable();
            $table->unsignedInteger('sueldo_deseado')->nullable();
            $table->integer('total_evaluacion')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('postulacion');
    }
}
