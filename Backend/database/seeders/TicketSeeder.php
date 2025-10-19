<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ticket;
use App\Models\User;

class TicketSeeder extends Seeder
{
    public function run(): void
    {
        // Il serait plus idiomatique d'utiliser une Factory pour ce genre de logique.
        // Exemple : User::factory()->count(20)->has(Ticket::factory()->count(rand(0, 3)))->create();
        // Cependant, le code actuel est fonctionnel et clair.

        $users = User::where('is_admin', false)->inRandomOrder()->take(20)->get();

        $ticketSamples = [
            ['subject' => 'Problème de livraison', 'message' => 'Ma commande n\'est pas arrivée dans les délais prévus.', 'priority' => 'high'],
            ['subject' => 'Question sur un produit', 'message' => 'Pouvez-vous me donner plus d\'informations sur ce produit ?', 'priority' => 'medium'],
            ['subject' => 'Remboursement', 'message' => 'Je souhaite être remboursé pour ma dernière commande.', 'priority' => 'high'],
            ['subject' => 'Échange de taille', 'message' => 'La taille ne me convient pas, puis-je échanger ?', 'priority' => 'medium'],
            ['subject' => 'Problème de paiement', 'message' => 'Ma carte a été débitée mais je n\'ai pas reçu de confirmation.', 'priority' => 'high'],
            ['subject' => 'Suggestion d\'amélioration', 'message' => 'Voici quelques suggestions pour améliorer le site.', 'priority' => 'low'],
            ['subject' => 'Bug sur le site', 'message' => 'Je rencontre un problème technique sur votre site.', 'priority' => 'medium'],
            ['subject' => 'Demande de facture', 'message' => 'Pouvez-vous m\'envoyer une facture pour ma commande ?', 'priority' => 'low'],
        ];

        $statuses = ['open', 'in_progress', 'resolved', 'closed'];

        foreach ($users as $user) {
            $ticketCount = random_int(0, 3);

            for ($i = 0; $i < $ticketCount; $i++) {
                $ticketData = $ticketSamples[array_rand($ticketSamples)];

                Ticket::create(array_merge($ticketData, [
                    'user_id' => $user->id,
                    'status' => $statuses[array_rand($statuses)],
                    'admin_response' => random_int(0, 1) ? 'Merci pour votre message. Nous traitons votre demande.' : null,
                ]));
            }
        }
    }
    }
}