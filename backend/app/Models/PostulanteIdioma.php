<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class PostulanteIdioma extends Model
{
    use HasFactory;

    protected $table = 'postulante_idioma';
    public $incrementing = false;
    public $timestamps = false;
    protected $primaryKey = ['id_postulante', 'id_idioma'];

    protected $fillable = [
        'id_postulante',
        'id_idioma',
        'nivel_oral',
        'nivel_escrito',
    ];

    public function postulante()
    {
        return $this->belongsTo(Postulante::class, 'id_postulante');
    }

    public function idioma()
    {
        return $this->belongsTo(Idioma::class, 'id_idioma');
    }

    protected function setKeysForSaveQuery($query)
    {
        return $query->where('id_postulante', $this->getAttribute('id_postulante'))
                     ->where('id_idioma', $this->getAttribute('id_idioma'));
    }
}
