<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CriterioOferta extends Model
{
    use HasFactory;

    protected $table = 'criterio_oferta';
    protected $primaryKey = ['id_oferta', 'id_criterio'];
    public $incrementing = false;
    public $timestamps = false; // Desactivar las marcas de tiempo

    protected $fillable = [
        'id_oferta',
        'id_criterio',
        'valor',
        'prioridad'
    ];
    public function oferta()
    {
        return $this->belongsTo(Oferta::class, 'id_oferta');
    }

    // Relación con el modelo Titulo
    public function criterio()
    {
        return $this->belongsTo(Criterio::class, 'id_criterio');
    }
}

