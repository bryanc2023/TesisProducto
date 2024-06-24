<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Postulante extends Model
{
    use HasFactory;


    protected $table = 'postulante';

    protected $primaryKey = 'id_postulante';

    public $timestamps = false;

    protected $fillable = [
        'id_ubicacion',
        'id_usuario',
        'nombres',
        'apellidos',
        'fecha_nac',
        'edad',
        'estado_civil',
        'cedula',
        'genero',
        'informacion_extra',
        'foto',
        'cv'
    ];
     /**
    * Get the rent of a Tenant
    */
   // Relación con el modelo Usuario
   public function usuario()
   {
       return $this->belongsTo(User::class, 'id_usuario');
   }

   // Relación con el modelo Ubicacion
   public function ubicacion()
   {
       return $this->belongsTo(Ubicacion::class, 'id_ubicacion');
   }

   public function formaciones()
{
    return $this->hasMany(PersonaFormacionPro::class, 'id_postulante');
}
public function titulos()
{
    return $this->belongsToMany(Titulo::class, 'formacion_academica', 'id_postulante', 'id_titulo');
}


public function idiomas()
{
    return $this->hasMany(PostulanteIdioma::class, 'id_postulante');
}
public function idiomasp()
{
    return $this->belongsToMany(Idioma::class, 'postulante_idioma', 'id_postulante', 'id_idioma');
}
public static function getIdPostulantePorIdUsuario($idUsuario)
{
    $postulante = self::where('id_usuario', $idUsuario)->first();
    return $postulante ? $postulante->id_postulante : null;
}

public function red()
{
    return $this->hasMany(PostulanteRed::class, 'id_postulante', 'id_postulante');
}

public function postulacion()
{
    return $this->belongsToMany(Postulacion::class, 'postulacion', 'id_oferta', 'id_postulante');
}
}
