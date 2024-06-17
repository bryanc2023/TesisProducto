<?php
namespace App\Http\Controllers;

use App\Http\Requests\Postulante\PostulanteRequest;
use App\Models\PersonaFormacionPro;
use App\Models\Postulante;
use App\Models\User;
use DateTime;
use Illuminate\Http\Request;

class PostulanteController extends Controller
{
    public function registerPos(PostulanteRequest $request)
    {
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

        // Ajusta el nombre del campo de la foto según sea necesario
        $postulante->foto = $request->image->store('images', 'public');

        $postulante->cv = $request->input('cv');

        // Guardar el postulante
        $postulante->save();

        return response()->json(['message' => 'Postulante creado exitosamente', 'postulante' => $postulante], 201);
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

    public function registroFormaAcaPlus(Request $request)
    {
        $request->validate([
            'id_postulante' => 'required|integer',
            'id_titulo' => 'required|integer|exists:titulo,id',
            'institucion' => 'required|string|max:220',
            'estado' => 'required|string|max:30',
            'fechaini' => 'nullable|date',
            'fechafin' => 'nullable|date'
        ]);

       
        
        $postulante = Postulante::where('id_usuario', $request->id_postulante)->first();
    if (!$postulante) {
        return response()->json(['error' => 'Postulante no encontrado'], 404);
    }

        $idp=  $postulante->id_postulante;
        $postulantefor = new PersonaFormacionPro();
        $postulantefor->id_postulante = $idp;
        $postulantefor->id_titulo = $request->id_titulo;
        $postulantefor->institucion = $request->institucion;
        $postulantefor->estado = $request->estado;
        $postulantefor->fecha_ini = $request->fechaini;
        $postulantefor->fecha_fin = $request->fechafin;

        $postulantefor->save();

    

        return response()->json(['message' => 'Formación académica registrada exitosamente', 'postulante_formacion' => $postulantefor], 201);
    }

    public function getPerfil($id)
    {
        try {
            $postulante = Postulante::with(['ubicacion', 'formaciones.titulo'])->where('id_usuario', $id)->first();
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
            'fechafin' => 'nullable|date'
        ]);

        $postulantefor = new PersonaFormacionPro();
        $postulantefor->id_postulante = $request->id_postulante;
        $postulantefor->id_titulo = $request->id_titulo;
        $postulantefor->institucion = $request->institucion;
        $postulantefor->estado = $request->estado;
        $postulantefor->fecha_ini = $request->fechaini;
        $postulantefor->fecha_fin = $request->fechafin;

        $postulantefor->save();

        $postulante = Postulante::find($request->id_postulante);
        if ($postulante && $postulante->id_usuario) {
            $user = User::find($postulante->id_usuario);
            if ($user) {
                $user->first_login_at = now();
                $user->save();
            }
        }

        return response()->json(['message' => 'Formación académica registrada exitosamente', 'postulante_formacion' => $postulantefor], 201);
    }

    public function prueba(Request $request)
    {
        $postulante = Postulante::where('id_usuario', $request->id_postulante)->first();
    if (!$postulante) {
        return response()->json(['error' => 'Postulante no encontrado'], 404);
    }
    $idp=  $postulante->id_postulante;
    return response()->json(['id_postulante' => $idp], 200);
}

public function updatePostulanteByIdUser(Request $request, $idUser)
{
    try {
        // Buscar el postulante por ID de usuario
        $postulante = Postulante::where('id_usuario', $idUser)->first();
        
        if (!$postulante) {
            return response()->json([
                'message' => 'Postulante no encontrado'
            ], 404);
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
        if ($request->hasFile('image')) {
            $postulante->foto = $request->image->store('images', 'public');
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

}
