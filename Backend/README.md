# Stell's Hope Backend API

API Laravel pour l'application e-commerce Stell's Hope avec PostgreSQL.

## 🚀 Installation

### Prérequis
- PHP 8.2+
- Composer
- PostgreSQL 12+

### Configuration

1. **Installer les dépendances**
```bash
composer install
```

2. **Configuration environnement**
```bash
cp .env.example .env
```

3. **Configurer PostgreSQL dans .env**
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=stellshope_db
DB_USERNAME=postgres
DB_PASSWORD=votre_mot_de_passe
```

4. **Générer la clé d'application**
```bash
php artisan key:generate
```

5. **Créer la base de données**
```sql
CREATE DATABASE stellshope_db;
```

6. **Exécuter les migrations**
```bash
php artisan migrate
```

7. **Peupler la base de données**
```bash
php artisan db:seed
```

8. **Démarrer le serveur**
```bash
php artisan serve
```

## 📊 Structure de la Base de Données

### Tables Principales
- **users** - Utilisateurs et admins
- **categories** - Catégories de produits  
- **products** - Catalogue produits
- **orders** - Commandes
- **order_items** - Articles de commande
- **reviews** - Avis clients

## 🔐 Authentification

L'API utilise Laravel Sanctum pour l'authentification par tokens.

### Endpoints Auth
- `POST /api/register` - Inscription
- `POST /api/login` - Connexion
- `POST /api/logout` - Déconnexion
- `GET /api/me` - Profil utilisateur

## 📱 Endpoints API

### Produits (Public)
- `GET /api/products` - Liste des produits avec filtres
- `GET /api/products/{id}` - Détail produit
- `GET /api/products/featured` - Produits mis en avant
- `GET /api/products/bestsellers` - Meilleures ventes

### Catégories (Public)
- `GET /api/categories` - Liste des catégories
- `GET /api/categories/{id}` - Détail catégorie avec produits

## 🛡️ Sécurité

- Authentification par tokens Sanctum
- Validation des données d'entrée
- Protection CORS configurée

## 📈 Fonctionnalités

### E-commerce Core
- ✅ Gestion produits complète
- ✅ Système de catégories
- ✅ Authentification utilisateurs
- ✅ Structure pour commandes et avis

## 📝 Données de Test

Après le seeding :
- **Admin** : admin@stellshope.com / password
- **Produits** : 3 produits de démonstration
- **Catégories** : Hauts, Bas, Accessoires

## 🚀 Déploiement

1. Configurer PostgreSQL en production
2. Mettre à jour les variables d'environnement
3. Exécuter les migrations
4. Configurer le serveur web (Nginx/Apache)
5. Optimiser avec `php artisan optimize`