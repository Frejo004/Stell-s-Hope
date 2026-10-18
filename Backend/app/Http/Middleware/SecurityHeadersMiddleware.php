<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeadersMiddleware
{
    /**
     * Injecte les en-têtes de sécurité HTTP recommandés par l'OWASP.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Protection contre le reniflage de type MIME
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // Protection contre le Clickjacking (interdire l'intégration dans des iframes externes)
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');

        // Filtre anti-XSS pour les anciens navigateurs
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // Politique de référent sécurisée
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Désactivation des API matérielles superflues
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

        return $response;
    }
}
