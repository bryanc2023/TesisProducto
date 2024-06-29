<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class EmpresaGestoraController extends Controller
{
    // Función para obtener todos los usuarios que sean postulantes
    public function getPostulantes()
    {
        $postulantes = User::whereHas('postulante')->with('postulante')->get();
        return response()->json($postulantes);
    }

    // Función para obtener todos los usuarios que sean empresas
    public function getEmpresas()
    {
        $empresas = User::whereHas('empresa')->with('empresa')->get();
        return response()->json($empresas);
    }
}
