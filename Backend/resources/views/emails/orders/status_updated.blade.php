<!DOCTYPE html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mise à jour de votre commande - Stell's Hope</title>
    <style type="text/css">
        body {
            margin: 0;
            padding: 0;
            background-color: #FAF9F6;
            color: #1C1917;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
        table {
            border-spacing: 0;
            border-collapse: collapse;
        }
        .wrapper {
            width: 100%;
            background-color: #FAF9F6;
            padding: 40px 10px;
        }
        .main-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #FFFFFF;
            border: 1px solid #E7E5E4;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }
        .header {
            background-color: #141210;
            color: #FFFFFF;
            padding: 36px 30px;
            text-align: center;
        }
        .brand-title {
            font-size: 24px;
            letter-spacing: 4px;
            text-transform: uppercase;
            font-weight: 300;
            margin: 0;
            color: #FFFFFF;
            font-family: 'Georgia', serif;
        }
        .brand-subtitle {
            font-size: 10px;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: #C28265;
            margin-top: 6px;
            font-weight: 500;
        }
        .content {
            padding: 36px 32px;
        }
        .greeting {
            font-size: 18px;
            color: #1C1917;
            font-weight: 600;
            margin: 0 0 12px 0;
        }
        .intro-text {
            font-size: 14px;
            line-height: 1.6;
            color: #57534E;
            margin: 0 0 24px 0;
        }
        .status-card {
            background-color: #FAF9F6;
            border: 1px solid #E7E5E4;
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            margin-bottom: 28px;
        }
        .status-title {
            font-size: 11px;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #78716C;
            margin-bottom: 8px;
        }
        .status-badge {
            display: inline-block;
            font-size: 16px;
            font-weight: 700;
            padding: 8px 20px;
            border-radius: 50px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .status-shipped { background-color: #E0F2FE; color: #0369A1; }
        .status-delivered { background-color: #DCFCE7; color: #15803D; }
        .status-processing { background-color: #FEF3C7; color: #B45309; }
        .status-confirmed { background-color: #F5F5F4; color: #1C1917; }
        .status-cancelled { background-color: #FFE4E6; color: #BE123C; }
        .cta-container {
            text-align: center;
            padding: 24px 0 16px 0;
        }
        .cta-button {
            display: inline-block;
            background-color: #141210;
            color: #FFFFFF !important;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 50px;
            font-size: 12px;
            letter-spacing: 2px;
            text-transform: uppercase;
            font-weight: 600;
        }
        .footer {
            background-color: #FAF9F6;
            border-top: 1px solid #E7E5E4;
            padding: 28px 24px;
            text-align: center;
            font-size: 11px;
            line-height: 1.6;
            color: #A8A29E;
        }
    </style>
</head>
<body>
    @php
        $shipping = is_array($order->shipping_address) ? $order->shipping_address : (json_decode($order->shipping_address, true) ?? []);
        $clientName = trim(($shipping['first_name'] ?? '') . ' ' . ($shipping['last_name'] ?? '')) ?: ($order->user ? $order->user->first_name : 'Cher Client');
        $orderNum = $order->order_number ?? ('#' . $order->id);
        
        $statusLabels = [
            'confirmed' => 'Confirmée',
            'processing' => 'En cours de préparation',
            'shipped' => 'Expédiée',
            'delivered' => 'Livrée',
            'cancelled' => 'Annulée'
        ];
        $statusClasses = [
            'confirmed' => 'status-confirmed',
            'processing' => 'status-processing',
            'shipped' => 'status-shipped',
            'delivered' => 'status-delivered',
            'cancelled' => 'status-cancelled'
        ];
        $currentLabel = $statusLabels[$order->status] ?? ucfirst($order->status);
        $currentClass = $statusClasses[$order->status] ?? 'status-confirmed';
    @endphp

    <div class="wrapper">
        <div class="main-container">
            <div class="header">
                <h1 class="brand-title">STELL'S HOPE</h1>
                <div class="brand-subtitle">Haute Couture & Prêt-à-Porter d'Exception</div>
            </div>

            <div class="content">
                <p class="greeting">Bonjour {{ $clientName }},</p>
                <p class="intro-text">
                    Le statut de votre commande <strong>{{ $orderNum }}</strong> a évolué.
                </p>

                <div class="status-card">
                    <div class="status-title">Nouveau statut</div>
                    <div class="status-badge {{ $currentClass }}">
                        {{ $currentLabel }}
                    </div>
                    @if($order->status === 'shipped')
                    <p style="margin-top: 16px; font-size: 13px; color: #57534E;">
                        Votre colis a été remis à notre transporteur privé. Il est actuellement en chemin vers votre adresse de livraison.
                    </p>
                    @elseif($order->status === 'delivered')
                    <p style="margin-top: 16px; font-size: 13px; color: #57534E;">
                        Votre colis a été remis en mains propres. Nous espérons que votre pièce d'exception vous apportera entière satisfaction.
                    </p>
                    @endif
                </div>

                <div class="cta-container">
                    <a href="{{ config('app.frontend_url', 'http://localhost:5173') }}/track?number={{ urlencode($orderNum) }}" class="cta-button">
                        Consulter les détails du suivi
                    </a>
                </div>
            </div>

            <div class="footer">
                <p style="margin: 0 0 8px 0;">
                    Service conciergerie : <a href="mailto:contact@stellshope.com" style="color: #78716C;">contact@stellshope.com</a>
                </p>
                <p style="margin: 0; color: #D6D3D1;">
                    &copy; {{ date('Y') }} Maison Stell's Hope. Tous droits réservés.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
