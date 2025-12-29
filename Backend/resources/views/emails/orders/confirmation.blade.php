<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #000; color: #fff; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .order-details { margin-top: 20px; border-top: 1px solid #ddd; padding-top: 20px; }
        .item { padding: 10px 0; border-bottom: 1px solid #eee; }
        .total { font-weight: bold; font-size: 1.2em; text-align: right; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; font-size: 0.8em; color: #777; }
        .button { display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Confirmation de Commande</h1>
        </div>
        <div class="content">
            <p>Bonjour {{ $order->shipping_address->first_name ?? 'Client' }},</p>
            <p>Merci pour votre commande ! Nous l'avons bien reçue et elle est en cours de traitement.</p>
            
            <div class="order-details">
                <h3>Détails de la commande #{{ $order->id }}</h3>
                <p>Date : {{ $order->created_at->format('d/m/Y H:i') }}</p>
                
                @foreach($order->items as $item)
                <div class="item">
                    {{ $item->product->name }} x {{ $item->quantity }}
                    <span style="float: right;">{{ number_format($item->price * $item->quantity, 2) }} €</span>
                </div>
                @endforeach
                
                <div class="total">
                    Total : {{ number_format($order->total, 2) }} €
                </div>
            </div>

            <div style="text-align: center;">
                <a href="{{ config('app.frontend_url', 'http://localhost:5173') }}/account" class="button">Voir ma commande</a>
            </div>
        </div>
        <div class="footer">
            <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
            <p>&copy; {{ date('Y') }} Stell's Hope. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>
