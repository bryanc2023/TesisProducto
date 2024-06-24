<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFormacionProsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('formacion_profesional', function (Blueprint $table) {
            $table->id('id_formacion_pro');
            $table->unsignedInteger('id_postulante')->nullable();
            $table->string('empresa', 100)->nullable();
            $table->string('puesto', 100)->nullable();
            $table->date('fecha_ini')->nullable();
            $table->date('fecha_fin')->nullable();
            $table->string('descripcion_responsabilidades', 500)->nullable();
            $table->string('persona_referencia', 250)->nullable();
            $table->string('contacto', 250)->nullable();
            $table->integer('anios_e')->nullable();
            $table->integer('mes_e')->nullable();
            $table->string('area', 250)->nullable();

            $table->foreign('id_postulante')->references('id_postulante')->on('postulante')->onDelete('cascade');
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
        Schema::dropIfExists('formacion_profesional');
    }
}
