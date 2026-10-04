# Corrections Stell's Hope

Date: 2026-10-04

## Contraintes Git

- Branche `fix/stabilisation`: reportee. La creation de branche a ete refusee par l'environnement apres demande d'autorisation.
- Commits par sous-etape: reportes pour la meme raison, l'ecriture dans `.git` n'etait pas autorisee.

## Phase 1 - Checkout fonctionnel

- Fait: `total` est le nom canonique. Ajout de la migration `2026_10_04_000001_normalize_order_totals_and_snapshots.php`, qui renomme `total_amount` en `total` si necessaire et ajoute les snapshots `subtotal`, `shipping_amount`, `discount_amount`, `promotion_code`, `currency`, `unit_price`, `line_total`.
- Fait: `OrderController::store` recalcule les montants cote serveur. Les prix envoyes par le navigateur ne sont plus utilises.
- Fait: application serveur de la livraison gratuite des 100 et livraison a 5.99 sinon.
- Fait: application serveur des promotions actives depuis la table `promotions`.
- Fait: creation de commande transactionnelle avec `lockForUpdate`, verification produit actif, verification stock et decrement de `stock_quantity`.
- Fait: restitution du stock a l'annulation de commande et en cas de webhook de paiement echoue/cancelled.
- Fait: `PaymentService` continue de facturer `order->total`, donc le montant facture est celui calcule serveur.
- Fait: `CheckoutPage.tsx` n'envoie plus de prix article ni de montant de paiement comme source d'autorite, et affiche le total serveur des que la commande est creee.
- Fait: tests ajoutes pour creation de commande, total avec livraison/promotion, stock insuffisant, seconde commande sur stock reserve et restitution du stock.
- Note: le test de concurrence est une approximation adaptee a SQLite; les verrous reels sont poses dans le code pour PostgreSQL.

## Phase 2 - Securite

- 01 Fait cote frontend: Axios a deja un timeout explicite de 15000 ms. Reporte cote Moneroo: l'integration passe par la facade du SDK et non par `Http::timeout()`.
- 02 Non applicable: recherche code effectuee, aucune fonctionnalite IA applicative trouvee.
- 03 Non applicable: aucune fonctionnalite IA applicative trouvee.
- 04 Non applicable: aucun agent IA applicatif trouve.
- 05 Reporte: le token Sanctum reste en `localStorage`; migration vers cookie HttpOnly/SameSite non traitee dans ce lot.
- 06 Reporte: validation stricte des URLs de redirection paiement non traitee.
- 07 Non applicable: aucune configuration WebSocket/broadcasting applicative traitee dans ce lot.
- 08 Reporte: A2F admin non implementee.
- 09 Partiel: reset password utilise un message generique; throttling ajoute sur forgot/reset. Login garde un message generique. L'inscription reste a durcir contre l'enumeration.
- 10 Reporte: webhook encore a durcir sur montant/devise/payment id et transitions d'etat.
- 11 Partiel: bouton checkout deja desactive pendant envoi; idempotence serveur non implementee.
- 12 Reporte: stockage des evenements webhook traites non implemente.
- 13 Reporte: documentation de deploiement a completer.
- 14 Reporte: audit scripts externes/CSP/SRI, `npm audit` et `composer audit` non executes dans ce lot.
- 15 Reporte: lockfiles presents, mais versions avec `^` non nettoyees.
- 16 Partiel: paiement echoue fail closed avec annulation/restock; signature webhook hors production reste a durcir.

Corrections P1 supplementaires:

- Fait: reset password remplace par le flux Laravel `Password::sendResetLink` / `Password::reset`, avec tests.
- Fait: `GET /api/products/debug` supprime des routes et du controleur.
- Fait: throttling ajoute sur forgot/reset, suivi public et webhook.
- Fait: `trackPublic` ne renvoie plus `shipping_address`.
- Reporte: `FileController` reste a restreindre par role/propriete et identifiants de fichiers.
- Reporte: jeton de suivi public non devinable non implemente.

## Phase 3 - Qualite du code

- Partiel: les contrats frontend touches par le checkout ont ete ajustes (`createOrder`, paiement, `total`).
- Reporte: remise a zero globale de `npm run typecheck` et `npm run lint`. Les erreurs restantes sont larges et deja identifiees dans `ANALYSE_GLOBALE.md`.
- Reporte: metriques admin simulees, tri popularite/note, CSS `@import`, lazy loading et README.

## Phase 4 - Design

- Reporte: audit et refonte design non traites dans ce lot.

## Verifications

- `php artisan test`: OK, 13 tests passes, 40 assertions.
- `npm run typecheck`: KO, erreurs TypeScript preexistantes restantes dans admin, hooks, donnees demo, routes et composants.
- `npm run lint`: KO, 143 erreurs et 14 avertissements restants apres ce lot.
- `npm run build`: OK hors sandbox. Le premier essai sandbox a echoue sur un acces refuse esbuild/Vite; relance approuvee reussie.

## Fichiers principaux modifies

- Backend: `OrderController`, `AuthController`, `ProductController`, `PaymentService`, modeles `Order`/`OrderItem`, routes API, migrations, tests.
- Frontend: `CheckoutPage`, `orderService`, `paymentService`, affichages admin/suivi utilisant `total`.
