<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Devise de la boutique
    |--------------------------------------------------------------------------
    |
    | Tous les montants stockés (produits, variantes, promotions, commandes)
    | sont exprimés dans cette devise. Le XOF (franc CFA) n'a pas de
    | subdivision : les montants sont arrondis à l'unité.
    |
    */

    'currency' => 'XOF',

    'currency_decimals' => 0,

    /*
    |--------------------------------------------------------------------------
    | Livraison
    |--------------------------------------------------------------------------
    */

    'shipping_amount' => (int) env('SHOP_SHIPPING_AMOUNT', 4000),

    'free_shipping_threshold' => (int) env('SHOP_FREE_SHIPPING_THRESHOLD', 65000),

];
