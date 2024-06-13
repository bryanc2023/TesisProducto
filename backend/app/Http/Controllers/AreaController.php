<?php

namespace App\Http\Controllers;

use App\Models\AreaTrabajo;
use Illuminate\Http\Request;

class AreaController extends Controller
{
    public function getAreas()
      {
    
        $areas = AreaTrabajo::where('vigencia', 1)->select('id', 'nombre_area')->get();

        return response()->json([
            'areas' => $areas
        ]);
      }
}
