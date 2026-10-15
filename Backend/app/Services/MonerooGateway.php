<?php

namespace App\Services;

use Moneroo\Laravel\Facades\PaymentFacade as Moneroo;

/**
 * Point d'accès unique à l'API de paiement Moneroo.
 * La classe du SDK étant `final`, ce wrapper permet aussi de la simuler en test.
 */
class MonerooGateway
{
    /**
     * @return object {id, checkout_url}
     */
    public function init(array $payload): object
    {
        return Moneroo::init($payload);
    }

    /**
     * @return object {id, status, amount, currency: {code}, metadata, ...}
     */
    public function verify(string $paymentId): object
    {
        return Moneroo::verify($paymentId);
    }
}
