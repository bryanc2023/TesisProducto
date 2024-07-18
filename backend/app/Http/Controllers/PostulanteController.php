<?php

namespace App\Http\Controllers;

use App\Http\Requests\Postulante\PostulanteRequest;
use App\Models\FormacionPro;
use App\Models\PersonaFormacionPro;
use App\Models\Postulante;
use App\Models\Postulante_Habilidad;
use App\Models\PostulanteCompetencia;
use App\Models\PostulanteIdioma;
use App\Models\PostulanteRed;
use App\Models\User;
use App\Models\Titulo;
use App\Models\Ubicacion;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Queue\NullQueue;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use PhpParser\Node\Stmt\TryCatch;

class PostulanteController extends Controller
{
    public function registerPos(PostulanteRequest $request)
    {
        // Verificar si ya existe un registro de postulante para este usuario
        $existingPostulante = Postulante::where('id_usuario', $request->usuario_id)->first();
        if ($existingPostulante) {
            return response()->json(['message' => 'El usuario ya tiene un registro de postulante'], 409);
        }

        $postulante = new Postulante();
        $postulante->id_ubicacion = $request->ubicacion_id;
        $postulante->id_usuario = $request->usuario_id;
        $postulante->nombres = $request->firstName;
        $postulante->apellidos = $request->lastName;
        $postulante->fecha_nac = $request->birthDate;

        // Calcular la edad a partir de la fecha de nacimiento
        $birthDate = new DateTime($request->birthDate);
        $currentDate = new DateTime();
        $age = $currentDate->diff($birthDate)->y;
        $postulante->edad = $age;

        $postulante->estado_civil = $request->maritalStatus;
        $postulante->cedula = $request->idNumber;
        $postulante->genero = $request->gender;
        $postulante->informacion_extra = $request->description;
        $postulante->foto = $request->foto; // URL de Firebase para la foto
        $postulante->cv = $request->cv; // URL de Firebase para el CV
        $postulante->telefono = $request->telefono; 

        // Guardar el postulante
        $postulante->save();

 

        return response()->json(['message' => 'Postulante creado exitosamente', 'postulante' => $postulante], 201);
    }

    public function getCV($id_usuario)
{
    // Verificar si existe un registro de postulante para este usuario
    $postulante = Postulante::where('id_usuario', $id_usuario)->first();
    if (!$postulante) {
        return response()->json(['message' => 'No se encontró el registro del postulante'], 404);
    }

    // Devolver la URL del CV
    return response()->json(['cv_url' => $postulante->cv], 200);
}

    public function obtenerIdPostulante(Request $request)
    {
        $idUsuario = $request->input('id_usuario');
        $idPostulante = Postulante::where('id_usuario', $idUsuario)->first();

        if ($idPostulante) {
            return response()->json(['id_postulante' => $idPostulante->id_postulante]);
        } else {
            return response()->json(['error' => 'No se encontró el ID del postulante'], 404);
        }
    }

    

    public function getPerfil($id)
{
    try {
        $postulante = Postulante::with(['ubicacion', 'formaciones.titulo', 'idiomas.idioma','habilidades.habilidad','competencias.competencia'])->where('id_usuario', $id)->first();
        if (!$postulante) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $response = [
            'postulante' => $postulante,
            'ubicacion' => $postulante->ubicacion,
            'formaciones' => $postulante->formaciones->map(function ($formacion) {
                return [
                    'institucion' => $formacion->institucion,
                    'estado' => $formacion->estado,
                    'fechaini' => $formacion->fecha_ini,
                    'fechafin' => $formacion->fecha_fin,
                    'titulo' => $formacion->titulo,
                    'titulo_acreditado' => $formacion->titulo_acreditado,
                ];
            }),
            'idiomas' => $postulante->idiomas->map(function ($idioma) {
                return [
                    'idioma' => $idioma->nombre,
                    'nivel_oral' => $idioma->nivel_oral,
                    'nivel_escrito' => $idioma->nivel_escrito,
                ];
            }),
            'habilidades' => $postulante->habilidades->map(function ($habilidad) {
                return [
                    'habilidad' => $habilidad->habilidad,
                    'nivel' => $habilidad->nivel,
                ];
            }),
            'competencias' => $postulante->competencias->map(function ($competencia) {
                return [
                    'grupo' => $competencia->grupo,
                    'nombre' => $competencia->nombre,
                    'nivel' => $competencia->nivel,
                ];
            }),
        ];

        return response()->json($response);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Error retrieving user profile'], 500);
    }
}

public function getCurriculum($id)
{
    try {
        $postulante = Postulante::with(['ubicacion', 'formaciones.titulo', 'idiomas.idioma','red','certificado','formapro','habilidades.habilidad','competencias.competencia'])->where('id_usuario', $id)->first();
        if (!$postulante) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $response = [
            'postulante' => $postulante
        ];

        return response()->json($response);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Error retrieving user profile'], 500);
    }
}

    public function registroFormaAca(Request $request)
    {
        $request->validate([
            'id_postulante' => 'required|integer|exists:postulante,id_postulante',
            'id_titulo' => 'required|integer|exists:titulo,id',
            'institucion' => 'required|string|max:220',
            'estado' => 'required|string|max:30',
            'fechaini' => 'nullable|date',
            'fechafin' => 'nullable|date',
            'id_idioma' => 'required|integer|exists:idioma,id',
            'niveloral' => 'required|string|max:20',
            'nivelescrito' => 'required|string|max:20',
            'titulo_acreditado' => 'required|string|max:220',
            'empresa' => 'nullable|string|max:100',
            'puesto' => 'nullable|string|max:100',
            'fechae1' => 'nullable|date',
            'fechae2' => 'nullable|date',
            'descripcion' => 'nullable|string|max:500',
            'referencia' => 'nullable|string|max:250',
            'area'=> 'nullable|string|max:250',
            'contacto'=> 'nullable|string|max:250',
            'red'=>'nullable|string|max:250',
            'enlace'=>'nullable|url'
        ]);

        $postulantefor = new PersonaFormacionPro();
        $postulantefor->id_postulante = $request->id_postulante;
        $postulantefor->id_titulo = $request->id_titulo;
        $postulantefor->institucion = $request->institucion;
        $postulantefor->estado = $request->estado;
        $postulantefor->fecha_ini = $request->fechaini;
        $postulantefor->fecha_fin = $request->fechafin;
        $postulantefor->titulo_acreditado = $request->titulo_acreditado;
        $postulantefor->save();

        $postulanteidi = new PostulanteIdioma();
        $postulanteidi->id_postulante = $request->id_postulante;
        $postulanteidi->id_idioma = $request->id_idioma;
        $postulanteidi->nivel_oral = $request->niveloral;
        $postulanteidi->nivel_escrito = $request->nivelescrito;
        $postulanteidi->save();

        $postulante = Postulante::find($request->id_postulante);
        $postulante->cv = null;

           // Actualizar el campo first_login_at del usuario
           $user = $postulante->usuario;
           if ($user && is_null($user->first_login_at)) {
               $user->first_login_at = now();
               $user->save();
           }

        if ($request->empresa && $request->puesto && $request->descripcion && $request->referencia && $request->area && $request->contacto) {
            $postulantexp = new FormacionPro();
            $postulantexp->id_postulante = $request->id_postulante;
            $postulantexp->empresa = $request->empresa;
            $postulantexp->puesto = $request->puesto;
            $postulantexp->fecha_ini = $request->fechae1;
            $postulantexp->fecha_fin = $request->fechae2;
            $postulantexp->descripcion_responsabilidades = $request->descripcion;
            $postulantexp->persona_referencia = $request->referencia;
            $postulantexp->area = $request->area;
            $postulantexp->contacto = $request->contacto;
    
            if ($request->fechae1 && $request->fechae2) {
                $fecha1 = new DateTime($request->fechae1);
                $fecha2 = new DateTime($request->fechae2);
                $diferencia = $fecha1->diff($fecha2);
                $postulantexp->mes_e = $diferencia->m;
                $postulantexp->anios_e = $diferencia->y;
            } else {
                $postulantexp->mes_e = 0;
                $postulantexp->anios_e = 0;
            }
    
            $postulantexp->save();
        }

        if ($request->red && $request->enlace){

      

        $postulanteRed = new PostulanteRed();
        $postulanteRed->id_postulante = $request->id_postulante;
        $postulanteRed->nombre_red = $request->red;
        $postulanteRed->enlace = $request->enlace;
            
        $postulanteRed->save();
    }


        return response()->json(['message' => 'Formación académica registrada exitosamente', 'postulante_formacion' => $postulante], 201);
    }

    public function prueba(Request $request)
    {
        $postulante = Postulante::where('id_usuario', $request->id_postulante)->first();
        if (!$postulante) {
            return response()->json(['error' => 'Postulante no encontrado'], 404);
        }
        $idp = $postulante->id_postulante;
        return response()->json(['id_postulante' => $idp], 200);
    }

    public function registroIdioma(Request $request)
{
    $request->validate([
        'userId' => 'required|integer',
        'idiomaId' => 'required|integer|exists:idioma,id',
        'nivelOral' => 'required|string|max:220',
        'nivelEscrito' => 'required|string|max:30'
    ]);

    $postulante = Postulante::where('id_usuario', $request->userId)->first();
    if (!$postulante) {
        return response()->json(['error' => 'Postulante no encontrado'], 404);
    }

    $idp = $postulante->id_postulante;

    try {
        $postulanteidi = new PostulanteIdioma();
        $postulanteidi->id_postulante = $idp;
        $postulanteidi->id_idioma = $request->idiomaId;
        $postulanteidi->nivel_oral = $request->nivelOral;
        $postulanteidi->nivel_escrito = $request->nivelEscrito;
        $postulanteidi->save();

        return response()->json(['message' => 'Idioma registrado exitosamente', 'postulante_formacion' => $postulanteidi], 201);
    } catch (\Illuminate\Database\QueryException $ex) {
        if($ex->errorInfo[1] == 1062) {
            return response()->json(['error' => 'Este idioma ya ha sido registrado para este postulante'], 409);
        }
        return response()->json(['error' => 'Error al registrar el idioma'], 500);
    }
}



public function registroHabilidad(Request $request)
{
    $request->validate([
        'userId' => 'required|integer',
        'habilidadId' => 'required|integer|exists:habilidad,id',
        'nivel' => 'required|string|max:220',
    ]);

    $postulante = Postulante::where('id_usuario', $request->userId)->first();
    if (!$postulante) {
        return response()->json(['error' => 'Postulante no encontrado'], 404);
    }

    $idp = $postulante->id_postulante;

    // Verificar si la habilidad ya está registrada para el postulante
    $existingHabilidad = Postulante_Habilidad::where('id_postulante', $idp)
        ->where('id_habilidad', $request->habilidadId)
        ->first();

    if ($existingHabilidad) {
        return response()->json(['error' => 'La habilidad ya está registrada para este postulante'], 409);
    }

    $postulanteHabilidad = new Postulante_Habilidad();
    $postulanteHabilidad->id_postulante = $idp;
    $postulanteHabilidad->id_habilidad = $request->habilidadId;
    $postulanteHabilidad->nivel = $request->nivel;
    $postulanteHabilidad->save();

    return response()->json(['message' => 'Habilidad agregada correctamente', 'postulante_habilidad' => $postulanteHabilidad], 201);
}


    public function registroCompetencia(Request $request)
{
    $request->validate([
        'userId' => 'required|integer',
        'competenciaId' => 'required|integer|exists:competencia,id',
        'nivel' => 'required|string|max:220',
    ]);

    $postulante = Postulante::where('id_usuario', $request->userId)->first();
    if (!$postulante) {
        return response()->json(['error' => 'Postulante no encontrado'], 404);
    }

    $idp = $postulante->id_postulante;

    // Verificar si la competencia ya está registrada para el postulante
    $existeCompetencia = PostulanteCompetencia::where('id_postulante', $idp)
                                               ->where('id_competencia', $request->competenciaId)
                                               ->exists();

    if ($existeCompetencia) {
        return response()->json(['error' => 'La competencia ya está registrada para este postulante'], 409);
    }

    $postulanteCompetencia = new PostulanteCompetencia();
    $postulanteCompetencia->id_postulante = $idp;
    $postulanteCompetencia->id_competencia = $request->competenciaId;
    $postulanteCompetencia->nivel = $request->nivel;
    $postulanteCompetencia->save();

    return response()->json(['message' => 'Competencia agregada correctamente', 'postulante_competencia' => $postulanteCompetencia], 201);
}


    public function updatePostulanteByIdUser(Request $request, $idUser)
    {
        try {
            // Buscar el postulante por ID de usuario
            $postulante = Postulante::where('id_usuario', $idUser)->first();

            if (!$postulante) {
                return response()->json(['message' => 'Postulante no encontrado'], 404);
            }

            // Actualizar los campos del postulante
            $postulante->nombres = $request->input('nombres', $postulante->nombres);
            $postulante->apellidos = $request->input('apellidos', $postulante->apellidos);
            $postulante->fecha_nac = $request->input('fecha_nac', $postulante->fecha_nac);

            // Calcular y actualizar la edad a partir de la fecha de nacimiento
            if ($request->has('fecha_nac')) {
                $birthDate = new DateTime($request->input('fecha_nac'));
                $currentDate = new DateTime();
                $age = $currentDate->diff($birthDate)->y;
                $postulante->edad = $age;
            }

            $postulante->estado_civil = $request->input('estado_civil', $postulante->estado_civil);
            $postulante->cedula = $request->input('cedula', $postulante->cedula);
            $postulante->genero = $request->input('genero', $postulante->genero);
            $postulante->informacion_extra = $request->input('informacion_extra', $postulante->informacion_extra);

            // Si se sube una nueva foto, actualizarla
            if ($request->has('foto')) {
                $postulante->foto = $request->foto; // URL de Firebase para la foto
            }

            $postulante->cv = $request->input('cv', $postulante->cv);

            // Actualizar la ubicación si está presente en el request
            if ($request->has('provincia') && $request->has('canton')) {
                $ubicacion = $postulante->ubicacion;
                if ($ubicacion) {
                    $ubicacion->provincia = $request->input('provincia', $ubicacion->provincia);
                    $ubicacion->canton = $request->input('canton', $ubicacion->canton);
                    $ubicacion->save();
                } else {
                    // Crear una nueva ubicación si no existe
                    $ubicacion = Ubicacion::create([
                        'provincia' => $request->input('provincia'),
                        'canton' => $request->input('canton')
                    ]);
                    $postulante->id_ubicacion = $ubicacion->id;
                }
            }

            $postulante->save();

            return response()->json([
                'message' => 'Postulante actualizado correctamente',
                'postulante' => $postulante->load('ubicacion')
            ]);

        } catch (\Throwable $th) {
            Log::error('Error al actualizar el postulante: ' . $th->getMessage());
            return response()->json([
                'message' => 'Error al actualizar el postulante',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function registroFormaAcaPlus(Request $request)
{
    $request->validate([
        'id_postulante' => 'required|integer|exists:postulante,id_postulante',
        'id_titulo' => 'required|integer|exists:titulo,id',
        'institucion' => 'required|string|max:220',
        'estado' => 'required|string|max:30',
        'fechaini' => 'nullable|date',
        'fechafin' => 'nullable|date',
        'titulo_acreditado' => 'required|string|max:220'
    ]);

    // Buscar el postulante directamente por id_postulante
    $postulante = Postulante::find($request->id_postulante);
    if (!$postulante) {
        return response()->json(['error' => 'Postulante no encontrado'], 404);
    }

    // Crear y guardar la nueva formación académica
    $postulantefor = new PersonaFormacionPro();
    $postulantefor->id_postulante = $request->id_postulante;
    $postulantefor->id_titulo = $request->id_titulo;
    $postulantefor->institucion = $request->institucion;
    $postulantefor->estado = $request->estado;
    $postulantefor->fecha_ini = $request->fechaini;
    $postulantefor->fecha_fin = $request->fechafin;
    $postulantefor->titulo_acreditado = $request->titulo_acreditado;
    $postulantefor->save();

    return response()->json(['message' => 'Formación académica registrada exitosamente', 'postulante_formacion' => $postulantefor], 201);
}

    
    public function updateFormacionAcademica(Request $request)
    {
        try {
            DB::beginTransaction();
    
            $idPostulante = $request->input('id_postulante');
            $idTitulo = $request->input('id_titulo');
            $institucion = $request->input('institucion');
            $estado = $request->input('estado');
            $fechaini = $request->input('fechaini');
            $fechafin = $request->input('fechafin');
            $titulo_acreditado = $request->input('titulo_acreditado');
    
            // Actualizar los datos de formación académica
            DB::table('formacion_academica')
                ->where('id_postulante', $idPostulante)
                ->where('id_titulo', $idTitulo)
                ->update([
                    'institucion' => $institucion,
                    'estado' => $estado,
                    'fecha_ini' => $fechaini,
                    'fecha_fin' => $fechafin?:Null,
                    'titulo_acreditado' => $titulo_acreditado,
                ]);
    
            DB::commit();
    
            return response()->json(['message' => 'Formación académica actualizada exitosamente.']);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json(['message' => 'No se pudo actualizar la información académica', 'error' => $th->getMessage()], 500);
        }
    }
    
    public function deleteFormacionAcademica(Request $request) {
        try {
            $idPostulante = $request->input('id_postulante');
            $idTitulo = $request->input('id_titulo');
    
            DB::table('formacion_academica')
            ->where('id_postulante', $idPostulante)
            ->where('id_titulo', $idTitulo)
            ->delete();
    
            return response()->json(['message' => 'Formación académica eliminada correctamente'], 200);
    
        } catch (\Throwable $th) {
            return response()->json(['message' => 'No se pudo eliminar la formación académica', 'error' => $th->getMessage()], 500);
        }
    }

    public function agregarExperiencia(Request $request) {
        $request->validate([
            'id_postulante' => 'required|integer',
            'empresa' => 'required|string|max:100',
            'puesto' => 'required|string|max:100',
            'fecha_ini' => 'nullable|date',
            'fecha_fin' => 'nullable|date',
            'descripcion_responsabilidades' => 'required|string|max:500',
            'persona_referencia' => 'required|string|max:250',
            'area'=> 'required|string|max:250',
            'contacto'=> 'required|string|max:250'
        ]);
    
        $postulante = Postulante::find($request->id_postulante);
        if (!$postulante) {
            return response()->json(['error' => 'Postulante no encontrado'], 404);
        }
    
        $postulantexp = new FormacionPro();
        $postulantexp->id_postulante = $request->id_postulante;
        $postulantexp->empresa = $request->empresa;
        $postulantexp->puesto = $request->puesto;
        $postulantexp->fecha_ini = $request->fecha_ini;
        $postulantexp->fecha_fin = $request->fecha_fin;
        $postulantexp->descripcion_responsabilidades = $request->descripcion_responsabilidades;
        $postulantexp->persona_referencia = $request->persona_referencia;
        $postulantexp->area = $request->area;
        $postulantexp->contacto = $request->contacto;
    
        if ($request->fechaini && $request->fechafin) {
            $fecha1 = new DateTime($request->fechaini);
            $fecha2 = new DateTime($request->fechafin);
            $diferencia = $fecha1->diff($fecha2);
            $postulantexp->mes_e = $diferencia->m;
            $postulantexp->anios_e = $diferencia->y;
        } else {
            $postulantexp->mes_e = 0;
            $postulantexp->anios_e = 0;
        }
    
        $postulantexp->save();
        return response()->json(['message' => 'Experiencia agregada exitosamente', $postulantexp], 201);
    }
    
    
    public function getExperiencia($id_usuario)
    {
        // Validar que el ID de usuario sea un número entero
        if (!is_numeric($id_usuario) || intval($id_usuario) <= 0) {
            return response()->json(['message' => 'ID de usuario inválido'], 400);
        }
    
        try {
            $postulante = Postulante::where('id_usuario', $id_usuario)->first();
            if (!$postulante) {
                return response()->json(['message' => 'Postulante no encontrado'], 404);
            }
    
            $experiencias = FormacionPro::where('id_postulante', $postulante->id_postulante)->get();
            return response()->json(['experiencias' => $experiencias], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al recuperar la experiencia'], 500);
        }
    }

    public function getExperienciaById($id)
    {
        try {
            $experiencia = FormacionPro::find($id);

            if (!$experiencia) {
                return response()->json(['message' => 'Experiencia no encontrada'], 404);
            }

            return response()->json(['experiencia' => $experiencia], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al recuperar la experiencia'], 500);
        }
    }
    



    public function getPerfilEmpresa($id)
    {
        try {
            $postulante = Postulante::with(['ubicacion', 'formaciones.titulo', 'idiomas.idioma'])->where('id_postulante', $id)->first();
            if (!$postulante) {
                return response()->json(['message' => 'User not found'], 404);
            }

            $response = [
                'postulante' => $postulante,
                
            ];

            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error retrieving user profile'], 500);
        }
    }

    public function updateExperiencia(Request $request){
        try {
            DB::beginTransaction();
    
            $idPostulante = $request->input('id_postulante');
            $idExperiencia = $request->input('id_experiencia');
            $empresa = $request->input('empresa');
            $puesto = $request->input('puesto');
            $fecha_ini = $request->input('fecha_ini');
            $fecha_fin = $request->input('fecha_fin');
            $descripcion_responsabilidades = $request->input('descripcion_responsabilidades');
            $persona_referencia = $request->input('persona_referencia');
            $area = $request->input('area');
            $contacto = $request->input('contacto');
    
            // Actualizar los datos de la experiencia
            DB::table('formacion_profesional')
                ->where('id_postulante', $idPostulante)
                ->where('id_formacion_pro', $idExperiencia)
                ->update([
                    'empresa' => $empresa,
                    'puesto' => $puesto,
                    'fecha_ini' => $fecha_ini,
                    'fecha_fin' => $fecha_fin,
                    'descripcion_responsabilidades' => $descripcion_responsabilidades,
                    'persona_referencia' => $persona_referencia,
                    'area' => $area,
                    'contacto' => $contacto,
                ]);
    
            DB::commit();
    
            return response()->json(['message' => 'Experiencia actualizada exitosamente.']);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json(['message' => 'No se pudo actualizar la experiencia', 'error' => $th->getMessage()], 500);
        }
    }

    public function deleteExperiencia($id)
{
    try {
        $experiencia = FormacionPro::find($id);

        if (!$experiencia) {
            return response()->json(['message' => 'Experiencia no encontrada'], 404);
        }

        $experiencia->delete();

        return response()->json(['message' => 'Experiencia eliminada exitosamente'], 200);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Error al eliminar la experiencia'], 500);
    }
}

public function getProfileImage($userId)
{
    // Obtén la URL de la imagen desde la base de datos usando el ID del usuario
    $postulante = Postulante::where('id_usuario', $userId)->first();

    if (!$postulante || !$postulante->foto) {
        return response('No se encontró la imagen del perfil.', 404);
    }

    $firebaseImageUrl = $postulante->foto;

    // Descarga la imagen desde Firebase Storage
    $response = Http::get($firebaseImageUrl);

    if ($response->ok()) {
        // Retorna la imagen como respuesta
        return response($response->body(), 200)->header('Content-Type', $response->header('Content-Type'));
    } else {
        // Maneja el error si no se puede descargar la imagen
        return response('No se pudo descargar la imagen.', 404);
    }
}

public function updateCV($userId, Request $request)
    {
        // Validar y obtener el URL del CV desde el request
        $request->validate([
            'cv' => 'required|string', // Asegúrate de validar que el CV sea una URL válida
        ]);
        
        $cvUrl = $request->input('cv');

        // Obtén el postulante por el id_usuario
        $postulante = Postulante::where('id_usuario', $userId)->first();

        if (!$postulante) {
            return response()->json(['error' => 'No se encontró el postulante.'], 404);
        }

        // Actualizar el campo cv del postulante con la nueva URL
        $postulante->cv = $cvUrl;
        $postulante->save();

        return response()->json(['message' => 'CV actualizado correctamente.', 'postulante' => $postulante], 200);
    }

    public function checkCv($id_postulante)
{
    $postulante = Postulante::where('id_usuario', $id_postulante)->first();

    if ($postulante && $postulante->hasCv()) {
        return response()->json(['hasCv' => true], 200);
    } else {
        return response()->json(['hasCv' => false, 'message' => 'No has subido tu CV.'], 400);
    }
}
  //Buscar postulante por el nombre
  public function searchPostulante (Request $request) {
    try {

        $nombreApellido = $request->input('nombre_apellido');
        
         $postulantes = Postulante::where('nombres', 'like', $nombreApellido . '%')
                ->orWhere('apellidos', 'like', $nombreApellido . '%')
                    ->get();
        
        if($postulantes->isEmpty()) {
            return response()->json([
                'message' => 'No se encontró al usuario',

            ], 404);
        }
        return response($postulantes);


    } catch (\Throwable $th) {
        return response()->json([
            'message' => 'No se pudo buscar al postulante',
            'error' => $th->getMessage()
        ], 500);
    }
}

//Traer todos los datos del postulante por el ID
public function getPostulanteData ($idPostulante) {
    try {
        $postulante = Postulante::with('idiomas')->findOrFail($idPostulante);
        return response()->json($postulante);

    } catch (\Throwable $th) {
        return response()->json([
            'message' => 'No se pudo traer los datos del postulante',
            'error' => $th->getMessage()
        ], 500);
    }
}



public function getPostulanteById($id_postulante)
{
    try {
        $postulante = DB::table('postulante')
            ->where('id_postulante', $id_postulante)
            ->first();

        if (!$postulante) {
            return response()->json(['message' => 'Postulante no encontrado'], 404);
        }

        $usuario = DB::table('users')->where('id', $postulante->id_usuario)->first();
        $ubicacion = DB::table('ubicacion')->where('id', $postulante->id_ubicacion)->first();
        $formaciones = DB::table('formacion_academica')->where('id_postulante', $id_postulante)->get();
        $titulos = DB::table('formacion_academica')
            ->join('titulo', 'formacion_academica.id_titulo', '=', 'titulo.id')
            ->where('formacion_academica.id_postulante', $id_postulante)
            ->select('titulo.*')
            ->get();
        $idiomas = DB::table('postulante_idioma')
            ->join('idioma', 'postulante_idioma.id_idioma', '=', 'idioma.id')
            ->where('postulante_idioma.id_postulante', $id_postulante)
            ->select('postulante_idioma.*', 'idioma.nombre as idioma_nombre')
            ->get();
        $red = DB::table('postulante_red')->where('id_postulante', $id_postulante)->get();
        $postulaciones = DB::table('postulacion')->where('id_postulante', $id_postulante)->get();
        $formapro = DB::table('formacion_profesional')->where('id_postulante', $id_postulante)->get();
        $certificados = DB::table('certificado')->where('id_postulante', $id_postulante)->get();

        return response()->json([
            'postulante' => $postulante,
            'usuario' => $usuario,
            'ubicacion' => $ubicacion,
            'formaciones' => $formaciones,
            'titulos' => $titulos,
            'idiomas' => $idiomas,
            'red' => $red,
            'postulaciones' => $postulaciones,
            'formapro' => $formapro,
            'certificados' => $certificados,
            'cv' => $postulante->cv,
        ]);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Error al obtener el postulante', 'error' => $e->getMessage()], 500);
    }
}

}



