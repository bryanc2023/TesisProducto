<?php

namespace App\Http\Controllers;

use App\Models\Ubicacion;
use Illuminate\Http\Request;

class UbicacionController extends Controller
{
   

  

    // Método para obtener provincias y cantones
    public function getProvinciasCantones()
    {
        $provinces = Ubicacion::distinct()->pluck('provincia');
        $cantons = Ubicacion::distinct()->pluck('canton');
        
        return response()->json([
            'provinces' => $provinces,
            'cantons' => $cantons,
        ]);
    }

    // Método para obtener cantones por provincia
    public function getCantonesPorProvincia($province)
    {
        $cantons = Ubicacion::where('provincia', $province)->distinct()->pluck('canton');
        
        return response()->json($cantons);
    }
    public function getCantonesPorProvinciaID($province)
    {
        $cantons = Ubicacion::where('provincia', $province)
        ->select('id', 'canton')
        ->distinct()
        ->get();
        
        return response()->json($cantons);
    }


    public function getUbicacionId($provincia, $canton) {
        $ubicacion = Ubicacion::whereRaw("LOWER(provincia) COLLATE utf8mb4_unicode_ci = LOWER(?)", [$provincia])
                      ->whereRaw("LOWER(canton) COLLATE utf8mb4_unicode_ci = LOWER(?)", [$canton])
                      ->first();


    if ($ubicacion) {
        return response()->json(['ubicacion_id' => $ubicacion->id]);
    } else {
        return response()->json(['error' => 'Ubicación no encontrada'], 404);
    }
    }
}
