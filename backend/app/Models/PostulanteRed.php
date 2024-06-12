<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostulanteRed extends Model
{
    use HasFactory;
    protected $table = 'postulante_red';

    protected $primaryKey = 'id_postulante_red';


    protected $fillable = [
        'id_postulante',
        'nombre_red',
        'enlace'
    ];

    public function postulante()
    {
        return $this->belongsTo(Postulante::class);
    }
}
