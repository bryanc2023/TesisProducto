<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormacionPro extends Model
{
    use HasFactory;

    protected $table = 'formacion_profesional';
    protected $primaryKey = 'id_formacion_pro';

    protected $fillable = [
        'id_postulante',
        'empresa',
        'puesto',
        'fecha_ini',
        'fecha_fin',
        'descripcion_responsabilidades',
        'persona_referencia',
        'contacto',
        'anios_e',
        'area',
        'mes_e',
        
    ];

    public function postulante()
    {
        return $this->belongsTo(Postulante::class, 'id_postulante');
    }


}
