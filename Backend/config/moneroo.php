<?php

return [
    'publicKey' => env('MONEROO_PUBLIC_KEY'),
    'secretKey' => env('MONEROO_SECRET_KEY'),
    // Secret de signature défini sur le webhook dans le dashboard Moneroo (différent de la clé API)
    'webhookSecret' => env('MONEROO_WEBHOOK_SECRET'),
    'baseUrl' => env('MONEROO_BASE_URL', 'https://api.moneroo.io'),
    'devMode' => env('MONEROO_DEV_MODE', false),
    'devBaseUrl' => env('MONEROO_DEV_BASE_URL', 'https://sandbox.moneroo.io'),
];
