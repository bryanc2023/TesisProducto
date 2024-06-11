<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Contracts\Auth\MustVerifyEmail;
class EnsureEmailIsVerified
{
    /**
     * Handle an incoming request.
     *
   *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if ($request->user() instanceof MustVerifyEmail && !$request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Please verify your email first'], 403);
        }

        return $next($request);
    }
}
