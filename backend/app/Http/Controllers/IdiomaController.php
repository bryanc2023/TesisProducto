<?php

namespace App\Http\Controllers;

use App\Models\Idioma;
use Illuminate\Http\Request;
use App\Models\PostulanteIdioma;

class IdiomaController extends Controller
{
    public function getIdiomas()
    {
  
      $idiomas = Idioma::select('id', 'nombre')->get();

      return response()->json([
          'idiomas' => $idiomas
      ]);
    }

    public function updateIdioma(Request $request, $id_postulante, $id_idioma)
    {
        // Validar los datos entrantes
        $validatedData = $request->validate([
            'nivel_oral' => 'required|string|max:255',
            'nivel_escrito' => 'required|string|max:255',
        ]);

        // Encontrar el registro en la tabla de unión por los IDs
        $postulanteIdioma = PostulanteIdioma::where('id_postulante', $id_postulante)
                                             ->where('id_idioma', $id_idioma)
                                             ->firstOrFail();

        // Actualizar los niveles oral y escrito
        $postulanteIdioma->nivel_oral = $validatedData['nivel_oral'];
        $postulanteIdioma->nivel_escrito = $validatedData['nivel_escrito'];
        $postulanteIdioma->save();

        // Retornar la respuesta
        return response()->json([
            'message' => 'Idioma del postulante actualizado con éxito',
            'postulante_idioma' => $postulanteIdioma
        ]);
    }
    

}
