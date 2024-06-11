<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ubicacion extends Model
{
    use HasFactory;
    protected $table = 'ubicacion';
    protected $fillable = ['provincia', 'canton'];
  /**
     * Get all distinct provinces.
     *
     * @return \Illuminate\Support\Collection
     */
    public static function getDistinctProvinces()
    {
        return self::select('provincia')->distinct()->orderBy('provincia')->get();
    }

    /**
     * Get all distinct cantons.
     *
     * @return \Illuminate\Support\Collection
     */
    public static function getDistinctCantons()
    {
        return self::select('canton')->distinct()->orderBy('canton')->get();
    }
  

    /**
     * Get all distinct provinces and cantons.
     *
     * @return array
     */
    public static function getDistinctProvincesAndCantons()
    {
        $provinces = self::select('provincia')->distinct()->orderBy('provincia')->get();
        $cantons = self::select('canton')->distinct()->orderBy('canton')->get();

        return [
            'provinces' => $provinces,
            'cantons' => $cantons,
        ];
    }

    public function postulantes()
    {
        return $this->hasMany(Postulante::class, 'id_ubicacion');
    }

    public function empresas()
    {
        return $this->hasMany(Empresa::class, 'id_ubicacion');
    }
}
