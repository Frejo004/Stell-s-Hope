<?php

namespace Database\Seeders;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Seeder;

class TicketSeeder extends Seeder
{
    /**
     * Exécute les graines de la base de données.
     */
    public function run(): void
    {
        // Le commentaire initial est pertinent. L'utilisation de factories Laravel
        // est en effet la méthode la plus idiomatique et maintenable.
        // Exemple : User::factory()->count(20)->has(Ticket::factory()->count(rand(0, 3)))->create();
        // Pour l'instant, le code actuel reste fonctionnel.

        // Utiliser `query()` est une bonne pratique pour démarrer une requête.
        $users = User::query()->where('is_admin', false)->inRandomOrder()->take(20)->get();

        // Les données statiques peuvent être définies comme des constantes de classe
        // pour une meilleure organisation.
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
            // Utiliser `fake()->numberBetween()` est plus moderne si vous utilisez Laravel 9+
            $ticketCount = random_int(0, 3);

            for ($i = 0; $i < $ticketCount; $i++) {
                $ticketData = $ticketSamples[array_rand($ticketSamples)];

                // L'utilisation de `create` est parfaite ici.
                Ticket::create(array_merge($ticketData, [
                    'user_id' => $user->id,
                    'status' => $statuses[array_rand($statuses)],
                    'admin_response' => (random_int(0, 1) === 1) ? 'Merci pour votre message. Nous traitons votre demande.' : null,
                ]));
            }
        }
    }
}