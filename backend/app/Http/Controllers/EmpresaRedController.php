<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EmpresaRed;

class EmpresaRedController extends Controller
{
    public function redEmpresa(Request $request)
    {
        $request->validate([
            'id_empresa' => 'required|exists:empresa,id_empresa', // Validación correcta
            'nombre_red' => 'required|string|max:255',
            'enlace' => 'required|url',
        ]);

        $empresaRed = new EmpresaRed();
        $empresaRed->id_empresa = $request->id_empresa;
        $empresaRed->nombre_red = $request->nombre_red;
        $empresaRed->enlace = $request->enlace;
        $empresaRed->save();

        return response()->json(['message' => 'Datos de la red de la empresa guardados exitosamente'], 201);
    }

    public function getRedEmpresa($id_empresa)
    {
        $redes = EmpresaRed::where('id_empresa', $id_empresa)->get();
        return response()->json($redes);
    }
}
