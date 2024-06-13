<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EducacionRequerida extends Model
{
    use HasFactory;
    protected $table = 'educacion_requerida';

    protected $fillable = [
        'id_oferta',
        'titulo',
       
    ];
    

    public function ofertas()
{
    return $this->belongsTo(Oferta::class, 'id_oferta');
}
}
