<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEducacionRequeridasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('educacion_requerida', function (Blueprint $table) {
            $table->unsignedBigInteger('id_oferta');
            $table->unsignedBigInteger('id_titulo');
            $table->primary(['id_oferta', 'id_titulo']); 
            $table->foreign('id_oferta')->references('id_oferta')->on('oferta')->onDelete('cascade');
            $table->foreign('id_titulo')->references('id')->on('titulo')->onDelete('cascade');
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
        Schema::dropIfExists('educacion_requerida');
    }
}
