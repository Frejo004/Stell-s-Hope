# 🌱 SEEDERS COMPLETS - BASE DE DONNÉES

## 📊 DONNÉES GÉNÉRÉES

### **ProductSeeder** - 500+ Produits
- **4 catégories** : Homme, Femme, Unisexe, Accessoires
- **Variantes** : 10 couleurs × produits de base
- **Prix** : Gammes réalistes par type
- **Stock** : 5-100 unités par produit
- **Statuts** : 90% actifs, 20% featured, 10% bestsellers

### **UserSeeder** - 10 Utilisateurs
- **Profils complets** : Nom, email, téléphone, adresse
- **Géolocalisation** : Villes françaises + pays
- **Rôle** : Tous users (non-admin)
- **Actifs** : Tous comptes activés

### **OrderSeeder** - 100 Commandes
- **Période** : 90 derniers jours
- **Statuts variés** : pending → delivered
- **1-5 produits** par commande
- **Paiements** : Card, PayPal, virement

### **ReviewSeeder** - Avis Clients
- **100 produits** avec avis
- **0-8 avis** par produit
- **Notes** : 1-5 étoiles
- **Commentaires** : Réalistes selon note
- **Modération** : 80% approuvés

### **WishlistSeeder** - Favoris
- **Chaque user** : 3-15 produits favoris
- **Répartition** : Aléatoire sur catalogue
- **Relation** : user_id + product_id unique

### **TicketSeeder** - Support Client
- **20 users** avec tickets
- **0-3 tickets** par user
- **Sujets variés** : Livraison, remboursement, bug
- **Priorités** : Low/Medium/High
- **Statuts** : Open → Closed

## 🚀 COMMANDES D'INSTALLATION

```bash
# 1. Supprimer anciennes données
php artisan migrate:fresh

# 2. Lancer tous les seeders
php artisan db:seed

# 3. Créer le lien de stockage
php artisan storage:link
```

## 📈 RÉSULTAT FINAL

✅ **500+ produits** dans 4 catégories  
✅ **10 utilisateurs** avec profils complets  
✅ **100 commandes** sur 3 mois  
✅ **Centaines d'avis** clients  
✅ **Favoris** pour chaque user  
✅ **Tickets support** réalistes  
✅ **2 codes promo** actifs  

## 🎯 DONNÉES DE TEST

### **Admin**
- Email: `admin@stellshope.com`
- Password: `password`

### **Users**
- `marie.dupont@email.com` → `password`
- `pierre.martin@email.com` → `password`
- etc. (10 comptes)

### **Codes Promo**
- `WELCOME10` : -10% (min 50€)
- `SAVE20` : -20€ (min 100€)

La base de données est maintenant **complète** avec des données réalistes pour tester toutes les fonctionnalités !