<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    use HasFactory;

    protected $table = 'empresa';

    protected $primaryKey = 'id_empresa';

    protected $fillable = [
        'id_ubicacion',
        'id_usuario',
        'id_sector',
        'nombre_comercial',
        'tamanio',
        'descripcion',
        'logo',
        'cantidad_empleados'
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }

    public function ubicacion()
    {
        return $this->belongsTo(Ubicacion::class, 'id_ubicacion');
    }

    public function sector()
    {
        return $this->belongsTo(SectorEconomico::class, 'id_sector');
    }

    public function ofertas()
    {
        return $this->hasMany(Oferta::class);
    }

    public static function getIdEmpresaPorIdUsuario($idUsuario)
{
    $empresa = self::where('id_usuario', $idUsuario)->first();
    return $empresa ? $empresa->id_empresa : null;
}
    
}
