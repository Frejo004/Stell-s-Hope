<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || !$request->user()->is_admin || !$request->user()->is_active) {
            return response()->json(['message' => 'Accès réservé aux administrateurs actifs.'], 403);
        }

        return $next($request);
    }
}