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
        'ponderacion',
        'mostrar_sueldo',
        'mostrar_empresa'
    ];

    // Relación con la tabla Empresa
    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'id_empresa');
    }

 

    public function criterios()
{
    return $this->belongsToMany(Criterio::class, 'criterio_oferta', 'id_oferta', 'id_criterio');
}

public function areas()
{
    return $this->belongsTo(AreaTrabajo::class, 'id_area');
}

public function expe()
    {
        return $this->hasMany(EducacionRequerida::class, 'id_oferta');
    }
}
