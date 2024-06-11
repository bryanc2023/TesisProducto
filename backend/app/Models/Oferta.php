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
        'cargo',
        'experiencia',
        'prioridad_exp',
        'educacion_requerida',
        'objetivo_cargo',
        'sueldo',
        'funciones',
        'fecha_publi',
        'fecha_max_pos',
        'detalles_adicionales',
        'correo_contacto',
        'estado',
        'mostrar_sueldo',
        'mostrar_empresa'
    ];

    // Relación con la tabla Empresa
    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'id_empresa');
    }
}
