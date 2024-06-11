<?php

namespace App\Http\Controllers;

use App\Helpers\StringHelper;
use App\Models\SectorEconomico;
use Illuminate\Http\Request;

class SectorController extends Controller
{
    public function getSectores()
    {
        $sectores= SectorEconomico::distinct()->pluck('sector');
        
        return response()->json([
            'sectores' => $sectores,
        ]);
    }

    public function getDivisionSector($sector)
    {
        
        $textoSinTildes = StringHelper::removeAccents($sector);
        // Obtener las divisiones con el sector normalizado
        $divisiones = SectorEconomico::whereRaw('LOWER(REPLACE(sector, " ", "")) = LOWER(REPLACE(?, " ", ""))', [$textoSinTildes])
            ->select('id', 'division')
            ->distinct()
            ->get();

        return response()->json($divisiones);
    }
}
