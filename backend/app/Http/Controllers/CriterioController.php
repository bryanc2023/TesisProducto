<?php

namespace App\Http\Controllers;

use App\Models\Criterio;
use Illuminate\Http\Request;

class CriterioController extends Controller
{
    public function getCriterios()
    {
  
      $criterios = Criterio::where('vigencia', 1)->select('id_criterio', 'criterio','descripcion')->get();

      return response()->json([
          'criterios' => $criterios
      ]);
    }

    public function index()
    {
      $criterios = Criterio::all();
      return response()->json($criterios);
    }
}
