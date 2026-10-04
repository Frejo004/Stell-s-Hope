# Analyse globale du projet Stell's Hope

Date de l'analyse : 4 octobre 2026

## 1. Synthèse exécutive

Stell's Hope est une boutique de mode en ligne composée d'un frontend React/TypeScript et d'une API Laravel. Le périmètre fonctionnel est large : catalogue, comptes clients, panier, commandes, paiement Moneroo, suivi, avis, favoris, support et interface d'administration.

La base technique est identifiable et plusieurs parcours sont déjà câblés, mais le projet n'est pas prêt pour une mise en production en l'état. Le principal blocage vérifié touche le parcours de commande : le schéma créé par les migrations ne contient pas le champ de montant utilisé par le modèle et l'API, et le test de création de commande échoue en conséquence. Le frontend compile en bundle de production, mais son contrôle TypeScript échoue et son lint compte 146 erreurs. Des opérations essentielles au commerce réel restent simulées ou incomplètes, notamment la réinitialisation du mot de passe, les promotions au checkout, la livraison et plusieurs métriques du tableau de bord.

**Verdict :** prototype avancé / MVP en cours. L'interface et le périmètre métier sont prometteurs; les flux de commande, de données et de sécurité doivent être fiabilisés avant toute exploitation avec de vrais clients.

## 2. Périmètre observé

- `Frontend/` : application React 18, TypeScript, Vite, React Router, Axios, Tailwind CSS et Lucide.
- `backend/` : API Laravel 12, PHP 8.2+, Eloquent, Laravel Sanctum et intégration Moneroo.
- Base visée par la documentation : PostgreSQL; les tests utilisent SQLite.
- Données métier : utilisateurs, catégories, produits, variantes et attributs, paniers, commandes et articles, avis, listes de souhaits, promotions et tickets de support.
- Les seules documentations Markdown repérées sont le README backend; la configuration et les contrats d'API sont donc peu documentés au niveau du dépôt.

## 3. Architecture et parcours

### Frontend

`Frontend/src/routes/AppRouter.tsx` centralise les routes publiques, les pages de compte/commande et l'accès à l'espace admin. Les pages sont en partie chargées en lazy loading. Les services (`productService`, `authService`, `cartService`, `orderService`, etc.) regroupent les appels HTTP et utilisent une instance Axios commune (`Frontend/src/services/api.ts`). Les contextes gèrent notamment l'authentification, le panier, les favoris et les notifications.

### Backend

`backend/routes/api.php` regroupe les routes publiques, les routes authentifiées sous Sanctum et les routes d'administration protégées par le middleware `admin`. Les contrôleurs API portent les opérations catalogue, compte, panier, commande et support; les contrôleurs Admin couvrent les opérations de gestion. `PaymentService` isole l'intégration Moneroo et le traitement des webhooks.

### Parcours commercial attendu

1. Le visiteur découvre et filtre le catalogue.
2. Le client se connecte, gère son panier et renseigne ses adresses.
3. L'API crée la commande et ses articles.
4. Moneroo est sollicité; le webhook met à jour le paiement et confirme la commande.
5. Le client retrouve la commande et son suivi; l'équipe admin gère le catalogue, les stocks, les commandes et le support.

Ce parcours est présent dans le code, mais certaines transitions ne sont pas encore cohérentes de bout en bout; voir les constats prioritaires.

## 4. Points solides

- Séparation lisible entre frontend et API backend; usage d'outils établis dans les deux écosystèmes.
- L'API sépare les opérations publiques, client et admin; Sanctum et le middleware admin fournissent une base de contrôle d'accès côté serveur.
- Validation des entrées dans plusieurs contrôleurs et usage de transactions pour la création de commande et la gestion de variantes.
- Le prix des produits de la commande est relu depuis la base plutôt que de faire confiance au prix transmis par le navigateur.
- L'interface couvre déjà de nombreux besoins d'une boutique réelle, dont le suivi de commande public, le support et un panneau admin étendu.
- Le build Vite produit un bundle de production.

## 5. Constats prioritaires

### P0 — Corriger avant de considérer le checkout comme opérationnel

**Montant de commande incompatible avec le schéma.** La migration initiale crée `orders.total_amount`; la migration de renommage `2025_12_29_214034_rename_total_amount_to_total_in_orders_table.php` ne fait aucun changement; le modèle `Order` et `OrderController` écrivent/lisent `total`. Le test `OrderTest` échoue actuellement avec `table orders has no column named total`. Cela bloque la création d'une commande sur une base créée à partir de ces migrations.

**Prix affiché et montant facturé différents.** `Frontend/src/pages/CheckoutPage.tsx` calcule livraison et remise côté navigateur, mais n'envoie pas ces valeurs comme données métier faisant autorité. `backend/app/Http/Controllers/Api/OrderController.php` calcule le total uniquement comme somme des prix produits multipliés par les quantités; `PaymentService` facture ensuite `order->total`. Le total affiché peut donc diverger du total de commande/paiement.

**Stock non sécurisé à la création de commande.** Le panier contrôle le stock à l'ajout et à la mise à jour, mais `OrderController::store` accepte des articles envoyés par le client sans revalider l'état actif ni le stock et ne réserve/décrémente pas le stock dans la transaction. Plusieurs commandes simultanées peuvent dépasser le stock disponible.

### P1 — Sécurité et flux client

**Réinitialisation du mot de passe inopérante.** `AuthController::forgotPassword` et `resetPassword` valident les champs puis renvoient un message de succès; aucun jeton n'est émis, vérifié ou utilisé pour modifier le mot de passe. Les pages du frontend peuvent donc présenter un parcours qui ne réalise pas l'opération.

**Suppression de fichiers sans contrôle de propriété.** Les routes de gestion de fichiers sont sous le groupe authentifié général, pas dans le groupe admin. `FileController::delete` reçoit un chemin arbitraire et supprime l'objet correspondant sur le disque public sans vérifier que l'utilisateur possède ce fichier. Un compte client ne devrait pas pouvoir supprimer des ressources partagées ou celles d'un autre utilisateur.

**Données personnelles dans le suivi public.** `OrderController::trackPublic` demande numéro de commande et email, puis renvoie notamment l'adresse de livraison. Le endpoint n'a pas de limitation de débit visible dans sa déclaration de route. Réduire les données renvoyées, appliquer une limitation et envisager un jeton de suivi non devinable.

**Vérification du webhook à durcir.** En production, l'absence de signature est refusée, ce qui est une bonne base. Le traitement devrait aussi vérifier que l'identifiant de paiement reçu correspond à celui enregistré et que montant/devise correspondent à la commande, et être testé avec les règles exactes de signature du prestataire. En dehors de la production, l'absence de signature est acceptée : ce mode doit rester strictement non exposé.

**Endpoint de diagnostic exposé.** `GET /api/products/debug` est public et renvoie des données brutes et transformées du premier produit. Il devrait être retiré ou protégé et désactivé hors développement.

### P1 — Qualité et cohérence technique

**Le contrôle TypeScript échoue.** Parmi les erreurs constatées : données de démonstration incompatibles avec les types de produits, identifiants `string`/`number` mélangés, méthode `showToast` absente du contexte, types de commandes discordants et props de composants incorrectes. Le contrôle strict n'est donc pas actuellement un garde-fou fiable.

**Le lint échoue largement.** `npm run lint` retourne 146 erreurs et 14 avertissements, notamment `any`, variables/imports inutilisés et dépendances de hooks. Il faut traiter cela par lots ciblés, pas masquer globalement les règles.

**Contrats API/frontend à formaliser.** Certains services annoncent une forme de retour différente de la réponse enveloppée par l'API; le typechecking relève déjà des divergences de modèle. Définir des DTO cohérents et tester quelques parcours API complets réduirait les régressions.

### P2 — Fiabilité métier et exploitation

- Plusieurs indicateurs du dashboard sont explicitement simulés (`rand()` pour visiteurs/paniers); les « meilleures ventes » sont ordonnées par date de création et les catégories sont présentées comme des ventes à partir du nombre de produits. Les décisions métier ne doivent pas se baser sur ces chiffres.
- Le tri catalogue pour popularité et note retombe lui aussi sur la date de création; l'endpoint bestsellers est récent, pas réellement calculé sur les ventes.
- Le README backend ne décrit qu'un petit sous-ensemble de l'API réelle et donne des instructions d'installation incomplètes pour le frontend, les paiements et les parcours admin.
- Le build signale un `@import` CSS placé après d'autres règles et des imports statiques qui neutralisent le découpage lazy de quelques pages, ainsi que des données Browserslist obsolètes.
- L'authentification stocke le bearer token dans `localStorage`; cela expose le token à un éventuel XSS. À évaluer selon le modèle de menace et l'architecture de déploiement.

## 6. Résultats des vérifications

Vérifications exécutées le 4 octobre 2026, sans modifier le code applicatif :

| Vérification | Résultat |
|---|---|
| Tests backend ciblés (commande, favoris, exemples) | 6 réussis, 1 échoué; échec de création de commande lié à `orders.total` absent |
| `npm run typecheck` | Échec sur des erreurs de types et de contrat dans plusieurs modules |
| `npm run lint` | Échec : 146 erreurs et 14 avertissements |
| `npm run build` | Réussi; avertissements CSS, découpage des chunks et données Browserslist |

Les tests exécutés ne constituent pas une couverture complète du backend; aucun test de paiement/webhook n'a été repéré dans la sélection examinée. Le build réussi signifie que Vite sait empaqueter l'application, pas que le checkout est correct à l'exécution.

## 7. Feuille de route recommandée

### Étape 1 — Rendre le socle exécutable

1. Choisir un nom canonique pour le champ total, corriger une migration de mise à niveau compatible avec les bases existantes, puis reconstruire la base de test et faire passer le test de commande.
2. Ajouter des tests de contrat pour création de commande, calcul du montant, panier et paiement.
3. Recalculer côté serveur le sous-total, la livraison, les remises, taxes éventuelles et total; rejeter toute transition invalide et enregistrer un instantané des prix.
4. Réserver/décrémenter le stock de manière transactionnelle avec verrouillage adapté; définir le remboursement de stock lors d'une annulation.

### Étape 2 — Fermer les lacunes fonctionnelles et de sécurité

1. Implémenter le flux Laravel standard de réinitialisation de mot de passe et le tester.
2. Restreindre upload/suppression de fichiers par rôle et propriétaire; éviter les chemins arbitraires fournis par le client.
3. Minimiser les informations du suivi public, limiter les tentatives et durcir les validations du webhook.
4. Retirer les endpoints de debug et s'assurer que les routes admin restent protégées côté serveur.

### Étape 3 — Rétablir les garde-fous et la confiance métier

1. Stabiliser les contrats TypeScript/API, puis rétablir `typecheck` sans erreurs.
2. Réduire progressivement les erreurs ESLint, en commençant par les modules touchés par le checkout et les comptes.
3. Remplacer les données analytiques simulées par des agrégats documentés et testés.
4. Compléter le README avec installation complète, variables requises, migrations, seeders, tests et procédure de déploiement; ne jamais documenter de vrais secrets.

## 8. Conclusion

Le projet possède déjà un périmètre produit crédible et une architecture de départ exploitable. Le travail prioritaire n'est pas d'ajouter encore des écrans : il s'agit d'aligner schéma, API et frontend autour des flux de commande, de paiement, de stock et de compte, puis de remettre les contrôles automatisés au vert. Une fois ces points traités, les fonctionnalités admin et l'expérience de boutique pourront être évaluées et enrichies sur une base beaucoup plus fiable.