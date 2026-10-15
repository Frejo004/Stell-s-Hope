<?php

namespace App\Exceptions;

use RuntimeException;
use Throwable;

/**
 * Erreur de paiement dont le message peut être renvoyé tel quel au client
 * (aucun détail interne) avec le code HTTP associé.
 */
class PaymentException extends RuntimeException
{
    public function __construct(string $message, public readonly int $status = 400, ?Throwable $previous = null)
    {
        parent::__construct($message, 0, $previous);
    }
}
