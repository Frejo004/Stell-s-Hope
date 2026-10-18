<!DOCTYPE html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation de commande - Stell's Hope</title>
    <!--[if mso]>
    <style type="text/css">
        body, table, td { font-family: Arial, Helvetica, sans-serif !important; }
    </style>
    <![endif]-->
    <style type="text/css">
        body {
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            background-color: #FAF9F6;
            color: #1C1917;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
        table {
            border-spacing: 0;
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        td {
            padding: 0;
        }
        img {
            border: 0;
            -ms-interpolation-mode: bicubic;
            max-width: 100%;
        }
        .wrapper {
            width: 100%;
            table-layout: fixed;
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
            margin: 0 0 28px 0;
        }
        .order-badge {
            background-color: #FAF9F6;
            border: 1px solid #E7E5E4;
            border-radius: 12px;
            padding: 16px 20px;
            margin-bottom: 28px;
        }
        .order-badge-title {
            font-size: 11px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            color: #78716C;
            margin-bottom: 4px;
        }
        .order-badge-number {
            font-size: 18px;
            font-weight: 700;
            color: #1C1917;
            font-family: 'Georgia', serif;
        }
        .section-title {
            font-size: 12px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            font-weight: 600;
            color: #1C1917;
            padding-bottom: 8px;
            border-bottom: 1px solid #E7E5E4;
            margin-bottom: 16px;
        }
        .item-row {
            border-bottom: 1px solid #F5F5F4;
            padding: 12px 0;
        }
        .item-name {
            font-size: 14px;
            font-weight: 600;
            color: #1C1917;
        }
        .item-meta {
            font-size: 12px;
            color: #78716C;
            margin-top: 2px;
        }
        .item-price {
            font-size: 14px;
            font-weight: 600;
            color: #1C1917;
            text-align: right;
        }
        .totals-table {
            width: 100%;
            margin-top: 20px;
            padding-top: 16px;
            border-top: 1px solid #E7E5E4;
        }
        .totals-row td {
            padding: 6px 0;
            font-size: 13px;
            color: #57534E;
        }
        .total-final td {
            padding-top: 12px;
            font-size: 16px;
            font-weight: 700;
            color: #1C1917;
            border-top: 1px dashed #E7E5E4;
        }
        .address-box {
            background-color: #FAF9F6;
            border: 1px solid #E7E5E4;
            border-radius: 10px;
            padding: 16px;
            font-size: 13px;
            line-height: 1.5;
            color: #57534E;
        }
        .cta-container {
            text-align: center;
            padding: 32px 0 16px 0;
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
        .footer a {
            color: #78716C;
            text-decoration: underline;
        }
    </style>
</head>
<body>
    @php
        $shipping = is_array($order->shipping_address) ? $order->shipping_address : (json_decode($order->shipping_address, true) ?? []);
        $clientName = trim(($shipping['first_name'] ?? '') . ' ' . ($shipping['last_name'] ?? '')) ?: ($order->user ? $order->user->first_name : 'Cher Client');
        $currency = $order->currency ?? 'FCFA';
        $orderNum = $order->order_number ?? ('#' . $order->id);
    @endphp

    <div class="wrapper">
        <div class="main-container">
            <!-- Header Haute Couture -->
            <div class="header">
                <h1 class="brand-title">STELL'S HOPE</h1>
                <div class="brand-subtitle">Haute Couture & Prêt-à-Porter d'Exception</div>
            </div>

            <!-- Content -->
            <div class="content">
                <p class="greeting">Bonjour {{ $clientName }},</p>
                <p class="intro-text">
                    Nous avons le plaisir de vous confirmer la prise en compte de votre commande. Nos artisans et préparateurs veillent d'ores et déjà avec le plus grand soin à la confection et à la préparation de vos créations.
                </p>

                <!-- Badge Commande -->
                <div class="order-badge">
                    <table width="100%">
                        <tr>
                            <td>
                                <div class="order-badge-title">Référence de commande</div>
                                <div class="order-badge-number">{{ $orderNum }}</div>
                            </td>
                            <td style="text-align: right;">
                                <div class="order-badge-title">Date</div>
                                <div style="font-size: 13px; font-weight: 500; color: #1C1917;">
                                    {{ $order->created_at ? $order->created_at->format('d/m/Y à H:i') : date('d/m/Y') }}
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- Articles commandés -->
                <div class="section-title">Pièces commandées</div>
                <table width="100%" style="margin-bottom: 20px;">
                    @foreach($order->items ?? $order->orderItems ?? [] as $item)
                    <tr class="item-row">
                        <td style="padding: 10px 0;">
                            <div class="item-name">{{ $item->product->name ?? 'Création Stell\'s Hope' }}</div>
                            <div class="item-meta">
                                Quantité : {{ $item->quantity }}
                                @if(!empty($item->size)) &bull; Taille : {{ $item->size }} @endif
                                @if(!empty($item->color)) &bull; Coloris : {{ $item->color }} @endif
                            </div>
                        </td>
                        <td class="item-price" style="vertical-align: top; padding-top: 10px;">
                            {{ number_format($item->price * $item->quantity, 0, ',', ' ') }} {{ $currency }}
                        </td>
                    </tr>
                    @endforeach
                </table>

                <!-- Récapitulatif financier -->
                <table class="totals-table">
                    @if(isset($order->subtotal) && $order->subtotal > 0)
                    <tr class="totals-row">
                        <td>Sous-total</td>
                        <td style="text-align: right;">{{ number_format($order->subtotal, 0, ',', ' ') }} {{ $currency }}</td>
                    </tr>
                    @endif

                    @if(isset($order->discount_amount) && $order->discount_amount > 0)
                    <tr class="totals-row" style="color: #059669;">
                        <td>Privilège / Remise {{ $order->promotion_code ? '(' . $order->promotion_code . ')' : '' }}</td>
                        <td style="text-align: right;">-{{ number_format($order->discount_amount, 0, ',', ' ') }} {{ $currency }}</td>
                    </tr>
                    @endif

                    @if(isset($order->shipping_amount))
                    <tr class="totals-row">
                        <td>Frais de livraison soignée</td>
                        <td style="text-align: right;">
                            {{ $order->shipping_amount > 0 ? number_format($order->shipping_amount, 0, ',', ' ') . ' ' . $currency : 'Offerte' }}
                        </td>
                    </tr>
                    @endif

                    <tr class="total-final">
                        <td>Montant Total</td>
                        <td style="text-align: right; color: #1C1917;">
                            {{ number_format($order->total, 0, ',', ' ') }} {{ $currency }}
                        </td>
                    </tr>
                </table>

                <!-- Adresse de livraison -->
                @if(!empty($shipping))
                <div style="margin-top: 30px;">
                    <div class="section-title">Adresse de livraison</div>
                    <div class="address-box">
                        <strong>{{ $clientName }}</strong><br>
                        {{ $shipping['street'] ?? $shipping['address'] ?? '' }}<br>
                        {{ $shipping['postal_code'] ?? '' }} {{ $shipping['city'] ?? '' }}<br>
                        {{ $shipping['country'] ?? 'Côte d\'Ivoire' }}<br>
                        @if(!empty($shipping['phone']))
                        <span style="color: #78716C;">Tél : {{ $shipping['phone'] }}</span>
                        @endif
                    </div>
                </div>
                @endif

                <!-- CTA -->
                <div class="cta-container">
                    <a href="{{ config('app.frontend_url', 'http://localhost:5173') }}/track?number={{ urlencode($orderNum) }}" class="cta-button">
                        Suivre ma commande en direct
                    </a>
                </div>
            </div>

            <!-- Footer -->
            <div class="footer">
                <p style="margin: 0 0 8px 0;">
                    Une question sur votre commande ou besoin d'assistance ? Répondez simplement à cet email ou contactez notre service conciergerie à <a href="mailto:contact@stellshope.com">contact@stellshope.com</a>.
                </p>
                <p style="margin: 0; color: #D6D3D1;">
                    &copy; {{ date('Y') }} Maison Stell's Hope. Tous droits réservés. L'excellence au service de l'élégance.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
