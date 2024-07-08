<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Notifications\Notificaciones;

class NotificacionesController extends Controller
{
    public function construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        try {
            $notificaciones = auth()->user()->unreadNotifications;
       
            if ($notificaciones->isEmpty()) {
                return response()->json(['message' => 'No hay notificaciones'], 404);
            }

            return response()->json($notificaciones);

        } catch (\Throwable $th) {
            return response()->json(
                [
                    'message' => 'Error al obtener las notificaciones',
                    'error' => $th->getMessage()
                ],
                
                500
            );
        }
 
    }

    public function marcarLeida($id)
    {
        auth()->user()->unreadNotifications->where('id', $id)->markAsRead();
        return response()->json(['message' => 'Notificación marcada como leída']);
    }

    public function marcarTodasLeidas()
    {
        auth()->user()->unreadNotifications->markAsRead();
        return response()->json(['message' => 'Todas las notificaciones marcadas como leídas']);
    }
    public function __construct()
    {
        $this->middleware('auth');
    }

    
}
