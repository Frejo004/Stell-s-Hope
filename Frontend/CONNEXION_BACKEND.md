# 🔗 CONNEXION BACKEND-FRONTEND COMPLÈTE

## 📋 SERVICES API CRÉÉS

### **Core Services**
- `api.ts` - Configuration Axios avec intercepteurs
- `authService.ts` - Authentification (login/register/logout)
- `productService.ts` - Gestion des produits
- `orderService.ts` - Gestion des commandes
- `cartService.ts` - Gestion du panier
- `wishlistService.ts` - Gestion des favoris
- `reviewService.ts` - Gestion des avis
- `ticketService.ts` - Support client
- `adminService.ts` - Toutes les fonctions admin

### **Context & Hooks**
- `AuthContext.tsx` - État global d'authentification
- `useProducts.ts` - Hook pour les produits
- `useCart.ts` - Hook pour le panier
- `useOrders.ts` - Hook pour les commandes
- `useWishlist.ts` - Hook pour les favoris

### **Composants**
- `ProtectedRoute.tsx` - Protection des routes
- `LoginForm.tsx` - Formulaire de connexion
- `ProductList.tsx` - Liste des produits connectée

## 🔧 CONFIGURATION

### **Backend Laravel (Port 8000)**
```bash
cd Backend
php artisan serve
```

### **Frontend React (Port 5173)**
```bash
cd Frontend
npm run dev
```

### **CORS Backend**
Ajouter dans `config/cors.php` :
```php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:5173'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

## 🚀 FONCTIONNALITÉS CONNECTÉES

### **Authentification**
```typescript
// Login
const { login } = useAuth();
await login(email, password);

// Register
await register({
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  password: 'password',
  password_confirmation: 'password'
});
```

### **Produits**
```typescript
// Liste des produits
const { products, loading } = useProducts({ category: 1 });

// Produit unique
const { product } = useProduct(productId);
```

### **Panier**
```typescript
const { cart, addToCart, updateCart } = useCart();

// Ajouter au panier
await addToCart(productId, quantity);
```

### **Favoris**
```typescript
const { wishlist, toggleWishlist, isInWishlist } = useWishlist();

// Toggle favori
await toggleWishlist(productId);
```

### **Commandes**
```typescript
const { orders, createOrder } = useOrders();

// Créer commande
await createOrder({
  items: [{ product_id: 1, quantity: 2 }],
  shipping_address: 'Adresse...',
  billing_address: 'Adresse...',
  payment_method: 'card'
});
```

### **Admin**
```typescript
// Dashboard
const dashboard = await adminService.getDashboard();

// Gestion produits
const products = await adminService.getAdminProducts();
await adminService.createProduct(formData);
```

## 🔐 SÉCURITÉ

### **Token JWT**
- Stockage automatique dans localStorage
- Ajout automatique dans les headers
- Redirection auto si token expiré

### **Routes Protégées**
```tsx
<ProtectedRoute>
  <AccountPage />
</ProtectedRoute>

<ProtectedRoute adminOnly>
  <AdminDashboard />
</ProtectedRoute>
```

## 📊 ÉTAT GLOBAL

### **AuthContext**
- `user` - Utilisateur connecté
- `isAuthenticated` - Statut de connexion
- `isAdmin` - Droits administrateur
- `login/logout` - Méthodes d'authentification

### **Hooks Personnalisés**
- Gestion automatique du loading
- Gestion des erreurs
- Refetch des données
- État local optimisé

## 🎯 UTILISATION

### **1. Wrapper l'app avec AuthProvider**
```tsx
// main.tsx
<AuthProvider>
  <App />
</AuthProvider>
```

### **2. Utiliser les hooks dans les composants**
```tsx
const MyComponent = () => {
  const { user, isAuthenticated } = useAuth();
  const { products } = useProducts();
  const { addToCart } = useCart();
  
  return (
    // JSX
  );
};
```

### **3. Protéger les routes**
```tsx
<Route path="/account" element={
  <ProtectedRoute>
    <AccountPage />
  </ProtectedRoute>
} />
```

La connexion backend-frontend est maintenant **complète** et **sécurisée** ! 🎉