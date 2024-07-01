<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmpresasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('empresa', function (Blueprint $table) {
            $table->id('id_empresa');
            $table->unsignedBigInteger('id_ubicacion');
            $table->unsignedBigInteger('id_usuario');
            $table->unsignedBigInteger('id_sector');
            $table->string('nombre_comercial', 50);
            $table->string('tamanio', 30);
            $table->string('descripcion', 1000);
            $table->string('logo', 500);
            $table->integer('cantidad_empleados');
           

            // Agregar claves foráneas
            $table->foreign('id_ubicacion')->references('id')->on('ubicacion')->onDelete('cascade');
            $table->foreign('id_usuario')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('id_sector')->references('id')->on('sector_economico')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('empresa');
    }
}
