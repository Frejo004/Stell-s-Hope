# 🚀 Installation Backend Stell's Hope

## Prérequis
- PHP 8.2+
- Composer
- MySQL/PostgreSQL
- Node.js (pour Vite)

## Installation

### 1. Dépendances
```bash
composer install
npm install
```

### 2. Configuration
```bash
cp .env.example .env
php artisan key:generate
```

### 3. Base de données
Configurer `.env` avec vos paramètres de base de données :
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=stells_hope
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Migrations et données
```bash
php artisan migrate
php artisan db:seed
```

### 5. Stockage
```bash
php artisan storage:link
```

### 6. Démarrage
```bash
php artisan serve
```

## Comptes par défaut

### Admin
- Email: `admin@stellshope.com`
- Mot de passe: `password`

### Client test
- Email: `john@example.com`
- Mot de passe: `password`

## API Endpoints

### Authentification
- `POST /api/register` - Inscription
- `POST /api/login` - Connexion
- `POST /api/logout` - Déconnexion

### Produits (Public)
- `GET /api/products` - Liste des produits
- `GET /api/products/{id}` - Détail produit
- `GET /api/products/featured` - Produits mis en avant
- `GET /api/products/bestsellers` - Meilleures ventes

### Admin (Authentification requise + is_admin = true)
- `GET /api/admin/dashboard` - Statistiques dashboard
- `GET /api/admin/products` - Gestion produits
- `GET /api/admin/orders` - Gestion commandes
- `GET /api/admin/customers` - Gestion clients

## Structure des données

### Produit
```json
{
  "id": 1,
  "name": "T-shirt Premium",
  "description": "Description du produit",
  "price": 29.99,
  "category_id": 1,
  "images": ["url1", "url2"],
  "stock_quantity": 50,
  "is_active": true,
  "is_featured": false,
  "is_bestseller": false
}
```

### Commande
```json
{
  "id": 1,
  "user_id": 1,
  "order_number": "ORD-123456",
  "status": "pending",
  "total_amount": 89.99,
  "items": [...]
}
```

## Fonctionnalités implémentées

✅ **Authentification complète**
✅ **CRUD Produits avec images**
✅ **Gestion des commandes**
✅ **Dashboard admin avec statistiques**
✅ **Gestion des clients**
✅ **Export CSV**
✅ **Filtres et recherche**
✅ **Middleware de sécurité**

Le backend est maintenant prêt à être utilisé avec le frontend React !