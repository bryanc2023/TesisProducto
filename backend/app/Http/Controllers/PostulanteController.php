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
    public function registerPos(PostulanteRequest $request){

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
        $postulante->foto = $request->image->store('images');
        // Ajusta el nombre del campo del CV según sea necesario
        $postulante->cv = $request->input('cv');

        // Guardar el postulante
        $postulante->save();

        return response()->json(['message' => 'Postulante creado exitosamente', 'postulante' => $postulante], 201);
    }
    public function obtenerIdPostulante(Request $request)
    {
        // Obtener el ID del usuario desde la solicitud
        $idUsuario = $request->input('id_usuario');

        // Llamar a la función en el modelo Postulante para obtener el ID del postulante
        $idPostulante = Postulante::getIdPostulantePorIdUsuario($idUsuario);

        // Aquí puedes continuar con tu lógica utilizando $idPostulante
        if ($idPostulante) {
            // Si se encontró el ID del postulante, haz algo
            return response()->json(['id_postulante' => $idPostulante]);
        } else {
            // Si no se encontró el ID del postulante, maneja la situación
            return response()->json(['error' => 'No se encontró el ID del postulante'], 404);
        }
    }

    public function registroFormaAca(Request $request){

        // Validación de los datos del request
    $request->validate([
        'id_postulante' => 'required|integer|exists:postulante,id_postulante',
        'id_titulo' => 'required|integer|exists:titulo,id',
        'institucion' => 'required|string|max:220',
        'estado' => 'required|string|max:30',
        'fechaini' => 'nullable|date',
        'fechafin' => 'nullable|date'
    ]);

    // Crear una nueva instancia de PersonaFormacionPro con los datos del request
    $postulantefor = new PersonaFormacionPro();
    $postulantefor->id_postulante = $request->id_postulante;
    $postulantefor->id_titulo = $request->id_titulo;
    $postulantefor->institucion = $request->institucion;
    $postulantefor->estado = $request->estado;
    $postulantefor->fecha_ini = $request->fechaini;
    $postulantefor->fecha_fin = $request->fechafin;

    // Guardar el registro en la base de datos
    $postulantefor->save();

     // Actualizar el campo first_login_at en la tabla users
     $postulante = Postulante::find($request->id_postulante);
     if ($postulante && $postulante->id_usuario) {
         $user = User::find($postulante->id_usuario);
         if ($user) {
             $user->first_login_at = now();
             $user->save();
         }
     }
 
    // Devolver una respuesta JSON con el mensaje y los datos del postulante creado
    return response()->json(['message' => 'Formación académica registrada exitosamente', 'postulante_formacion' => $postulantefor], 201);
}
}
