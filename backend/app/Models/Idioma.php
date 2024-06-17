<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Idioma extends Model
{
    use HasFactory;
    
    protected $table = 'idioma';
    protected $fillable = ['nombre'];

    public function idiomas()
{
    return $this->hasMany(PostulanteIdioma::class, 'id_idioma');
}
public function postulantes()
{
    return $this->belongsToMany(Postulante::class, 'postulante_idioma', 'id_idioma', 'id_postulante');
}
}
