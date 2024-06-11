<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Illuminate\Http\Request;
use \Tymon\JWTAuth\Facades\JWTAuth ;

class JwtMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['status' => 'Token is invalid']);
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['status' => 'Token is expired']);
        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            // Esta excepción es lanzada cuando no se proporciona un token
            return response()->json(['status' => 'Authorization Token not found']);
        } catch (Exception $e) {
            return response()->json(['status' => 'An error occurred']);
        }
        return $next($request);
    }
}
