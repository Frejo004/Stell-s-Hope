# 🚀 INSTRUCTIONS FINALES - BACKEND + FRONTEND

## ✅ CE QUI A ÉTÉ FAIT

### Backend Laravel (en cours d'installation)
- ✅ Création du dossier `/backend`
- ⏳ Installation Laravel en cours...

### Frontend React
- ✅ Fichier `.env.example` créé
- ✅ Client API créé (`src/lib/api.ts`)
- ✅ Hook `useAuth` modifié pour utiliser l'API

---

## 📋 ÉTAPES À SUIVRE MAINTENANT

### 1️⃣ ATTENDRE LA FIN D'INSTALLATION LARAVEL
```bash
# L'installation prend 2-3 minutes
# Vous verrez : "Application ready! Build something amazing."
```

### 2️⃣ INSTALLER AXIOS DANS FRONTEND
```bash
cd c:\Users\frejo\Documents\CODE\Stell-s-Hope\Frontend
npm install axios
```

### 3️⃣ CRÉER .env.local DANS FRONTEND
```bash
# Copier .env.example vers .env.local
copy .env.example .env.local

# Ou créer manuellement avec ce contenu :
VITE_API_URL=http://localhost:8000/api
```

### 4️⃣ CONFIGURER LARAVEL

```bash
cd c:\Users\frejo\Documents\CODE\Stell-s-Hope\backend

# Installer packages
composer require laravel/sanctum fruitcake/laravel-cors

# Configurer .env
# Ouvrir backend/.env et modifier :
DB_CONNECTION=mysql
DB_DATABASE=stells_hope
DB_USERNAME=root
DB_PASSWORD=

# Si PostgreSQL :
DB_CONNECTION=pgsql
DB_DATABASE=stells_hope
DB_USERNAME=postgres
DB_PASSWORD=votre_password
```

### 5️⃣ CRÉER LA BASE DE DONNÉES

**MySQL** :
```bash
# Dans MySQL Workbench ou via ligne de commande
CREATE DATABASE stells_hope;
```

**PostgreSQL** :
```bash
# Dans pgAdmin ou psql
CREATE DATABASE stells_hope;
```

---

## 📂 FICHIERS À CRÉER DANS BACKEND

### Je vais créer ces fichiers une fois Laravel installé :

1. **Migrations** (8 fichiers)
   - products
   - orders
   - order_items
   - addresses
   - reviews
   - wishlist
   - promotions

2. **Modèles** (7 fichiers)
   - Product.php
   - Order.php
   - OrderItem.php
   - Address.php
   - Review.php
   - Wishlist.php
   - Promotion.php

3. **Controllers** (5 fichiers)
   - AuthController.php
   - ProductController.php
   - OrderController.php
   - AddressController.php
   - ReviewController.php

4. **Routes**
   - routes/api.php

5. **Config**
   - CORS
   - Sanctum

6. **Seeders**
   - ProductSeeder (vos 6 produits actuels)

---

## 🔄 WORKFLOW FINAL

### Backend
```bash
cd backend

# 1. Migrer DB
php artisan migrate

# 2. Seed produits
php artisan db:seed

# 3. Lancer serveur
php artisan serve
# → http://localhost:8000
```

### Frontend
```bash
cd Frontend

# Lancer dev
npm run dev
# → http://localhost:5173
```

### Tester
1. Ouvrir http://localhost:5173
2. Cliquer "S'inscrire"
3. Créer compte
4. → Appel API vers Laravel !

---

## 🎯 ENDPOINTS DISPONIBLES

```
POST   /api/register         # Créer compte
POST   /api/login            # Se connecter
POST   /api/logout           # Se déconnecter (auth required)
GET    /api/me               # User info (auth required)

GET    /api/products         # Liste produits
GET    /api/products/{id}    # Détail produit

POST   /api/orders           # Créer commande (auth required)
GET    /api/orders           # Mes commandes (auth required)
GET    /api/orders/{id}      # Détail commande (auth required)
```

---

## ⏭️ PROCHAINE ÉTAPE

**Dès que vous voyez "Application ready!" :**

1. Dites-moi et je créerai tous les fichiers backend
2. Vous exécutez les commandes de configuration
3. Je modifie les autres hooks (useCart, useOrders)
4. Vous testez l'application complète !

---

**Status : Installation Laravel en cours... ⏳**

**Estimé : 2-3 minutes restantes**
