<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmpresaRed extends Model
{
    use HasFactory;

    protected $table = 'empresa_red';
    protected $primaryKey = 'id_empresa_red';

    protected $fillable = [
        'id_empresa',
        'nombre_red',
        'enlace'
    ];

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'id_empresa');
    }
}
