# 🚀 Guide de démarrage rapide - Produits Variables

Ce guide vous permet de mettre en place rapidement la fonctionnalité de gestion des produits simples et variables.

## ✅ Étapes d'installation

### 1. Backend - Migrations

Exécutez les migrations pour créer les nouvelles tables :

```bash
cd backend
php artisan migrate
```

### 2. Backend - Seeders

Créez les attributs par défaut (Taille, Couleur, Matière) :

```bash
php artisan db:seed --class=ProductAttributesSeeder
```

### 3. Vérification

Vérifiez que les tables ont été créées correctement :

```bash
php artisan tinker
```

Puis dans Tinker :

```php
\App\Models\ProductAttribute::all();
// Devrait afficher 3 attributs : Taille, Couleur, Matière
exit
```

## 📋 Test de la fonctionnalité

### Option 1 : Via l'interface d'administration

1. **Démarrez les serveurs** :

Backend :
```bash
cd backend
php artisan serve
```

Frontend :
```bash
cd Frontend
npm install
npm run dev
```

2. **Accédez à l'administration** :
   - URL : `http://localhost:5173/admin`
   - Connectez-vous avec vos identifiants admin

3. **Créez un produit variable** :
   - Cliquez sur "Nouveau Produit"
   - Remplissez le nom et la description
   - Sélectionnez "Produit variable" dans le type
   - Allez dans l'onglet "Variantes"
   - Ajoutez plusieurs variantes avec différentes tailles et couleurs
   - Sauvegardez

### Option 2 : Via l'API (avec cURL)

#### Créer un produit simple

```bash
curl -X POST http://localhost:8000/api/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "T-shirt basique",
    "description": "Un t-shirt confortable en coton",
    "type": "simple",
    "price": 19.99,
    "stock_quantity": 100,
    "category_id": 1,
    "is_active": true,
    "is_featured": false
  }'
```

#### Créer un produit variable

```bash
curl -X POST http://localhost:8000/api/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "T-shirt premium",
    "description": "T-shirt de qualité supérieure disponible en plusieurs tailles et couleurs",
    "type": "variable",
    "category_id": 1,
    "is_active": true,
    "is_featured": false,
    "variants": [
      {
        "sku": "TSH-PREM-S-NOIR",
        "price": 29.99,
        "stock_quantity": 50,
        "attributes": {
          "1": "S",
          "2": "Noir"
        }
      },
      {
        "sku": "TSH-PREM-M-NOIR",
        "price": 29.99,
        "stock_quantity": 75,
        "attributes": {
          "1": "M",
          "2": "Noir"
        }
      },
      {
        "sku": "TSH-PREM-L-NOIR",
        "price": 29.99,
        "stock_quantity": 60,
        "attributes": {
          "1": "L",
          "2": "Noir"
        }
      },
      {
        "sku": "TSH-PREM-S-BLANC",
        "price": 29.99,
        "stock_quantity": 40,
        "attributes": {
          "1": "S",
          "2": "Blanc"
        }
      },
      {
        "sku": "TSH-PREM-M-BLANC",
        "price": 29.99,
        "stock_quantity": 80,
        "attributes": {
          "1": "M",
          "2": "Blanc"
        }
      },
      {
        "sku": "TSH-PREM-L-BLANC",
        "price": 29.99,
        "stock_quantity": 65,
        "attributes": {
          "1": "L",
          "2": "Blanc"
        }
      }
    ]
  }'
```

#### Lister tous les produits

```bash
curl -X GET http://localhost:8000/api/admin/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Voir un produit spécifique avec ses variantes

```bash
curl -X GET http://localhost:8000/api/admin/products/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🎯 Cas d'usage courants

### Ajouter un nouvel attribut

```bash
curl -X POST http://localhost:8000/api/admin/attributes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Coupe",
    "values": ["Slim", "Regular", "Oversize"]
  }'
```

### Mettre à jour le stock d'une variante

```bash
curl -X PUT http://localhost:8000/api/admin/products/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "variants": [
      {
        "id": 1,
        "sku": "TSH-PREM-S-NOIR",
        "price": 29.99,
        "stock_quantity": 45,
        "attributes": {
          "1": "S",
          "2": "Noir"
        }
      }
    ]
  }'
```

### Convertir un produit simple en produit variable

```bash
curl -X PUT http://localhost:8000/api/admin/products/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "type": "variable",
    "price": null,
    "stock_quantity": null,
    "variants": [
      {
        "sku": "PROD-CONV-S",
        "price": 19.99,
        "stock_quantity": 30,
        "attributes": {
          "1": "S"
        }
      },
      {
        "sku": "PROD-CONV-M",
        "price": 19.99,
        "stock_quantity": 40,
        "attributes": {
          "1": "M"
        }
      }
    ]
  }'
```

## 🔍 Vérification des données

### Vérifier les produits en base de données

```bash
php artisan tinker
```

```php
// Lister tous les produits
\App\Models\Product::with('variants.attributes')->get();

// Voir un produit spécifique avec ses variantes
$product = \App\Models\Product::with('variants.attributes')->find(1);
echo $product->name;
echo $product->type;
$product->variants->each(function($variant) {
    echo "\nSKU: " . $variant->sku;
    echo " - Prix: " . $variant->price;
    echo " - Stock: " . $variant->stock_quantity;
});
```

## 📊 Structure des tables

### Table products
```sql
SELECT * FROM products WHERE type = 'variable';
```

### Table product_variants
```sql
SELECT pv.*, p.name as product_name 
FROM product_variants pv 
JOIN products p ON p.id = pv.product_id;
```

### Table product_attributes
```sql
SELECT * FROM product_attributes;
```

### Table product_variant_attributes
```sql
SELECT 
    pv.sku,
    pa.name as attribute_name,
    pva.value as attribute_value
FROM product_variant_attributes pva
JOIN product_variants pv ON pv.id = pva.product_variant_id
JOIN product_attributes pa ON pa.id = pva.product_attribute_id
ORDER BY pv.sku, pa.name;
```

## 🛠️ Commandes utiles

### Réinitialiser les migrations (ATTENTION: efface toutes les données)

```bash
php artisan migrate:fresh
php artisan db:seed --class=ProductAttributesSeeder
```

### Créer une sauvegarde avant les tests

```bash
# Avec mysqldump
mysqldump -u root -p stells_hope > backup_avant_produits_variables.sql

# Ou via artisan
php artisan db:backup
```

### Restaurer une sauvegarde

```bash
mysql -u root -p stells_hope < backup_avant_produits_variables.sql
```

## ⚠️ Points d'attention

1. **SKU unique** : Chaque variante doit avoir un SKU unique dans toute l'application
2. **Attributs** : Les IDs d'attributs dans les variantes doivent correspondre à des attributs existants
3. **Type de produit** : Un produit variable ne peut pas avoir de prix/stock global
4. **Suppression** : La suppression d'un produit supprime automatiquement toutes ses variantes

## 🆘 Besoin d'aide ?

Consultez le fichier `PRODUITS_VARIABLES_README.md` pour une documentation complète.

### Problèmes courants

**"Table not found"**
```bash
php artisan migrate
```

**"Attribute not found"**
```bash
php artisan db:seed --class=ProductAttributesSeeder
```

**"SKU already exists"**
- Vérifiez que le SKU est unique
- Utilisez un format de SKU cohérent (ex: PROD-TAILLE-COULEUR)

## ✨ Prochaines étapes

1. Créez quelques produits de test
2. Testez l'interface d'administration
3. Vérifiez l'affichage côté client
4. Configurez vos propres attributs selon vos besoins

Bonne utilisation ! 🎉
