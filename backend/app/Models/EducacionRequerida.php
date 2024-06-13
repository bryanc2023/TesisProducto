<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EducacionRequerida extends Model
{
    use HasFactory;
    protected $table = 'educacion_requerida';
    protected $primaryKey = ['id_oferta', 'id_titulo'];
    public $incrementing = false;

    public $timestamps = false;
    protected $fillable = [
        'id_oferta',
        'id_titulo',
        'prioridad'
       
    ];
    

    public function ofertas()
{
    return $this->belongsTo(Oferta::class, 'id_oferta');
}

public function titulo()
{
    return $this->belongsTo(Titulo::class, 'titulo');
}
}
