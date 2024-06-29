<?php

namespace App\Http\Controllers;

use App\Models\Idioma;
use Illuminate\Http\Request;
use App\Models\Postulante;
use App\Models\PostulanteIdioma;
use Illuminate\Support\Facades\DB;

class IdiomaController extends Controller
{
    public function getIdiomasAll()
    {
  
      $idiomas = Idioma::select('id', 'nombre')->get();

      return response()->json([
          'idiomas' => $idiomas
      ]);
    }


    public function getIdiomas(Request $request)
{
    // Validar la solicitud para asegurarse de que 'id_postulante' está presente y es un entero
    $request->validate([
        'id_postulante' => 'required|integer'
    ]);

    // Obtener el postulante por el id de postulante
    $postulante = Postulante::find($request->id_postulante);

    if (!$postulante) {
        return response()->json(['error' => 'Postulante no encontrado'], 404);
    }

    // Obtener los idiomas del postulante con los datos pivote
    $idiomas = $postulante->idiomasp()->withPivot('nivel_oral', 'nivel_escrito')->get();

    return response()->json(['idiomas' => $idiomas]);
}

    

   //Update 
   public function updateidiomas (Request $request) {
    try {
        $idPostulante = $request->input('id_postulante');
        $idIdioma = $request->input('id_idioma');
        $nivelOral = $request->input('nivel_oral');
        $nivelEscrito = $request->input('nivel_escrito');
        $nuevoIdIdioma = $request->input('id_new_idioma') ? $request->input('id_new_idioma') : $request->input('id_idioma');

        DB::table('postulante_idioma')
        ->where('id_postulante', $idPostulante)
        ->where('id_idioma', $idIdioma)
        ->update([
            'nivel_oral' => $nivelOral,
            'nivel_escrito' => $nivelEscrito,
            'id_idioma' => $nuevoIdIdioma,
        ]);

        
        $postulanteInfo = DB::table('postulante_idioma')
        ->where('id_postulante', $idPostulante)
        ->where('id_idioma', $nuevoIdIdioma)
        ->first();

        return response()->json(
            [
                'message' => 'Idioma actualizado',
                'postulante_idioma' => $postulanteInfo
            ]
        );

    } catch (\Throwable $th) {
        return response()->json(
            [
                'message' => 'Error al actualizar idioma',
                'error' => $th->getMessage()
            ], 500
        );
    }
   }

    //Delete

    public function deleteidiomaPostulante(Request $request) {
        try {
            $idPostulante = $request->input('id_postulante');
            $idIdioma = $request->input('id_idioma');

            DB::table('postulante_idioma')
            ->where('id_postulante', $idPostulante)
            ->where('id_idioma', $idIdioma)
            ->delete();

            return response()->json(
                [
                    'message' => 'Idioma eliminado'
                ]
            );

        } catch (\Throwable $th) {
            return response()->json(
                ['message' => 'No se pudo eliminar el idioma, inténtelo de nuevo',
                'error' => $th->getMessage()], 500
            );
        }
    }
    

}
