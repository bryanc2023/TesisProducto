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
        'sueldo_deseado',
        // Puedes agregar más campos si es necesario
    ];

      // Este método indica que la clave primaria está compuesta por estos dos campos
      protected function setKeysForSaveQuery($query)
      {
          $query
              ->where('id_oferta', '=', $this->getAttribute('id_oferta'))
              ->where('id_postulante', '=', $this->getAttribute('id_postulante'));
  
          return $query;
      }
    public function postulante()
    {
        return $this->belongsTo(Postulante::class, 'id_postulante');
    }

    public function oferta()
    {
        return $this->belongsTo(Oferta::class, 'id_oferta');
    }
}
