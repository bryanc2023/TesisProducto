<?php

namespace App\Http\Controllers;

use App\Http\Requests\Postulante\PostulanteRequest;
use App\Models\FormacionPro;
use App\Models\PersonaFormacionPro;
use App\Models\Postulante;
use App\Models\PostulanteIdioma;
use App\Models\User;
use App\Models\Titulo;
use App\Models\Ubicacion;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

        // Guardar el postulante
        $postulante->save();

        // Actualizar el campo first_login_at del usuario
        $user = User::find($request->usuario_id);
        if ($user && is_null($user->first_login_at)) {
            $user->first_login_at = now();
            $user->save();
        }

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
        $postulante = Postulante::with(['ubicacion', 'formaciones.titulo', 'idiomas.idioma'])->where('id_usuario', $id)->first();
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
            'cv' => 'required|string', // URL del CV desde Firebase
        ]);

        $postulantefor = new PersonaFormacionPro();
        $postulantefor->id_postulante = $request->id_postulante;
        $postulantefor->id_titulo = $request->id_titulo;
        $postulantefor->institucion = $request->institucion;
        $postulantefor->estado = $request->estado;
        $postulantefor->fecha_ini = $request->fechaini;
        $postulantefor->fecha_fin = $request->fechafin;
        $postulantefor->save();

        $postulanteidi = new PostulanteIdioma();
        $postulanteidi->id_postulante = $request->id_postulante;
        $postulanteidi->id_idioma = $request->id_idioma;
        $postulanteidi->nivel_oral = $request->niveloral;
        $postulanteidi->nivel_escrito = $request->nivelescrito;
        $postulanteidi->save();

        $postulante = Postulante::find($request->id_postulante);
        if ($postulante) {
            $postulante->cv = $request->cv;
            $postulante->save();
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
        $postulanteidi = new PostulanteIdioma();
        $postulanteidi->id_postulante = $idp;
        $postulanteidi->id_idioma = $request->idiomaId;
        $postulanteidi->nivel_oral = $request->nivelOral;
        $postulanteidi->nivel_escrito = $request->nivelEscrito;
        $postulanteidi->save();

        return response()->json(['message' => 'Postulante registrada exitosamente', 'postulante_formacion' => $postulanteidi], 201);
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
            'id_postulante' => 'required|integer',
            'id_titulo' => 'required|integer|exists:titulo,id',
            'institucion' => 'required|string|max:220',
            'estado' => 'required|string|max:30',
            'fechaini' => 'nullable|date',
            'fechafin' => 'nullable|date',
            'titulo_acreditado' => 'required|string|max:220'
        ]);
    
        $postulante = Postulante::where('id_usuario', $request->id_postulante)->first();
        if (!$postulante) {
            return response()->json(['error' => 'Postulante no encontrado'], 404);
        }
    
        $idp = $postulante->id_postulante;
        $postulantefor = new PersonaFormacionPro();
        $postulantefor->id_postulante = $idp;
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
                    'fecha_fin' => $fechafin,
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
            'fechaini' => 'nullable|date',
            'fechafin' => 'nullable|date',
            'descripcion' => 'required|string|max:500',
            'referencia' => 'required|string|max:250',
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
        $postulantexp->fecha_ini = $request->fechaini;
        $postulantexp->fecha_fin = $request->fechafin;
        $postulantexp->descripcion_responsabilidades = $request->descripcion;
        $postulantexp->persona_referencia = $request->referencia;
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
            $fechaini = $request->input('fechaini');
            $fechafin = $request->input('fechafin');
            $descripcion = $request->input('descripcion');
            $referencia = $request->input('referencia');
            $area = $request->input('area');
            $contacto = $request->input('contacto');
    
            // Actualizar los datos de la experiencia
            DB::table('formacion_profesional')
                ->where('id_postulante', $idPostulante)
                ->where('id_formacion_pro', $idExperiencia)
                ->update([
                    'empresa' => $empresa,
                    'puesto' => $puesto,
                    'fecha_ini' => $fechaini,
                    'fecha_fin' => $fechafin,
                    'descripcion_responsabilidades' => $descripcion,
                    'persona_referencia' => $referencia,
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

   
}

