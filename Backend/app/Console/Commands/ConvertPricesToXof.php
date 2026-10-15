<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * Conversion ponctuelle du catalogue saisi en euros vers le XOF.
 *
 * À exécuter une seule fois par base : relancer la commande multiplierait
 * à nouveau les prix. Les commandes existantes ne sont pas modifiées.
 */
class ConvertPricesToXof extends Command
{
    protected $signature = 'shop:convert-prices-to-xof
                            {--rate=655.957 : Taux EUR -> XOF (parité fixe par défaut)}
                            {--round=5 : Arrondi au multiple de N FCFA}
                            {--dry-run : Affiche les changements sans les enregistrer}';

    protected $description = 'Convertit les prix produits, variantes et promotions de EUR vers XOF (une seule fois)';

    public function handle(): int
    {
        $rate = (float) $this->option('rate');
        $round = max(1, (int) $this->option('round'));
        $dryRun = (bool) $this->option('dry-run');

        $convert = fn ($amount) => $amount === null
            ? null
            : (int) (round(((float) $amount * $rate) / $round) * $round);

        $maxPrice = (float) DB::table('products')->max('price');
        $this->info("Prix produit maximum actuel : {$maxPrice}");

        if ($maxPrice > 5000) {
            $this->warn('Des prix supérieurs à 5000 existent : le catalogue semble déjà en XOF.');
        }

        if (!$dryRun && !$this->confirm("Convertir tous les prix avec le taux {$rate} ? Cette opération ne doit être lancée qu'une fois.")) {
            $this->info('Annulé.');
            return self::SUCCESS;
        }

        $counts = ['products' => 0, 'product_variants' => 0, 'promotions' => 0];

        DB::transaction(function () use ($convert, $dryRun, &$counts) {
            foreach (['products', 'product_variants'] as $table) {
                DB::table($table)->whereNotNull('price')->orderBy('id')->each(function ($row) use ($table, $convert, $dryRun, &$counts) {
                    if (!$dryRun) {
                        DB::table($table)->where('id', $row->id)->update(['price' => $convert($row->price)]);
                    }
                    $counts[$table]++;
                });
            }

            DB::table('promotions')->orderBy('id')->each(function ($promotion) use ($convert, $dryRun, &$counts) {
                $changes = ['min_amount' => $convert($promotion->min_amount)];

                // Une remise en pourcentage reste un pourcentage
                if ($promotion->type === 'fixed') {
                    $changes['value'] = $convert($promotion->value);
                }

                if (!$dryRun) {
                    DB::table('promotions')->where('id', $promotion->id)->update($changes);
                }
                $counts['promotions']++;
            });
        });

        $prefix = $dryRun ? '[dry-run] ' : '';
        foreach ($counts as $table => $count) {
            $this->line("{$prefix}{$table} : {$count} ligne(s)");
        }

        return self::SUCCESS;
    }
}
