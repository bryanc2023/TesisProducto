<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
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

public function updateEmpresaByIdUser(Request $request, $idUser)
{
    try {
        $empresa = Empresa::where('id_usuario', $idUser)->first();
        
        if (!$empresa) {
            return response()->json([
                'message' => 'Empresa no encontrada'
            ], 404);
        }

        // Actualizar los campos de la empresa
        $empresa->nombre_comercial = $request->input('nombre_comercial', $empresa->nombre_comercial);
        $empresa->descripcion = $request->input('descripcion', $empresa->descripcion);
        $empresa->cantidad_empleados = $request->input('cantidad_empleados', $empresa->cantidad_empleados);
        $empresa->logo = $request->input('logo', $empresa->logo);

        // Calcular y actualizar el tamaño según la cantidad de empleados
        if ($request->has('cantidad_empleados')) {
            $empresa->tamanio = $this->calcularTamano($empresa->cantidad_empleados);
        }

        // Actualizar la red si está presente en el request
        if ($request->has('red')) {
            foreach ($request->input('red') as $redData) {
                $red = $empresa->red()->where('id_empresa_red', $redData['id_empresa_red'])->first();
                if ($red) {
                    $red->nombre_red = $redData['nombre_red'] ?? $red->nombre_red;
                    $red->enlace = $redData['enlace'] ?? $red->enlace;
                    $red->save();
                }
            }
        }

        // Actualizar el sector si está presente en el request
        if ($request->has('sector')) {
            $sector = $empresa->sector()->first();
            if ($sector) {
                $sector->sector = $request->input('sector.sector', $sector->sector);
                $sector->division = $request->input('sector.division', $sector->division);
                $sector->save();
            }
        }

        // Actualizar la ubicación si está presente en el request
        if ($request->has('ubicacion')) {
            $ubicacion = $empresa->ubicacion()->first();
            if ($ubicacion) {
                $ubicacion->provincia = $request->input('ubicacion.provincia', $ubicacion->provincia);
                $ubicacion->canton = $request->input('ubicacion.canton', $ubicacion->canton);
                $ubicacion->save();
            }
        }

        $empresa->save();

        return response()->json([
            'message' => 'Empresa actualizada correctamente',
            'empresa' => $empresa
        ]);

    } catch (\Throwable $th) {
        Log::error('Error al actualizar la empresa: '.$th->getMessage());
        return response()->json([
            'message' => 'Error al actualizar la empresa',
            'error' => $th->getMessage()
        ], 500);
    }
}

private function calcularTamano($numberOfEmployees)
{
    if ($numberOfEmployees >= 1 && $numberOfEmployees <= 9) {
        return 'Microempresa';
    } elseif ($numberOfEmployees >= 10 && $numberOfEmployees <= 49) {
        return 'Pequeña';
    } elseif ($numberOfEmployees >= 50 && $numberOfEmployees <= 199) {
        return 'Mediana';
    } elseif ($numberOfEmployees >= 200) {
        return 'Gran empresa';
    } else {
        // Opcional: manejo de error si el número de empleados no cae en ningún rango
        return 'No definido';
    }
}





}
