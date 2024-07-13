<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class habilidad extends Model
{
    use HasFactory;

    protected $table = 'habilidad';
    protected $fillable = ['habilidad'];

    public function habilidades()
{
    return $this->hasMany(Postulante_Habilidad::class, 'id_habilidad');
}
public function postulantes()
{
    return $this->belongsToMany(Postulante::class, 'postulante_habilidad', 'id_habilidad', 'id_postulante');
}
}
