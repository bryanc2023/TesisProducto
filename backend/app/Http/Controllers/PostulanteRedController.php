<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PostulanteRed;
use App\Models\Postulante;

class PostulanteRedController extends Controller
{
    public function redPostulante(Request $request)
    {
        $request->validate([
            'id_postulante' => 'required|exists:postulante,id_postulante',
            'nombre_red' => 'required|string|max:255',
            'enlace' => 'required|url',
        ]);

        $postulanteRed = new PostulanteRed();
        $postulanteRed->id_postulante = $request->id_postulante;
        $postulanteRed->nombre_red = $request->nombre_red;
        $postulanteRed->enlace = $request->enlace;
        $postulanteRed->save();

        return response()->json(['message' => 'Datos de la red del postulante guardados exitosamente'], 201);
    }

    public function getPostulanteReds($id_postulante)
    {
        $postulanteReds = PostulanteRed::where('id_postulante', $id_postulante)->get();
        
        if ($postulanteReds->isEmpty()) {
            return response()->json(['message' => 'No se encontraron redes sociales para este postulante'], 404);
        }

        return response()->json($postulanteReds, 200);
    }
}
