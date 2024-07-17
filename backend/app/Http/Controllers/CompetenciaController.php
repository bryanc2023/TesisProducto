<?php

namespace App\Http\Controllers;

use App\Models\Competencia;
use App\Models\Postulante;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CompetenciaController extends Controller
{
    public function getCompetenciasAll()
    {
  
      $competencias = Competencia::select('id', 'grupo','nombre')->get();

      return response()->json([
          'competencias' => $competencias
      ]);
    }


    public function getCompetencias(Request $request)
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
    $competencias = $postulante->competenciasp()->withPivot('nivel')->get();

    return response()->json(['competencias' => $competencias]);
}

    

   //Update
   public function updateCompetencias (Request $request) {
    try {
        $idPostulante = $request->input('id_postulante');
        $idCompetencia = $request->input('id_competencia');
        $nivel = $request->input('nivel');
        $nuevoIdCompetencia = $request->input('id_new_competencia') ? $request->input('id_new_competencia') : $request->input('id_competencia');

        DB::table('postulante_competencia')
        ->where('id_postulante', $idPostulante)
        ->where('id_competencia', $idCompetencia)
        ->update([
            'id_competencia' => $nuevoIdCompetencia,
            'nivel' => $nivel,
        ]);

        
        $postulanteInfo = DB::table('postulante_competencia')
        ->where('id_postulante', $idPostulante)
        ->where('id_competencia', $nuevoIdCompetencia)
        ->first();

        return response()->json(
            [
                'message' => 'Competencia actualizado',
                'postulante_competencia' => $postulanteInfo
            ]
        );

    } catch (\Throwable $th) {
        return response()->json(
            [
                'message' => 'Error al actualizar competencia',
                'error' => $th->getMessage()
            ], 500
        );
    }
   }

    //Delete

    public function deletecompetenciaPostulante(Request $request) {
        try {
            $idPostulante = $request->input('id_postulante');
            $idCompetencia = $request->input('id_competencia');

            DB::table('postulante_competencia')
            ->where('id_postulante', $idPostulante)
            ->where('id_competencia', $idCompetencia)
            ->delete();

            return response()->json(
                [
                    'message' => 'Competencia eliminado'
                ]
            );

        } catch (\Throwable $th) {
            return response()->json(
                ['message' => 'No se pudo eliminar la competencia, inténtelo de nuevo',
                'error' => $th->getMessage()], 500
            );
        }
    }
}
