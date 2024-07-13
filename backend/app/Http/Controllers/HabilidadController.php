<?php

namespace App\Http\Controllers;

use App\Models\habilidad;
use App\Models\Postulante;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HabilidadController extends Controller
{
    public function getHabilidadesAll()
    {
  
      $habilidades = habilidad::select('id', 'habilidad')->get();

      return response()->json([
          'habilidades' => $habilidades
      ]);
    }


    public function getHabilidades(Request $request)
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
    $habilidades = $postulante->habilidadesp()->withPivot('nivel')->get();

    return response()->json(['habilidades' => $habilidades]);
}

    

   //Update 
   public function updatehabilidades (Request $request) {
    try {
        $idPostulante = $request->input('id_postulante');
        $idHabilidad = $request->input('id_habilidad');
        $nivel = $request->input('nivel');
        $nuevoIdHabilidad = $request->input('id_new_habilidad') ? $request->input('id_new_habilidad') : $request->input('id_habilidad');

        DB::table('postulante_habilidad')
        ->where('id_postulante', $idPostulante)
        ->where('id_habilidad', $idHabilidad)
        ->update([
            'id_habilidad' => $nuevoIdHabilidad,
            'nivel' => $nivel,
        ]);

        
        $postulanteInfo = DB::table('postulante_habilidad')
        ->where('id_postulante', $idPostulante)
        ->where('id_habilidad', $nuevoIdHabilidad)
        ->first();

        return response()->json(
            [
                'message' => 'Habilidad actualizado',
                'postulante_habilidad' => $postulanteInfo
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

    public function deletehabilidadPostulante(Request $request) {
        try {
            $idPostulante = $request->input('id_postulante');
            $idHabilidad = $request->input('id_habilidad');

            DB::table('postulante_habilidad')
            ->where('id_postulante', $idPostulante)
            ->where('id_habilidad', $idHabilidad)
            ->delete();

            return response()->json(
                [
                    'message' => 'Habilidad eliminado'
                ]
            );

        } catch (\Throwable $th) {
            return response()->json(
                ['message' => 'No se pudo eliminar la habilidad, inténtelo de nuevo',
                'error' => $th->getMessage()], 500
            );
        }
    }
}
