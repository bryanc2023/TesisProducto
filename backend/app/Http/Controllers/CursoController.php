<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\Certificado;
use Illuminate\Support\Facades\DB;

class CursoController extends Controller
{
    public function newCertificado(Request $request)
    {
        $certificado = Certificado::create([
            'id_postulante' => $request->input('id_postulante'),
            'titulo' => $request->input('titulo'),
            'certificado' => $request->input('certificado')
        ]);

        return response()->json($certificado, 201);
    }

    public function getCertificado($id)
    {
        $certificado = Certificado::find($id);

        if (!$certificado) {
            return response()->json(['message' => 'Certificado no encontrado'], 404);
        }

        return response()->json($certificado, 200);
    }

    public function getCertificados($id_postulante)
    {
        $certificados = Certificado::where('id_postulante', $id_postulante)->get();

        return response()->json($certificados, 200);
    }

    public function updateCertificado(Request $request, $id)
    {
        $certificado = Certificado::find($id);

        if (!$certificado) {
            return response()->json(['message' => 'Certificado no encontrado'], 404);
        }

        $certificado->id_postulante = $request->input('id_postulante');
        $certificado->titulo = $request->input('titulo');
        $certificado->certificado = $request->input('certificado');
        $certificado->save();

        return response()->json($certificado, 200);
    }

    public function deleteCertificado($id)
    {
        $certificado = Certificado::find($id);

        if (!$certificado) {
            return response()->json(['message' => 'Certificado no encontrado'], 404);
        }

        $certificado->delete();

        return response()->json(['message' => 'Certificado eliminado'], 200);
    }


}

