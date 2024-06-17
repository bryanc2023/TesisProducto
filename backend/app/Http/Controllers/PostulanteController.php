<?php
namespace App\Http\Controllers;

use App\Http\Requests\Postulante\PostulanteRequest;
use App\Models\PersonaFormacionPro;
use App\Models\Postulante;
use App\Models\PostulanteIdioma;
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
            $postulante = Postulante::with(['ubicacion', 'formaciones.titulo','idiomas.idioma'])->where('id_usuario', $id)->first();
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
        
            'cv' => 'required|file|mimes:pdf', // Validación para el archivo PDF
        ]);
        // Manejo del archivo PDF
    if ($request->hasFile('cv')) {
        $file = $request->file('cv');
        $filename = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('cvs', $filename, 'public'); // Guarda en el directorio 'storage/app/public/cvs'

        // Actualiza la tabla postulante con la ruta del archivo PDF
        $postulante = Postulante::find($request->id_postulante);
        if ($postulante) {
            $postulante->cv = $path;
            $postulante->save();
        }
    }

       

        $postulantefor = new PersonaFormacionPro();
        $postulantefor->id_postulante = $request->id_postulante;
        $postulantefor->id_titulo = $request->id_titulo;
        $postulantefor->institucion = $request->institucion;
        $postulantefor->estado = $request->estado;
        $postulantefor->fecha_ini = $request->fechaini;
        $postulantefor->fecha_fin = $request->fechafin;

        $postulantefor->save();

        $postulanteidi = new PostulanteIdioma();
        $postulanteidi->id_postulante  = $request->id_postulante;
        $postulanteidi->id_idioma = $request->id_idioma;
        $postulanteidi->nivel_oral = $request->niveloral;
        $postulanteidi->nivel_escrito = $request->nivelescrito;

        $postulanteidi->save();

       
$postulante = Postulante::find($request->id_postulante);
if ($postulante && $postulante->id_usuario) {
    $user = User::find($postulante->id_usuario);
    if ($user) {
        $user->first_login_at = now();
        $user->save();
    }
}


        return response()->json(['message' => 'Formación académica registrada exitosamente', 'postulante_formacion' => $postulante], 201);
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

    $idp=  $postulante->id_postulante;
    $postulanteidi = new PostulanteIdioma();
    $postulanteidi->id_postulante = $idp;
    $postulanteidi->id_idioma = $request->idiomaId;
    $postulanteidi->nivel_oral = $request->nivelOral;
    $postulanteidi->nivel_escrito = $request->nivelEscrito;
  

    $postulanteidi->save();



    return response()->json(['message' => 'Postulante registrada exitosamente', 'postulante_formacion' => $postulanteidi], 201);
}

}