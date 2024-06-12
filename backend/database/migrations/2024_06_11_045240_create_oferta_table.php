<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOfertaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('oferta', function (Blueprint $table) {
            $table->id('id_oferta');
            $table->unsignedBigInteger('id_empresa');
            $table->string('cargo', 30)->nullable();
            $table->unsignedInteger('experiencia')->nullable();
            $table->unsignedInteger('prioridad_exp')->nullable();
            $table->string('educacion_requerida', 100)->nullable();
            $table->string('objetivo_cargo', 50)->nullable();
            $table->unsignedInteger('sueldo')->nullable();
            $table->string('funciones', 200)->nullable();
            $table->date('fecha_publi')->nullable();
            $table->date('fecha_max_pos')->nullable();
            $table->string('detalles_adicionales', 50)->nullable();
            $table->string('correo_contacto', 30)->nullable();
            $table->char('estado', 1)->nullable();
            $table->boolean('mostrar_sueldo')->nullable();
            $table->boolean('mostrar_empresa')->nullable();

            $table->foreign('id_empresa')->references('id_empresa')->on('empresa')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('oferta');
    }
}
