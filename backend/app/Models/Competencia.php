<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Competencia extends Model
{
    use HasFactory;

    protected $table = 'competencia';
    protected $fillable = ['grupo','nombre','descripcion',];

    public function competencias()
{
    return $this->hasMany(PostulanteCompetencia::class, 'id_competencia');
}
public function postulantes()
{
    return $this->belongsToMany(Postulante::class, 'postulante_competencia', 'id_competencia', 'id_postulante');
}
}
