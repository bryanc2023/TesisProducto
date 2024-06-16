<?php

namespace App\Http\Controllers;

use App\Models\Empresa;
use App\Models\EmpresaRed;
use App\Models\User;
use Illuminate\Http\Request;

class EmpresaController extends Controller
{
    public function registerEmp(Request $request){

        $empresa = new Empresa();
        $empresa->id_ubicacion = $request->ubicacion;
        $empresa->id_usuario = $request->usuario_id;
        $empresa->id_sector = $request->sector;
        $empresa->nombre_comercial = $request->companyName;
           // Obtener el número de empleados
    $numberOfEmployees = $request->input('numberOfEmployees');

    // Determinar el tamaño de la empresa
    if ($numberOfEmployees >= 1 && $numberOfEmployees <= 9) {
        $tamanio = 'Microempresa';
    } elseif ($numberOfEmployees >= 10 && $numberOfEmployees <= 49) {
        $tamanio = 'Pequeña';
    } elseif ($numberOfEmployees >= 50 && $numberOfEmployees <= 199) {
        $tamanio = 'Mediana';
    } elseif ($numberOfEmployees >= 200) {
        $tamanio = 'Gran empresa';
    } else {
        // Opcional: manejo de error si el número de empleados no cae en ningún rango
        $tamanio = 'No definido';
    }

        $empresa->tamanio = $tamanio;
        $empresa->descripcion =  $request->description;
        $empresa->logo = $request->logo->store('images', 'public');
        $empresa->cantidad_empleados=  $request->numberOfEmployees;
        // Obtener los datos de socialLinks del request

$empresa->save();
$socialLinksData = $request->input('socialLinks');
// Procesar los datos solo si socialLinksData no está vacío
if (!empty($socialLinksData)) {
    // Guardar los datos principales de la empresa
    $empresa->save();

    // Iterar sobre cada enlace social y guardar en la base de datos
    foreach ($socialLinksData as $linkData) {
        // Obtener plataforma y URL del enlace social
        $platform = $linkData['platform'];
        $url = $linkData['url'];

        // Crear un nuevo registro en la tabla EmpresaRed
        EmpresaRed::create([
            'nombre_red' => $platform,
            'enlace' => $url,
            'id_empresa' => $empresa->id_empresa,
        ]);
    
    }
}
        if ( $empresa->id_usuario) {
            $user = User::find($empresa->id_usuario);
            if ($user) {
                $user->first_login_at = now();
                $user->save();
            }
        }
         
        return response()->json(['message' => 'Empresa creado exitosamente', 'empresa' => $empresa], 201);
    }

    public function completo(Request $request){
        $empresa = Empresa::find($request->id_empresa);
        if ($empresa && $empresa->id_usuario) {
            $user = User::find($empresa->id_usuario);
            if ($user) {
                $user->first_login_at = now();
                $user->save();
            }
        }
        return response()->json(['message' => 'Empresa creado exitosamente', 'empresa' => $empresa], 201);
    }
    
    public function getEmpresaByIdUser($idUser)
{
    try {
        $empresa = Empresa::with([
            'red' => function ($query) {
                $query->select('id_empresa_red', 'nombre_red', 'enlace');
            },
            'sector' => function ($query) {
                $query->select('id', 'sector', 'division'); // Seleccionar solo los campos necesarios
            },
            'ubicacion' => function ($query) {
                $query->select('id', 'provincia', 'canton'); // Seleccionar solo los campos necesarios
            }
        ])->where('id_usuario', $idUser)->first();

        return response()->json($empresa);

    } catch (\Throwable $th) {
        return response()->json([
            'message' => 'Empresa no encontrada',
            'error' => $th->getMessage()
        ], 500);
    }
}

    


}
