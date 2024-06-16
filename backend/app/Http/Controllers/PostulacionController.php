<?php

namespace App\Http\Controllers;

use App\Models\Postulacion;
use App\Models\Postulante;
use Illuminate\Http\Request;

class PostulacionController extends Controller
{
    public function registroPostulacion(Request $request)
    {
        $request->validate([
            'id_postulante' => 'required|integer',
            'id_oferta' => 'required|integer|exists:titulo,id'
        ]);

       
        
        $postulante = Postulante::where('id_usuario', $request->id_postulante)->first();
    if (!$postulante) {
        return response()->json(['error' => 'Postulante no encontrado'], 404);
    }

        $idp=  $postulante->id_postulante;
        $postulacion = new Postulacion();
        $postulacion->id_postulante = $idp;
        $postulacion->id_oferta = $request->id_oferta;
       

        $postulacion->save();

    

        return response()->json(['message' => 'Postulacion registrada exitosamente', 'postulante_formacion' => $postulacion], 201);
    }
}
