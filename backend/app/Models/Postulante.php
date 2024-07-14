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
        'telefono',
        'genero',
        'informacion_extra',
        'foto',
        'cv',
        'vigencia',
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }

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


    public function habilidades()
    {
        return $this->hasMany(Postulante_Habilidad::class, 'id_postulante');
    }

    public function habilidadesp()
    {
        return $this->belongsToMany(habilidad::class, 'postulante_habilidad', 'id_postulante', 'id_habilidad');
    }


    public function competencias()
    {
        return $this->hasMany(PostulanteCompetencia::class, 'id_postulante');
    }

    public function competenciasp()
    {
        return $this->belongsToMany(Competencia::class, 'postulante_competencia', 'id_postulante', 'id_competencia');
    }


    public function red()
    {
        return $this->hasMany(PostulanteRed::class, 'id_postulante', 'id_postulante');
    }

    public function postulacion()
    {
        return $this->belongsToMany(Postulacion::class, 'postulacion', 'id_oferta', 'id_postulante');
    }

    public function formapro()
    {
        return $this->hasMany(FormacionPro::class, 'id_postulante');
    }

    public function certificado()
    {
        return $this->hasMany(Certificado::class, 'id_postulante', 'id_postulante');
    }
     /**
     * Check if the postulante has a CV.
     *
     * @return bool
     */
    public function hasCv()
    {
        return !is_null($this->cv) && $this->cv !== '';
    }
}
