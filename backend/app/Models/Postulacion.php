<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Postulacion extends Model
{
    use HasFactory;

    protected $table = 'postulacion';
    protected $primaryKey = ['id_oferta', 'id_postulante'];
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id_oferta',
        'id_postulante',
        'fecha_postulacion',
        'fecha_revision',
        'estado_postulacion',
        'total_evaluacion',
        // Puedes agregar más campos si es necesario
    ];

    public function postulante()
    {
        return $this->belongsTo(Postulante::class, 'id_postulante');
    }

    public function oferta()
    {
        return $this->belongsTo(Oferta::class, 'id_oferta');
    }


}
