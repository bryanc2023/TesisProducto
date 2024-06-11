<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SectorEconomico extends Model
{
    use HasFactory;
    protected $table = 'sector_economico';
    protected $fillable = ['sector', 'division'];

    public function empresas()
    {
        return $this->hasMany(Empresa::class, 'id_sector');
    }
}
