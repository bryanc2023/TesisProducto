<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostulanteCompetencia extends Model
{
    use HasFactory;

    protected $table = 'postulante_competencia';
    public $incrementing = false;
    public $timestamps = false;
    protected $primaryKey = ['id_postulante', 'id_competencia'];

    protected $fillable = [
        'id_postulante',
        'id_competencia',
        'nivel',
    ];

    public function postulante()
    {
        return $this->belongsTo(Postulante::class, 'id_postulante');
    }

    public function competencia()
    {
        return $this->belongsTo(Competencia::class, 'id_competencia');
    }

    protected function setKeysForSaveQuery($query)
    {
        return $query->where('id_postulante', $this->getAttribute('id_postulante'))
                     ->where('id_competencia', $this->getAttribute('id_competencia'));
    }
}
