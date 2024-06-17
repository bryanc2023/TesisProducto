<?php

namespace App\Http\Controllers;

use App\Models\Idioma;
use Illuminate\Http\Request;

class IdiomaController extends Controller
{
    public function getIdiomas()
    {
  
      $idiomas = Idioma::select('id', 'nombre')->get();

      return response()->json([
          'idiomas' => $idiomas
      ]);
    }
}
