<?php

namespace App\Http\Controllers;

use App\Models\AreaTrabajo;
use Illuminate\Http\Request;
use App\Models\User;
use Carbon\Carbon; ;
use App\Models\Oferta;
use Illuminate\Support\Facades\DB;
use App\Models\Postulacion;
use App\Models\Postulante;
use App\Models\Ubicacion;

class EmpresaGestoraController extends Controller
{
 
    
    public function getPostulantes(Request $request)
    {
        $startDate = $request->query('startDate') ? Carbon::parse($request->query('startDate'))->startOfDay() : null;
        $endDate = $request->query('endDate') ? Carbon::parse($request->query('endDate'))->endOfDay() : null;
    
        $query = DB::table('users')
            ->join('postulante', 'users.id', '=', 'postulante.id_usuario')
            ->select('users.id', 'users.name', 'users.email', 'users.created_at', 'postulante.id_postulante', 'postulante.vigencia');
    
        if ($startDate) {
            $query->where('users.created_at', '>=', $startDate);
        }
    
        if ($endDate) {
            $query->where('users.created_at', '<=', $endDate);
        }
    
        $users = $query->get();
    
        $result = $users->map(function ($user) {
            $postulaciones = DB::table('postulacion')
                ->join('oferta', 'postulacion.id_oferta', '=', 'oferta.id_oferta')
                ->where('postulacion.id_postulante', '=', $user->id_postulante)
                ->select('oferta.cargo')
                ->get();
    
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => Carbon::parse($user->created_at)->format('Y-m-d'),
                'num_postulaciones' => $postulaciones->count(),
                'detalles_postulaciones' => $postulaciones,
                'vigencia' => $user->vigencia ? 'Activo' : 'Inactivo',
            ];
        });
    
        return response()->json($result);
    }
    


    
    public function getEmpresas(Request $request)
    {
        $startDate = $request->query('startDate') ? Carbon::parse($request->query('startDate'))->startOfDay() : null;
        $endDate = $request->query('endDate') ? Carbon::parse($request->query('endDate'))->endOfDay() : null;

        $roleId = 3; // Role ID para 'empresa'

        $query = User::where('role_id', $roleId)->whereHas('empresa');

        if ($startDate) {
            $query->where('created_at', '>=', $startDate);
        }

        if ($endDate) {
            $query->where('created_at', '<=', $endDate);
        }

        $users = $query->get()->map(function ($user) {
            $empresa = $user->empresa;
            $ofertas = $empresa ? $empresa->ofertas->map(function ($oferta) {
                return [
                    'id_oferta' => $oferta->id_oferta,
                    'cargo' => $oferta->cargo,
                    'experiencia' => $oferta->experiencia,
                    'fecha_publi' => $oferta->fecha_publi,
                    'num_postulantes' => $oferta->postulaciones->count(), // Conteo de postulaciones
                ];
            }) : [];

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at->format('Y-m-d'),
                'empresa' => $empresa ? [
                    'nombre_comercial' => $empresa->nombre_comercial,
                    'ofertas' => $ofertas,
                ] : null,
            ];
        });

        return response()->json($users);
    }

    public function getOfertasPorMes(Request $request)
    {
        $year = $request->query('year', date('Y'));
    
        $ofertasPorMes = Oferta::select(
                DB::raw('YEAR(fecha_publi) as year'),
                DB::raw('MONTH(fecha_publi) as month'),
                DB::raw('COUNT(*) as total')
            )
            ->whereYear('fecha_publi', $year)
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->get();
    
        return response()->json($ofertasPorMes);
    }

    public function getUsuariosRegistradosPorMes(Request $request)
    {
        // Consulta para obtener el conteo de usuarios agrupados por mes y año
        $usuariosPorMes = User::select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->get();

        return response()->json($usuariosPorMes);
    }

    public function getPostulacionesPorMes(Request $request)
    {
        $year = $request->query('year', date('Y'));
    
        $postulaciones = DB::table('postulacion')
            ->select(
                DB::raw('YEAR(fecha_postulacion) as year'),
                DB::raw('MONTH(fecha_postulacion) as month'),
                DB::raw('COUNT(*) as total')
            )
            ->whereYear('fecha_postulacion', $year)
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->get();
    
        return response()->json($postulaciones);
    }

    // Controlador para obtener las áreas
public function getAreas()
{
    $areas = AreaTrabajo::all();
    return response()->json($areas);
}

// Controlador para obtener las ubicaciones
public function getUbicaciones()
{
    $ubicaciones = Ubicacion::all();
    return response()->json($ubicaciones);
}

// Controlador para obtener los postulantes por ubicación
public function getPostulantesPorUbicacion(Request $request)
{
   
        $ubicacionId = $request->input('ubicacion');
    
        $postulaciones = Postulacion::join('postulante', 'postulacion.id_postulante', '=', 'postulante.id_postulante')
            ->where('postulante.id_ubicacion', $ubicacionId)
            ->count();
    
        $ofertas = Oferta::join('empresa', 'oferta.id_empresa', '=', 'empresa.id_empresa')
            ->where('empresa.id_ubicacion', $ubicacionId)
            ->count();
    
        return response()->json([
            'postulaciones' => $postulaciones,
            'ofertas' => $ofertas,
        ]);
    
}

// Controlador para obtener los postulantes por área
public function getPostulantesPorArea(Request $request)
{
    $areaId = $request->input('area');

    $postulaciones = Postulacion::join('oferta', 'postulacion.id_oferta', '=', 'oferta.id_oferta')
        ->where('oferta.id_area', $areaId)
        ->count();

    $ofertas = Oferta::where('id_area', $areaId)->count();

    return response()->json([
        'postulaciones' => $postulaciones,
        'ofertas' => $ofertas,
    ]);
}

// Controlador para obtener los postulantes por género
public function getPostulantesPorGenero(Request $request)
{
    $query = Postulante::select(
            DB::raw('SUM(CASE WHEN genero = "Masculino" THEN 1 ELSE 0 END) as masculino'),
            DB::raw('SUM(CASE WHEN genero = "Femenino" THEN 1 ELSE 0 END) as femenino'),
            DB::raw('SUM(CASE WHEN genero NOT IN ("Masculino", "Femenino") THEN 1 ELSE 0 END) as otro')
        );

    if ($request->has('area') && $request->input('area') != '') {
        $query->join('postulacion', 'postulante.id_postulante', '=', 'postulacion.id_postulante')
              ->join('oferta', 'postulacion.id_oferta', '=', 'oferta.id_oferta')
              ->where('oferta.id_area', $request->input('area'));
    }


 
    $data = $query->first();

    return response()->json($data);
}

    
}
