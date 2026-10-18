<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderStatusUpdated extends Mailable
{
    use Queueable, SerializesModels;

    public $order;

    /**
     * Create a new message instance.
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $statusLabels = [
            'confirmed' => 'confirmée',
            'processing' => 'en cours de préparation',
            'shipped' => 'expédiée',
            'delivered' => 'livrée',
            'cancelled' => 'annulée'
        ];
        $label = $statusLabels[$this->order->status] ?? $this->order->status;
        $orderRef = $this->order->order_number ?? ('#' . $this->order->id);

        return new Envelope(
            subject: "Votre commande {$orderRef} est {$label} - Stell's Hope",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.orders.status_updated',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
