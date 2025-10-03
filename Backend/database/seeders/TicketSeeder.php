<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ticket;
use App\Models\User;

class TicketSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('is_admin', false)->get();
        
        $tickets = [
            ['Problème de livraison', 'Ma commande n\'est pas arrivée dans les délais prévus.', 'high'],
            ['Question sur un produit', 'Pouvez-vous me donner plus d\'informations sur ce produit ?', 'medium'],
            ['Remboursement', 'Je souhaite être remboursé pour ma dernière commande.', 'high'],
            ['Échange de taille', 'La taille ne me convient pas, puis-je échanger ?', 'medium'],
            ['Problème de paiement', 'Ma carte a été débitée mais je n\'ai pas reçu de confirmation.', 'high'],
            ['Suggestion d\'amélioration', 'Voici quelques suggestions pour améliorer le site.', 'low'],
            ['Bug sur le site', 'Je rencontre un problème technique sur votre site.', 'medium'],
            ['Demande de facture', 'Pouvez-vous m\'envoyer une facture pour ma commande ?', 'low'],
        ];

        $statuses = ['open', 'in_progress', 'resolved', 'closed'];

        foreach ($users->take(20) as $user) {
            $ticketCount = rand(0, 3);
            
            for ($i = 0; $i < $ticketCount; $i++) {
                $ticketData = $tickets[array_rand($tickets)];
                
                Ticket::create([
                    'user_id' => $user->id,
                    'subject' => $ticketData[0],
                    'message' => $ticketData[1],
                    'priority' => $ticketData[2],
                    'status' => $statuses[array_rand($statuses)],
                    'admin_response' => rand(0, 1) ? 'Merci pour votre message. Nous traitons votre demande.' : null,
                ]);
            }
        }
    }
}