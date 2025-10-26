# Gestion des Produits Simples et Variables

Cette documentation explique l'implémentation de la fonctionnalité de gestion des produits simples et variables dans l'application Stell's Hope.

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Structure de la base de données](#structure-de-la-base-de-données)
3. [Installation et configuration](#installation-et-configuration)
4. [Utilisation](#utilisation)
5. [API Endpoints](#api-endpoints)

## 🎯 Vue d'ensemble

L'application supporte maintenant deux types de produits :

- **Produits simples** : Produits classiques avec un seul prix et un seul stock
- **Produits variables** : Produits avec plusieurs variantes (ex: T-shirt disponible en plusieurs tailles et couleurs)

## 🗄️ Structure de la base de données

### Nouvelles tables

#### `products` (modifiée)
- Ajout du champ `type` : 'simple' ou 'variable'
- Les champs `price` et `stock_quantity` deviennent optionnels (nullable)

#### `product_variants` (nouvelle)
```sql
- id
- product_id (foreign key)
- sku (unique)
- price
- stock_quantity
- timestamps
```

#### `product_attributes` (nouvelle)
```sql
- id
- name (ex: "Taille", "Couleur")
- values (JSON: ["S", "M", "L", ...])
- timestamps
```

#### `product_variant_attributes` (nouvelle - table pivot)
```sql
- id
- product_variant_id (foreign key)
- product_attribute_id (foreign key)
- value (valeur spécifique, ex: "M", "Rouge")
- timestamps
```

## ⚙️ Installation et configuration

### 1. Migrations

Exécutez les migrations pour créer les nouvelles tables :

```bash
cd backend
php artisan migrate
```

Les migrations suivantes seront exécutées :
- `2024_01_01_000003_add_type_to_products_table.php`
- `2024_01_01_000004_create_product_variants_table.php`
- `2024_01_01_000005_create_product_attributes_table.php`
- `2024_01_01_000006_create_product_variant_attributes_table.php`

### 2. Seeders

Exécutez le seeder pour créer les attributs par défaut :

```bash
php artisan db:seed --class=ProductAttributesSeeder
```

Cela créera les attributs suivants :
- **Taille** : XS, S, M, L, XL, XXL
- **Couleur** : Noir, Blanc, Rouge, Bleu, Vert, Jaune, Rose, Gris, Beige
- **Matière** : Coton, Polyester, Laine, Soie, Lin, Cuir, Daim

### 3. Frontend

Aucune installation supplémentaire n'est nécessaire pour le frontend. Les nouveaux composants sont déjà en place.

## 📖 Utilisation

### Interface d'administration

#### Créer/Modifier un produit

1. Accédez à la section **Produits** dans le panneau d'administration
2. Cliquez sur **Nouveau Produit** ou **Modifier** sur un produit existant
3. Sélectionnez le type de produit :
   - **Produit simple** : Remplissez le prix et le stock directement
   - **Produit variable** : Passez à l'onglet **Variantes** pour configurer les variations

#### Gérer les variantes (Produits variables)

1. Dans le formulaire de produit, passez à l'onglet **Variantes**
2. Pour chaque variante, remplissez :
   - **SKU** : Identifiant unique de la variante
   - **Attributs** : Sélectionnez les valeurs pour chaque attribut (Taille, Couleur, etc.)
   - **Prix** : Prix spécifique pour cette variante
   - **Stock** : Quantité en stock pour cette variante
3. Cliquez sur **Ajouter la variante**
4. Répétez pour toutes les combinaisons souhaitées

#### Exemple de configuration

**Produit** : T-shirt premium

**Variantes** :
| SKU | Taille | Couleur | Prix | Stock |
|-----|--------|---------|------|-------|
| TSH-S-NOIR | S | Noir | 24.99€ | 50 |
| TSH-M-NOIR | M | Noir | 24.99€ | 75 |
| TSH-L-NOIR | L | Noir | 24.99€ | 60 |
| TSH-S-BLANC | S | Blanc | 24.99€ | 40 |
| TSH-M-BLANC | M | Blanc | 24.99€ | 80 |
| TSH-L-BLANC | L | Blanc | 24.99€ | 65 |

### Gestion des attributs

Pour ajouter ou modifier des attributs :

1. Utilisez l'API `/admin/attributes`
2. Créez de nouveaux attributs avec leurs valeurs possibles
3. Ces attributs seront disponibles lors de la création de variantes

## 🔌 API Endpoints

### Produits

#### Liste des produits
```http
GET /api/admin/products
```

#### Créer un produit simple
```http
POST /api/admin/products
Content-Type: application/json

{
  "name": "T-shirt basique",
  "description": "Un t-shirt confortable",
  "type": "simple",
  "price": 19.99,
  "stock_quantity": 100,
  "category_id": 1,
  "is_active": true,
  "is_featured": false
}
```

#### Créer un produit variable
```http
POST /api/admin/products
Content-Type: application/json

{
  "name": "T-shirt premium",
  "description": "Un t-shirt de qualité supérieure",
  "type": "variable",
  "category_id": 1,
  "is_active": true,
  "is_featured": false,
  "variants": [
    {
      "sku": "TSH-S-NOIR",
      "price": 24.99,
      "stock_quantity": 50,
      "attributes": {
        "1": "S",
        "2": "Noir"
      }
    },
    {
      "sku": "TSH-M-NOIR",
      "price": 24.99,
      "stock_quantity": 75,
      "attributes": {
        "1": "M",
        "2": "Noir"
      }
    }
  ]
}
```

#### Mettre à jour un produit
```http
PUT /api/admin/products/{id}
Content-Type: application/json

{
  "name": "T-shirt premium modifié",
  "description": "Description mise à jour",
  "type": "variable",
  "variants": [
    {
      "id": 1,
      "sku": "TSH-S-NOIR",
      "price": 26.99,
      "stock_quantity": 45,
      "attributes": {
        "1": "S",
        "2": "Noir"
      }
    }
  ]
}
```

#### Supprimer un produit
```http
DELETE /api/admin/products/{id}
```

### Attributs

#### Liste des attributs
```http
GET /api/admin/attributes
```

#### Créer un attribut
```http
POST /api/admin/attributes
Content-Type: application/json

{
  "name": "Style",
  "values": ["Casual", "Sport", "Élégant"]
}
```

#### Mettre à jour un attribut
```http
PUT /api/admin/attributes/{id}
Content-Type: application/json

{
  "name": "Style",
  "values": ["Casual", "Sport", "Élégant", "Vintage"]
}
```

#### Supprimer un attribut
```http
DELETE /api/admin/attributes/{id}
```

## 📝 Modèles et relations

### Product Model

```php
// Relations
$product->variants // Collection de ProductVariant
$product->category // Category
$product->availableAttributes // Attributs disponibles pour ce produit
```

### ProductVariant Model

```php
// Relations
$variant->product // Product
$variant->attributes // Collection de ProductAttribute
$variant->attributesArray // Array des attributs {attributeId => value}
```

### ProductAttribute Model

```php
// Relations
$attribute->variants // Collection de ProductVariant
```

## 🎨 Composants Frontend

### ProductVariantManager
Composant pour gérer les variantes d'un produit.

**Props:**
- `attributes`: Array des attributs disponibles
- `initialVariants`: Variantes existantes (pour l'édition)
- `onChange`: Callback appelé lors de la modification des variantes

### ProductEditModal
Modal pour créer/modifier un produit avec support des variantes.

**Features:**
- Onglets pour organiser le formulaire (Général, Variantes, Images)
- Sélection du type de produit
- Interface intuitive pour gérer les variantes

## 🔍 Exemple complet

### Création d'un produit variable complet

1. **Créer les attributs** (si pas déjà créés)
```bash
curl -X POST http://localhost:8000/api/admin/attributes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pointure",
    "values": ["37", "38", "39", "40", "41", "42", "43"]
  }'
```

2. **Créer le produit avec variantes**
```bash
curl -X POST http://localhost:8000/api/admin/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Basket de sport",
    "description": "Basket confortable pour le sport",
    "type": "variable",
    "category_id": 1,
    "is_active": true,
    "variants": [
      {
        "sku": "BASKET-38-NOIR",
        "price": 89.99,
        "stock_quantity": 20,
        "attributes": {"3": "38", "2": "Noir"}
      },
      {
        "sku": "BASKET-39-NOIR",
        "price": 89.99,
        "stock_quantity": 25,
        "attributes": {"3": "39", "2": "Noir"}
      }
    ]
  }'
```

## 🐛 Dépannage

### Les variantes ne s'affichent pas
- Vérifiez que le produit est de type "variable"
- Assurez-vous que les migrations ont été exécutées
- Vérifiez que les attributs ont été créés avec le seeder

### Erreur lors de la création d'une variante
- Vérifiez que le SKU est unique
- Assurez-vous que les IDs d'attributs existent dans la base de données
- Vérifiez que tous les champs requis sont remplis

### Les attributs ne sont pas disponibles
- Exécutez le seeder : `php artisan db:seed --class=ProductAttributesSeeder`
- Vérifiez que la table `product_attributes` contient des données

## 📚 Ressources supplémentaires

- [Documentation Laravel - Relationships](https://laravel.com/docs/eloquent-relationships)
- [Documentation React - Hooks](https://react.dev/reference/react)
- [Documentation TypeScript](https://www.typescriptlang.org/docs/)

## 🤝 Contribution

Pour contribuer à cette fonctionnalité :

1. Créez une branche depuis `main`
2. Implémentez vos changements
3. Testez localement
4. Créez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.
