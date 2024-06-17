<?php

namespace App\Http\Controllers;

use App\Models\Oferta;
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
        $ido=  $request->id_oferta;
        $postulacion = new Postulacion();
        $postulacion->id_postulante = $idp;
        $postulacion->id_oferta = $request->id_oferta;
        $postulacion->fecha_postulacion= now();
        $postulacion->estado_postulacion='P'; 

        $postulante = Postulante::with('titulos','idiomas.idioma')->find($idp);
        $oferta = Oferta::with('expe','criterios')->find($ido);
        

        $matchingTitlesCount = 0;
        $matchingCriteriaCount = 0;
        foreach ($postulante->titulos as $titulo) {
            foreach ($oferta->expe as $expe) {
                if ($titulo->id == $expe->id) {
                    $matchingTitlesCount++;
                }
            }
        }

        // Recorrer los criterios de la oferta y compararlos con los atributos del postulante
      
foreach ($oferta->criterios as $criterio) {
    switch ($criterio->criterio) {
        case 'Estado Civil':
            if ($postulante->estado_civil == $criterio->pivot->valor) {
                $matchingCriteriaCount++;
            }
            break;
        case 'Género':
                if ($postulante->genero == $criterio->pivot->valor) {
                    $matchingCriteriaCount++;
                }
                break;
        case 'Idioma':
            foreach ($postulante->idiomas as $idioma) {
                    if ($idioma->idioma->id == $criterio->pivot->valor) {
                        $matchingCriteriaCount++;
                    }
                }
              
                break;
        case 'Edad':
            if($postulante->edad >=18 && $postulante->edad<=25){
                $edad= "Joven";
            }else if($postulante->edad >=26 && $postulante->edad<=35){
                $edad= "Adulto";
            }else if($postulante->edad >=36){
                $edad= "Mayor";
            }
            if ($edad == $criterio->pivot->valor) {
                $matchingCriteriaCount++;
            }
            break;
                      
              
        // Aquí puedes agregar más casos para otros criterios
    }
}

        $postulacion->total_evaluacion=$matchingTitlesCount+$matchingCriteriaCount;
    
        $postulacion->save();

        return response()->json(['message' => 'Postulacion registrada exitosamente', 'postulante_formacion' => $postulacion], 201);
    }

    public function verPostulante(Request $request)
    {
    

        $idp=  $request->id_postulante;
     
        $postulante = Postulante::with('titulos')->find($idp);


    

        return response()->json(['message' => 'Postulante:', 'Postulante' => $postulante], 201);
    }
}
