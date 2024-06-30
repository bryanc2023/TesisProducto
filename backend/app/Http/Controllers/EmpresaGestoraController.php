<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Carbon\Carbon; ;

class EmpresaGestoraController extends Controller
{
    public function getPostulantes(Request $request)
    {
        $startDate = $request->query('startDate') ? Carbon::parse($request->query('startDate'))->startOfDay() : null;
        $endDate = $request->query('endDate') ? Carbon::parse($request->query('endDate'))->endOfDay() : null;
    
        $query = User::whereHas('postulante');
    
        if ($startDate) {
            $query->where('created_at', '>=', $startDate);
        }
    
        if ($endDate) {
            $query->where('created_at', '<=', $endDate);
        }
    
        $users = $query->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at->format('Y-m-d'),
            ];
        });
    
        return response()->json($users);
    }
    
    public function getEmpresas(Request $request)
    {
        $startDate = $request->query('startDate') ? Carbon::parse($request->query('startDate'))->startOfDay() : null;
        $endDate = $request->query('endDate') ? Carbon::parse($request->query('endDate'))->endOfDay() : null;
    
        $query = User::whereHas('empresa');
    
        if ($startDate) {
            $query->where('created_at', '>=', $startDate);
        }
    
        if ($endDate) {
            $query->where('created_at', '<=', $endDate);
        }
    
        $users = $query->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at->format('Y-m-d'),
            ];
        });
    
        return response()->json($users);
    }
}
