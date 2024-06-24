<?php

namespace App\Http\Controllers;

use App\Models\PersonaFormacionPro;
use App\Models\Empresa;
use App\Models\Oferta;
use App\Models\Postulacion;
use App\Models\Postulante;
use App\Models\Titulo;
use App\Models\Ubicacion;
use Illuminate\Http\Request;


class PostulacionController extends Controller
{
    public function registroPostulacion(Request $request)
    {
        try {
            $request->validate([
                'id_postulante' => 'required|integer',
                'id_oferta' => 'required|integer|exists:titulo,id',
                'sueldo' => 'nullable|integer',
            ]);



            $postulante = Postulante::where('id_usuario', $request->id_postulante)->first();
            if (!$postulante) {
                return response()->json(['error' => 'Postulante no encontrado'], 404);
            }

            $idp =  $postulante->id_postulante;
            $ido =  $request->id_oferta;
            $postulacion = new Postulacion();
            $postulacion->id_postulante = $idp;
            $postulacion->id_oferta = $request->id_oferta;
            $postulacion->fecha_postulacion = now();
            $postulacion->estado_postulacion = 'P';


            $postulante = Postulante::with('titulos', 'idiomas.idioma', 'formapro', 'ubicacion')->find($idp);
            $oferta = Oferta::with('expe', 'criterios', 'areas')->find($ido);


            $matchingSueldo = 0;
            $matchingTitlesCount = 0;
            $matchingFormacionesCount = 0;
            $matchingCriteriaCount = 0;
            if (count($oferta->criterios) > 0) {
                foreach ($oferta->criterios as $criterio) {
                    switch ($criterio->criterio) {
                        case 'Sueldo':
                            $postulacion->sueldo_deseado = $request->sueldo;
                            if ($request->sueldo <= $oferta->sueldo) {
                                if ($criterio->pivot->prioridad == 1) {
                                    $matchingSueldo =  $matchingSueldo + 3;
                                } else if ($criterio->pivot->prioridad == 2) {
                                    $matchingSueldo =  $matchingSueldo + 3;
                                } else {
                                    $matchingSueldo++;
                                }
                            }

                            break;
                        case 'Titulo':
                            if (count($oferta->expe) > 0) {
                                foreach ($postulante->titulos as $titulo) {
                                    foreach ($oferta->expe as $expe) {
                                        if ($titulo->id == $expe->id) {
                                            if ($criterio->pivot->prioridad == 1) {
                                                $matchingTitlesCount =  $matchingTitlesCount + 3;
                                            } else if ($criterio->pivot->prioridad == 2) {
                                                $matchingTitlesCount =  $matchingTitlesCount + 3;
                                            } else {
                                                $matchingTitlesCount++;
                                            }
                                        }
                                    }
                                }
                            }
                            break;
                        case 'Experiencia':
                            // Iterar sobre las formaciones profesionales del postulante
                            if (count($postulante->formapro) > 0) {
                                foreach ($postulante->formapro as $formacion) {
                                    // Extraer el ID del área del campo 'area'
                                    $areaId = intval(explode(',', $formacion->area)[0]);

                                    // Verificar cada formación profesional contra los criterios de la oferta
                                    if ($areaId == $oferta->areas->id && $formacion->anios_e >= $oferta->experiencia) {
                                        if ($criterio->pivot->prioridad == 1) {
                                            $matchingFormacionesCount =  $matchingFormacionesCount + 3;
                                        } else if ($criterio->pivot->prioridad == 2) {
                                            $matchingFormacionesCount =  $matchingFormacionesCount + 3;
                                        } else {
                                            $matchingFormacionesCount++;
                                        }
                                    }
                                }
                            }
                            break;
                        case 'Estado Civil':
                            if ($postulante->estado_civil == $criterio->pivot->valor) {
                                if ($criterio->pivot->prioridad == 1) {
                                    $matchingCriteriaCount =  $matchingCriteriaCount + 3;
                                } else if ($criterio->pivot->prioridad == 2) {
                                    $matchingCriteriaCount =  $matchingCriteriaCount + 3;
                                } else {
                                    $matchingCriteriaCount++;
                                }
                            }
                            break;
                        case 'Género':
                            if ($postulante->genero == $criterio->pivot->valor) {
                                if ($criterio->pivot->prioridad == 1) {
                                    $matchingCriteriaCount =  $matchingCriteriaCount + 3;
                                } else if ($criterio->pivot->prioridad == 2) {
                                    $matchingCriteriaCount =  $matchingCriteriaCount + 3;
                                } else {
                                    $matchingCriteriaCount++;
                                }
                            }
                            break;
                        case 'Idioma':
                            if (count($postulante->idiomas) > 0) {
                                foreach ($postulante->idiomas as $idioma) {
                                    list($criterioId, $criterioValor) = explode(',', $criterio->pivot->valor);
                                    if ($idioma->idioma->id == $criterioId) {
                                        if ($criterio->pivot->prioridad == 1) {
                                            $matchingCriteriaCount =  $matchingCriteriaCount + 3;
                                        } else if ($criterio->pivot->prioridad == 2) {
                                            $matchingCriteriaCount =  $matchingCriteriaCount + 3;
                                        } else {
                                            $matchingCriteriaCount++;
                                        }
                                    }
                                }
                            }

                            break;
                        case 'Edad':
                            list($criterioId, $criterioValor) = explode(',', $criterio->pivot->valor);
                            if ($postulante->edad >= 18 && $postulante->edad <= 25) {
                                $edad = "Joven";
                            } else if ($postulante->edad >= 26 && $postulante->edad <= 35) {
                                $edad = "Adulto";
                            } else if ($postulante->edad >= 36) {
                                $edad = "Mayor";
                            }
                            if ($edad == $criterioId) {
                                if ($criterio->pivot->prioridad == 1) {
                                    $matchingCriteriaCount =  $matchingCriteriaCount + 3;
                                } else if ($criterio->pivot->prioridad == 2) {
                                    $matchingCriteriaCount =  $matchingCriteriaCount + 3;
                                } else {
                                    $matchingCriteriaCount++;
                                }
                            }
                            break;
                        case 'Ubicación':
                            list($ubiId, $ubiValor) = explode(',', $criterio->pivot->valor);
                            if ($postulante->ubicacion->id == $ubiId) {
                                if ($criterio->pivot->prioridad == 1) {
                                    $matchingCriteriaCount =  $matchingCriteriaCount + 3;
                                } else if ($criterio->pivot->prioridad == 2) {
                                    $matchingCriteriaCount =  $matchingCriteriaCount + 3;
                                } else {
                                    $matchingCriteriaCount++;
                                }
                            }
                            break;
                    }
                }
            } else {
                if ($request->sueldo) {
                    $postulacion->sueldo_deseado = $request->sueldo;
                    if ($request->sueldo <= $oferta->sueldo) {
                        $matchingSueldo++;
                    }
                }

                if (count($oferta->expe) > 0) {
                    foreach ($postulante->titulos as $titulo) {
                        foreach ($oferta->expe as $expe) {
                            if ($titulo->id == $expe->id) {
                                $matchingTitlesCount++;
                            }
                        }
                    }
                }

                // Iterar sobre las formaciones profesionales del postulante
                if (count($postulante->formapro) > 0) {
                    foreach ($postulante->formapro as $formacion) {
                        // Extraer el ID del área del campo 'area'
                        $areaId = intval(explode(',', $formacion->area)[0]);

                        // Verificar cada formación profesional contra los criterios de la oferta
                        if ($areaId == $oferta->areas->id && $formacion->anios_e >= $oferta->experiencia) {
                            $matchingFormacionesCount++;
                        }
                    }
                }
            }



            $postulacion->total_evaluacion = $matchingTitlesCount + $matchingCriteriaCount + $matchingFormacionesCount + $matchingSueldo;

            $postulacion->save();

            // Devolver la respuesta exitosa
            return response()->json([
                'message' => 'Postulacion registrada exitosamente',
                'postulante_formacion' => $postulacion,
                'postulante' => $postulante,
                'oferta' => $oferta
            ], 201);
        } catch (\Exception $e) {
            // Manejar cualquier excepción capturada
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    public function verPostulante(Request $request)
    {


        $idp =  $request->id_postulante;

        $postulante = Postulante::with('titulos')->find($idp);




        return response()->json(['message' => 'Postulante:', 'Postulante' => $postulante], 201);
    }


    public function getPostulacionPostulante($id)
    {
        try {
            // Buscar el postulante por ID de usuario
            $postulante = Postulante::where('id_usuario', $id)->first();
            if (!$postulante) {
                return response()->json(['error' => 'Postulante no encontrado'], 404);
            }

            // Obtener las postulaciones del postulante con las relaciones 'oferta' y 'empresa' cargadas
            $postulaciones = Postulacion::where('id_postulante', $postulante->id_postulante)
                ->with(['oferta', 'oferta.empresa'])
                ->get();
            $ubicaciones = [];

            $data = [];

            // Recorrer cada postulación para obtener la ubicación asociada
            foreach ($postulaciones as $postulacion) {
                $idUbicacion = $postulacion->oferta->empresa->id_ubicacion;

                // Obtener la ubicación usando el where
                $ubicacion = Ubicacion::find($idUbicacion);

                // Verificar si la ubicación existe y no está repetida en la respuesta
                if ($ubicacion) {
                    // Agrupar la postulación con su ubicación correspondiente
                    $postulacionConUbicacion = [
                        'postulacion' => $postulacion,
                        'ubicacion' => $ubicacion,
                    ];

                    // Agregar esta información al arreglo de datos
                    $data[] = $postulacionConUbicacion;
                }
            }

            // Retornar la respuesta JSON con las postulaciones y ubicaciones alineadas
            return response()->json(['postulaciones' => $data]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Error al obtener las postulaciones del postulante',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function getPostulacionEmpresa($id)
    {
        try {
            // Buscar la empresa por ID de usuario
            $empresa = Empresa::where('id_usuario', $id)->first();
            if (!$empresa) {
                return response()->json(['error' => 'Empresa no encontrada'], 404);
            }
            // Obtener las postulaciones de la empresa con las relaciones 'oferta' y 'postulantes' cargadas
            $postulaciones = Postulacion::whereHas('oferta', function ($query) use ($empresa) {
                $query->where('id_empresa', $empresa->id_empresa);
            })
                ->with(['oferta', 'postulante'])
                ->get();

            // Agrupar las postulaciones por oferta y ordenar postulantes por total_evaluacion descendente
            $groupedPostulaciones = $postulaciones->groupBy('id_oferta')->map(function ($item) {
                return [
                    'id_oferta' => $item->first()->oferta->id_oferta,
                    'id_empresa' => $item->first()->oferta->id_empresa,
                    'cargo' => $item->first()->oferta->cargo,
                    'postulantes' => $item->map(function ($postulacion) {
                        return [
                            'id_postulante' => $postulacion->postulante->id_postulante,
                            'nombres' => $postulacion->postulante->nombres,
                            'apellidos' => $postulacion->postulante->apellidos,
                            'fecha_nac' => $postulacion->postulante->fecha_nac,
                            'edad' => $postulacion->postulante->edad,
                            'estado_civil' => $postulacion->postulante->estado_civil,
                            'cedula' => $postulacion->postulante->cedula,
                            'genero' => $postulacion->postulante->genero,
                            'informacion_extra' => $postulacion->postulante->informacion_extra,
                            'foto' => $postulacion->postulante->foto,
                            'cv' => $postulacion->postulante->cv,
                            'total_evaluacion' => $postulacion->total_evaluacion,
                        ];
                    })->sortByDesc('total_evaluacion')->values()->all(),
                ];
            });

            // Retornar la respuesta JSON con las postulaciones agrupadas y ordenadas
            return response()->json(['postulaciones' => $groupedPostulaciones]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Error al obtener las postulaciones de la empresa',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function getPostulacionEsta($id)
    {
        try {
            $empresa = Empresa::where('id_usuario', $id)->first();
            if (!$empresa) {
                return response()->json(['error' => 'Empresa no encontrada'], 404);
            }

            // Obtener todas las ofertas de la empresa
            $ofertas = Oferta::where('id_empresa', $empresa->id_empresa)->get();

            // Inicializar arrays para contar postulantes por estado
            $estadoCounts = [
                'P' => 0,
                'A' => 0,
                'R' => 0,
            ];

            // Preparar estructura para almacenar resultados
            $result = [];

            foreach ($ofertas as $oferta) {
                // Obtener las postulaciones de la oferta con las relaciones 'postulantes'
                $postulaciones = Postulacion::where('id_oferta', $oferta->id_oferta)
                    ->with('postulante')
                    ->get();

                // Reiniciar los conteos por estado para esta oferta
                $estadoCounts['P'] = 0;
                $estadoCounts['A'] = 0;
                $estadoCounts['R'] = 0;

                // Contar la cantidad de personas por estado ('P', 'A', 'R')
                foreach ($postulaciones as $postulacion) {
                    switch ($postulacion->estado_postulacion) {
                        case 'P':
                            $estadoCounts['P']++;
                            break;
                        case 'A':
                            $estadoCounts['A']++;
                            break;
                        case 'R':
                            $estadoCounts['R']++;
                            break;
                        default:
                            break;
                    }
                }

                // Agregar la oferta con el conteo de postulantes y estado al resultado
                $result[] = [
                    'id_oferta' => $oferta->id_oferta,
                    'cargo' => $oferta->cargo,
                    'num_postulantes' => $postulaciones->count(),
                    'estado_count' => [
                        'P' => $estadoCounts['P'],
                        'A' => $estadoCounts['A'],
                        'R' => $estadoCounts['R'],
                    ],
                ];
            }

            // Retornar la respuesta JSON con las ofertas y el estado de las postulaciones
            return response()->json(['postulaciones' => $result]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Error al obtener las postulaciones de la empresa',
                'error' => $th->getMessage()
            ], 500);
        }
    }
}
