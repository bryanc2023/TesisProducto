<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCriterioOfertasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('criterio_oferta', function (Blueprint $table) {
            $table->unsignedBigInteger('id_oferta');
            $table->unsignedBigInteger('id_criterio');
            $table->primary(['id_oferta', 'id_criterio']); // Definición de clave primaria compuesta
            $table->foreign('id_oferta')->references('id_oferta')->on('oferta')->onDelete('cascade');
            $table->foreign('id_criterio')->references('id_criterio')->on('criterio')->onDelete('cascade');
            $table->string('valor')->nullable();
            $table->unsignedInteger('prioridad')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('criterio_oferta');
    }
}
