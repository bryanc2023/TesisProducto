<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\View\Component;
use App\Models\User;
use App\Notifications\ResetPassword;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('role')->get();
        return response()->json($users, 200);
    }

    public function index2()
    {
        $roles = Role::all();
        return response()->json($roles, 200);
    }
    public function resetPassword(Request $request)
    {

        try {
            $email = $request->input('email');
 
            //comprobar si existe el usuario
            $user = User::where('email', $email)->first();
            if(!$user) {
                return response()->json(['message' =>'El email no está registrado en la aplicación'], 404);
            }
 
            // Generar un token único
            $token = Str::random(20);
 
            //Guarda el token
            $user->reset_password_token = $token;
            $user->save();
 
            //Envío por el email
            $user->notify(new ResetPassword($token, $user->name));
 
            return response()->json(['message' => 'Se envío un email a su correo electrónico']);
 
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage(),
            'message' => 'No se pudo enviar el email de recuperación, intentelo de nuevo'], 501);
        }
    }
    public function getFirstLoginDate(Request $request)
    {
        $userId = $request->query('user_id');
    
        if (!$userId) {
            return response()->json(['error' => 'User ID not provided'], 400);
        }
    
        // Obtener el usuario por ID
        $user = User::find($userId);
    
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
    
        // Verificar si el usuario tiene first_login_at definido
        $hasFirstLogin = !is_null($user->first_login_at);
    
        return response()->json(['has_first_login' => $hasFirstLogin]);
    }

}
