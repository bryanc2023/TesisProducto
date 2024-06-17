<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostulanteIdioma extends Model
{
    use HasFactory;
    protected $table = 'postulante_idioma';
    protected $primaryKey = ['id_postulante', 'id_idioma'];
    public $incrementing = false;
    public $timestamps = false; // Desactivar las marcas de tiempo

    protected $fillable = [
        'id_postulante',
        'id_idioma',
        'nivel_oral',
        'nivel_escrito',
       
        // Puedes agregar más campos si es necesario
    ];

    // Relación con el modelo Postulante
    public function postulante()
    {
        return $this->belongsTo(Postulante::class, 'id_postulante');
    }

    // Relación con el modelo Titulo
    public function idioma()
    {
        return $this->belongsTo(Idioma::class, 'id_idioma');
    }
}
