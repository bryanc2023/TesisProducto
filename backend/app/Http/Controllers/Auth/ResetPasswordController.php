<?php

namespace App\Http\Controllers\Auth;

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str; 
use Illuminate\Validation\ValidationException;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset; 

class ResetPasswordController extends Controller
{
    public function resetPassword(Request $request)
    {
        try {
            $token = $request->input('token');
            $newPassword = $request->input('password');
            $user = user::where('reset_password_token', $token)->first();
 

            // Verificar si el usuario existe
            if (!$user) {
                return response()->json(['message' => 'Token no válido o usuario no encontrado'], 404);
            }
            
            if(!$newPassword) {
                return response()->json(['message' => 'No se proporciono una contraseña'], 404);
            }
 
            $passHash = Hash::make($newPassword);
            $user->reset_password_token = null; //Reestablecemos el valor del token
            $user->password = $passHash;
            $user->save();

            
           
            return response()->json(['message' => 'Se cambio la contraseña', 'data' => $user], 201);
            
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage(),
                'message' => 'Se produjo un error inesperado al restablecer la contraseña. Por favor, inténtalo de nuevo más tarde.'], 501);
        }
    }
}
