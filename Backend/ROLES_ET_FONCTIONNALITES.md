# 👥 RÔLES ET FONCTIONNALITÉS - STELL'S HOPE

## 🎯 SYSTÈME DE RÔLES

### **USER (Utilisateur par défaut)**
- **Création automatique** : Tout nouveau compte = `is_admin: false`
- **Statut actif** : `is_active: true` par défaut

### **ADMIN (Administrateur)**
- **Accès complet** : Gestion de tout le site
- **Création manuelle** : `is_admin: true`

---

## 🛍️ FONCTIONNALITÉS USER

### **Authentification**
- ✅ Inscription automatique en tant qu'user
- ✅ Connexion/Déconnexion
- ✅ Gestion profil

### **Shopping**
- ✅ **Panier** : Ajouter/Modifier/Supprimer produits
- ✅ **Favoris** : Like/Unlike produits (`/api/wishlist/toggle`)
- ✅ **Commandes** : Passer commande et suivre le statut
- ✅ **Suivi** : Tracking des livraisons

### **Avis et Notes**
- ✅ **Noter produits** : 1-5 étoiles (`/api/reviews`)
- ✅ **Commenter** : Avis détaillés
- ✅ **Historique** : Voir ses avis

### **Support**
- ✅ **Tickets** : Créer des demandes d'aide (`/api/tickets`)
- ✅ **Suivi** : Voir le statut des tickets
- ✅ **Priorités** : Low/Medium/High

---

## 🔧 FONCTIONNALITÉS ADMIN

### **Gestion Produits**
- ✅ CRUD complet avec images
- ✅ Gestion stock et statuts
- ✅ Catégories et attributs

### **Gestion Commandes**
- ✅ Voir toutes les commandes
- ✅ Changer statuts (pending → delivered)
- ✅ Gestion livraisons et tracking

### **Gestion Clients**
- ✅ Liste tous les users
- ✅ Voir profils et historiques
- ✅ Activer/Désactiver comptes

### **Promotions**
- ✅ **Codes promo** : Créer/Modifier/Supprimer (`/api/admin/promotions`)
- ✅ **Types** : Pourcentage ou montant fixe
- ✅ **Conditions** : Montant minimum, limite d'usage

### **Support Client**
- ✅ **Tickets** : Voir tous les tickets (`/api/admin/tickets`)
- ✅ **Réponses** : Répondre aux demandes
- ✅ **Statuts** : Open → In Progress → Resolved → Closed

### **Analytics**
- ✅ Dashboard avec statistiques
- ✅ Revenus et tendances
- ✅ Produits populaires
- ✅ Comportement clients

---

## 📊 NOUVELLES ROUTES API

### **User Routes**
```
POST /api/wishlist/toggle     # Like/Unlike produit
GET  /api/wishlist           # Voir favoris
POST /api/reviews            # Noter un produit
GET  /api/reviews            # Voir ses avis
POST /api/tickets            # Créer ticket support
GET  /api/tickets            # Voir ses tickets
```

### **Admin Routes**
```
GET|POST|PUT|DELETE /api/admin/promotions    # Gestion promos
GET|PUT /api/admin/tickets                   # Gestion support
GET /api/admin/tickets/stats                 # Stats tickets
```

---

## 🗄️ NOUVELLES TABLES

### **wishlists**
- `user_id` + `product_id` (unique)
- Gestion des favoris

### **promotions**
- `code`, `type`, `value`, `expires_at`
- Codes promo avec conditions

### **tickets**
- `user_id`, `subject`, `message`, `status`, `priority`
- Support client complet

---

## 🚀 WORKFLOW UTILISATEUR

1. **Inscription** → Automatiquement `user`
2. **Navigation** → Voir produits, ajouter au panier
3. **Favoris** → Like/Unlike produits
4. **Commande** → Checkout et suivi
5. **Avis** → Noter et commenter après achat
6. **Support** → Créer tickets si problème

## 🔧 WORKFLOW ADMIN

1. **Dashboard** → Vue d'ensemble
2. **Produits** → Créer/Gérer catalogue
3. **Commandes** → Traiter et expédier
4. **Clients** → Suivre et gérer users
5. **Promos** → Créer codes de réduction
6. **Support** → Répondre aux tickets

Le système est maintenant complet avec tous les rôles et fonctionnalités nécessaires !