# 🔍 INTÉGRATION NUQS - GESTION D'URL AVANCÉE

## 📦 INSTALLATION
```bash
npm install nuqs
```

## 🎯 HOOKS CRÉÉS

### **useProductFilters** - Filtres Produits
```typescript
const {
  page, setPage,           // Pagination
  search, setSearch,       // Recherche textuelle
  category, setCategory,   // Filtre catégorie
  minPrice, setMinPrice,   // Prix minimum
  maxPrice, setMaxPrice,   // Prix maximum
  sortBy, setSortBy,       // Tri
  colors, setColors,       // Couleurs (array)
  sizes, setSizes,         // Tailles (array)
  resetFilters,            // Reset tous les filtres
  getFilters              // Objet pour API
} = useProductFilters();
```

### **useAdminFilters** - Filtres Admin
- `useAdminProductFilters()` - Produits admin
- `useAdminOrderFilters()` - Commandes admin  
- `useAdminCustomerFilters()` - Clients admin

## 🧩 COMPOSANTS CRÉÉS

### **ProductFilters** - Filtres Complets
- Recherche textuelle
- Sélection catégorie
- Fourchette de prix
- Sélection couleurs (multi)
- Sélection tailles (multi)
- Tri par critères
- Reset automatique

### **Pagination** - Navigation Pages
- Pages visibles intelligentes
- Boutons Précédent/Suivant
- Informations de résultats
- Design responsive

### **SearchBar** - Recherche Globale
- Recherche avec validation
- Navigation automatique vers /boutique
- Synchronisation avec filtres

### **AdminProductList** - Liste Admin
- Filtres intégrés (recherche, catégorie, statut)
- Pagination automatique
- Actions CRUD
- Tableau responsive

## 🔗 SYNCHRONISATION URL

### **URLs Générées Automatiquement**
```
/boutique?page=2&search=t-shirt&category=1&min_price=20&max_price=100&colors=Noir,Blanc&sizes=M,L&sort=price_asc
```

### **Avantages**
- ✅ **URLs partageables** - Copier/coller l'état exact
- ✅ **Navigation navigateur** - Boutons précédent/suivant
- ✅ **Rechargement page** - État conservé
- ✅ **SEO friendly** - URLs lisibles
- ✅ **Bookmarks** - Sauvegarder recherches

## 🎮 UTILISATION

### **1. Dans les Pages**
```tsx
// Page Boutique
const BoutiquePage = () => {
  return (
    <div className="flex">
      <ProductFilters />
      <ProductList />
    </div>
  );
};
```

### **2. Dans le Header**
```tsx
// Header avec recherche
const Header = () => {
  return (
    <header>
      <SearchBar />
    </header>
  );
};
```

### **3. Admin Dashboard**
```tsx
// Page Admin Produits
const AdminProducts = () => {
  return <AdminProductList />;
};
```

## 📊 FONCTIONNALITÉS AVANCÉES

### **Filtres Multiples**
- Couleurs et tailles en array
- Combinaisons complexes
- Reset sélectif ou global

### **Pagination Intelligente**
- Calcul automatique des pages visibles
- Gestion des "..." pour grandes listes
- Informations contextuelles

### **Recherche Temps Réel**
- Debounce automatique
- Navigation intelligente
- Conservation des autres filtres

### **État Persistant**
- Survit au rechargement
- Synchronisé entre onglets
- Historique navigateur

## 🔧 CONFIGURATION

### **Types de Parsers**
```typescript
parseAsInteger        // Nombres
parseAsString         // Texte
parseAsArrayOf()      // Tableaux
parseAsBoolean        // Booléens
```

### **Valeurs par Défaut**
```typescript
.withDefault(1)       // Page 1 par défaut
.withDefault('')      // Recherche vide
.withDefault([])      // Array vide
```

## 🎯 RÉSULTAT

- ✅ **URLs intelligentes** pour tous les filtres
- ✅ **Pagination** avec état dans l'URL
- ✅ **Recherche** synchronisée
- ✅ **Filtres admin** complets
- ✅ **Navigation** naturelle
- ✅ **Partage** d'états précis
- ✅ **SEO** optimisé

L'intégration nuqs rend l'expérience utilisateur **fluide** et **professionnelle** ! 🚀