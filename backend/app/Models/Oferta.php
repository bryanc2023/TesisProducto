<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Oferta extends Model
{
    use HasFactory;
    protected $table = 'oferta';
    protected $primaryKey = 'id_oferta';
    public $timestamps = false; // Si no hay campos created_at y updated_at en la tabla

    protected $fillable = [
        'id_empresa',
        'id_area',
        'cargo',
        'experiencia',
        'objetivo_cargo',
        'sueldo',
        'funciones',
        'fecha_publi',
        'fecha_max_pos',
        'carga_horaria',
        'modalidad',
        'detalles_adicionales',
        'correo_contacto',
        'numero_contacto',
        'estado',
        'n_mostrar_sueldo',
        'n_mostrar_empresa',
        'soli_sueldo'
    ];

    // Relación con la tabla Empresa
    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'id_empresa');
    }

 

    public function criterios()
{
    return $this->belongsToMany(Criterio::class, 'criterio_oferta', 'id_oferta', 'id_criterio')
    ->withPivot('valor', 'prioridad');
}

public function areas()
{
    return $this->belongsTo(AreaTrabajo::class, 'id_area');
}

public function expe()
    {
        return $this->belongsToMany(Titulo::class, 'educacion_requerida', 'id_oferta', 'id_titulo')
        ->withPivot('prioridad');
        
    }

    public function postulantes()
{
    return $this->belongsToMany(Postulante::class, 'postulacion', 'id_oferta', 'id_postulante');
}
public function ubicacion()
{
    return $this->empresa ? $this->empresa->ubicacion() : null;
}

public function postulaciones()
{
    return $this->hasMany(Postulacion::class, 'id_oferta');
}
}
