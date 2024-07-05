<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Notifications\Notificaciones;

class NotificacionesController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $notificaciones = auth()->user()->unreadNotifications;
        return response()->json($notificaciones);
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
}
