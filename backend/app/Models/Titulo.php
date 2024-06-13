<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Titulo extends Model
{
    use HasFactory;

    protected $table = 'titulo';
    protected $fillable = ['nivel_educacion', 'campo_amplio','titulo'];

    public function personas()
{
    return $this->hasMany(PersonaFormacionPro::class, 'id_titulo');
}
public function postulantes()
{
    return $this->belongsToMany(Postulante::class, 'persona_formacion_pro', 'id_titulo', 'id_postulante');
}


}
