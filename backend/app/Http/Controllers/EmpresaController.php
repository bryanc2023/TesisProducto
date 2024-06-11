<?php

namespace App\Http\Controllers;

use App\Models\Empresa;
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
        $empresa->tamanio = "Mediana";
        $empresa->descripcion =  $request->description;
        $empresa->logo = $request->logo->store('images', 'public');
        $empresa->cantidad_empleados=  $request->numberOfEmployees;
      
        $empresa->save();

      
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
}
