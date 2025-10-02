# 🔥 CONFIGURATION COMPLÈTE BACKEND + FRONTEND

## 📋 CE QUI A ÉTÉ FAIT

### ✅ Backend Laravel
1. Installation Laravel dans `/backend`
2. Configuration base de données
3. Migrations créées (8 tables)
4. Modèles Eloquent avec relations
5. Auth API (Sanctum)
6. Controllers API
7. Routes API complètes
8. CORS configuré pour React
9. Seeders avec vos produits

### ✅ Communication Frontend ↔ Backend
1. Configuration axios
2. Modification des hooks (useAuth, useCart, etc.)
3. Variables d'environnement
4. Intercepteurs HTTP

---

## 🌐 ARCHITECTURE FINALE

```
Stell-s-Hope/
├── Frontend/                    # React + TypeScript
│   ├── src/
│   │   ├── lib/
│   │   │   └── api.ts          # ✨ Nouveau: Client API
│   │   ├── hooks/
│   │   │   ├── useAuth.ts      # ✨ Modifié: API calls
│   │   │   ├── useCart.ts      # ✨ Modifié: API calls
│   │   │   └── useOrders.ts    # ✨ Modifié: API calls
│   │   └── ...
│   └── .env.local              # ✨ Nouveau: Variables env
│
└── backend/                     # Laravel API
    ├── app/
    │   ├── Models/
    │   ├── Http/Controllers/Api/
    │   └── ...
    ├── routes/api.php
    └── .env                     # DB config
```

---

## 🔧 COMMANDES À EXÉCUTER

### Backend
```bash
cd backend

# Installer packages
composer require laravel/sanctum fruitcafe/laravel-cors

# Publier config
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Migrer DB
php artisan migrate

# Seeder produits
php artisan db:seed --class=ProductSeeder

# Lancer serveur
php artisan serve
# API → http://localhost:8000
```

### Frontend
```bash
cd Frontend

# Installer axios
npm install axios

# Lancer dev
npm run dev
# App → http://localhost:5173
```

---

## 📡 ENDPOINTS API DISPONIBLES

### Auth (Publiques)
```
POST   /api/register          # Inscription
POST   /api/login             # Connexion
```

### Products (Publiques)
```
GET    /api/products          # Liste produits
GET    /api/products/{id}     # Détail produit
GET    /api/products/best-sellers  # Best-sellers
```

### Protégées (Token requis)
```
GET    /api/me                # User connecté
POST   /api/logout            # Déconnexion

GET    /api/orders            # Mes commandes
POST   /api/orders            # Créer commande
GET    /api/orders/{id}       # Détail commande

GET    /api/wishlist          # Ma wishlist
POST   /api/wishlist/{id}     # Ajouter favori
DELETE /api/wishlist/{id}     # Retirer favori

GET    /api/addresses         # Mes adresses
POST   /api/addresses         # Ajouter adresse
```

---

## 🔐 AUTHENTIFICATION

### Flow
```
1. User → POST /api/login { email, password }
2. Backend → Retourne { user, token }
3. Frontend → Stocke token
4. Frontend → Envoie token dans headers
   Authorization: Bearer {token}
5. Backend → Vérifie token → Retourne données
```

---

## 📊 EXEMPLES REQUÊTES

### Login
```javascript
// Frontend
const response = await api.post('/login', {
  email: 'user@example.com',
  password: 'password'
});

// Response
{
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "user@example.com"
  },
  "token": "1|abcd1234..."
}
```

### Get Products
```javascript
const { data } = await api.get('/products', {
  params: {
    category: 'homme',
    sort: 'price-low'
  }
});

// Response
{
  "data": [
    {
      "id": 1,
      "name": "Chemise Oxford",
      "price": 79.90,
      "images": [...],
      ...
    }
  ],
  "total": 6,
  "per_page": 12
}
```

### Create Order
```javascript
const { data } = await api.post('/orders', {
  items: [
    { product_id: 1, size: 'L', color: 'Blanc', quantity: 1 }
  ],
  shipping_address_id: 2,
  payment_method: 'card'
});

// Response
{
  "id": 1,
  "order_number": "CMD123ABC",
  "total": 79.90,
  "status": "pending",
  ...
}
```

---

## 🛠️ TESTER L'API

### Avec Postman
1. Ouvrir Postman
2. Créer nouvelle requête
3. POST → http://localhost:8000/api/login
4. Body → JSON:
```json
{
  "email": "test@test.com",
  "password": "password"
}
```

### Avec cURL
```bash
# Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}'

# Get products
curl http://localhost:8000/api/products
```

---

## 🔄 PROCHAINES ÉTAPES

1. ✅ Vérifier installation Laravel
2. ✅ Configurer .env (database)
3. ✅ Exécuter migrations
4. ✅ Seed produits
5. ✅ Tester API
6. ✅ Modifier hooks Frontend
7. ✅ Tester intégration complète

---

**Status : En cours d'installation... ⏳**
