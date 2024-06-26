<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PersonaFormacionPro extends Model
{
    use HasFactory;
    protected $table = 'formacion_academica';
    protected $primaryKey = ['id_postulante', 'id_titulo'];
    public $incrementing = false;
    public $timestamps = false; // Desactivar las marcas de tiempo

    protected $fillable = [
        'id_postulante',
        'id_titulo',
        'institucion',
        'estado',
        'fecha_ini',
        'fecha_fin',
        'titulo_acreditado',
        // Puedes agregar más campos si es necesario
    ];

    // Relación con el modelo Postulante
    public function postulante()
    {
        return $this->belongsTo(Postulante::class, 'id_postulante');
    }

    // Relación con el modelo Titulo
    public function titulo()
    {
        return $this->belongsTo(Titulo::class, 'id_titulo');
    }
}
