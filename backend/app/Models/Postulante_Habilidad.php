<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Postulante_Habilidad extends Model
{
    use HasFactory;

    protected $table = 'postulante_habilidad';
    public $incrementing = false;
    public $timestamps = false;
    protected $primaryKey = ['id_postulante', 'id_habilidad'];

    protected $fillable = [
        'id_postulante',
        'id_habilidad',
        'nivel',
    ];

    public function postulante()
    {
        return $this->belongsTo(Postulante::class, 'id_postulante');
    }

    public function habilidad()
    {
        return $this->belongsTo(habilidad::class, 'id_habilidad');
    }

    protected function setKeysForSaveQuery($query)
    {
        return $query->where('id_postulante', $this->getAttribute('id_postulante'))
                     ->where('id_habilidad', $this->getAttribute('id_habilidad'));
    }
}
