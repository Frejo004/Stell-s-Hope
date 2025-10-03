// Configuration de l'application
export const APP_CONFIG = {
  name: "Stell's Hope",
  version: '1.0.0',
  description: 'Boutique de mode en ligne',
  author: 'Stell\'s Hope Team'
} as const;

// URLs et endpoints
export const API_ENDPOINTS = {
  auth: {
    login: '/login',
    register: '/register',
    logout: '/logout',
    me: '/me',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    verifyEmail: '/verify-email'
  },
  products: {
    list: '/products',
    detail: (id: string) => `/products/${id}`,
    featured: '/products/featured',
    bestsellers: '/products/bestsellers',
    search: '/products/search'
  },
  categories: {
    list: '/categories',
    detail: (id: string) => `/categories/${id}`
  },
  orders: {
    list: '/orders',
    detail: (id: string) => `/orders/${id}`,
    create: '/orders',
    track: (id: string) => `/orders/${id}/track`
  },
  cart: {
    get: '/cart',
    add: '/cart/add',
    update: '/cart/update',
    remove: '/cart/remove',
    clear: '/cart/clear'
  }
} as const;

// Constantes de l'interface utilisateur
export const UI_CONSTANTS = {
  // Pagination
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
  
  // Panier
  MAX_CART_ITEMS: 99,
  MAX_CART_QUANTITY: 10,
  
  // Toast notifications
  TOAST_DURATION: {
    success: 3000,
    error: 5000,
    warning: 4000,
    info: 3000
  },
  MAX_TOASTS: 5,
  
  // Recherche
  MIN_SEARCH_LENGTH: 2,
  SEARCH_DEBOUNCE_DELAY: 300,
  
  // Images
  DEFAULT_PRODUCT_IMAGE: '/images/placeholder-product.jpg',
  DEFAULT_AVATAR: '/images/placeholder-avatar.jpg',
  
  // Breakpoints (correspond à Tailwind)
  BREAKPOINTS: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  }
} as const;

// Constantes métier
export const BUSINESS_CONSTANTS = {
  // Livraison
  FREE_SHIPPING_THRESHOLD: 100,
  SHIPPING_COST: 5.99,
  
  // Devise
  CURRENCY: 'EUR',
  CURRENCY_SYMBOL: '€',
  
  // TVA
  VAT_RATE: 0.20,
  
  // Tailles disponibles
  SIZES: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const,
  
  // Couleurs disponibles
  COLORS: [
    { name: 'Noir', value: '#000000' },
    { name: 'Blanc', value: '#FFFFFF' },
    { name: 'Rouge', value: '#EF4444' },
    { name: 'Bleu', value: '#3B82F6' },
    { name: 'Vert', value: '#10B981' },
    { name: 'Rose', value: '#EC4899' },
    { name: 'Gris', value: '#6B7280' },
    { name: 'Beige', value: '#D2B48C' }
  ] as const,
  
  // Catégories
  CATEGORIES: [
    { id: 'homme', label: 'Homme' },
    { id: 'femme', label: 'Femme' },
    { id: 'unisexe', label: 'Unisexe' }
  ] as const,
  
  // Types de produits
  PRODUCT_TYPES: [
    { id: 'hauts', label: 'Hauts' },
    { id: 'bas', label: 'Bas' },
    { id: 'accessoires', label: 'Accessoires' }
  ] as const,
  
  // Statuts de commande
  ORDER_STATUSES: {
    pending: 'En attente',
    confirmed: 'Confirmée',
    processing: 'En préparation',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée',
    returned: 'Retournée'
  } as const,
  
  // Méthodes de paiement
  PAYMENT_METHODS: {
    card: 'Carte bancaire',
    paypal: 'PayPal',
    apple_pay: 'Apple Pay',
    google_pay: 'Google Pay'
  } as const
} as const;

// Messages d'erreur
export const ERROR_MESSAGES = {
  // Authentification
  INVALID_CREDENTIALS: 'Email ou mot de passe incorrect',
  EMAIL_REQUIRED: 'L\'email est requis',
  PASSWORD_REQUIRED: 'Le mot de passe est requis',
  PASSWORD_TOO_SHORT: 'Le mot de passe doit contenir au moins 8 caractères',
  EMAIL_INVALID: 'Format d\'email invalide',
  
  // Réseau
  NETWORK_ERROR: 'Erreur de connexion réseau',
  SERVER_ERROR: 'Erreur serveur, veuillez réessayer',
  TIMEOUT_ERROR: 'Délai d\'attente dépassé',
  
  // Panier
  CART_ITEM_NOT_FOUND: 'Article non trouvé dans le panier',
  INVALID_QUANTITY: 'Quantité invalide',
  MAX_QUANTITY_EXCEEDED: 'Quantité maximale dépassée',
  
  // Produits
  PRODUCT_NOT_FOUND: 'Produit non trouvé',
  OUT_OF_STOCK: 'Produit en rupture de stock',
  
  // Général
  REQUIRED_FIELD: 'Ce champ est requis',
  INVALID_FORMAT: 'Format invalide',
  UNKNOWN_ERROR: 'Une erreur inattendue s\'est produite'
} as const;

// Messages de succès
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Connexion réussie',
  LOGOUT_SUCCESS: 'Déconnexion réussie',
  REGISTER_SUCCESS: 'Inscription réussie',
  PRODUCT_ADDED_TO_CART: 'Produit ajouté au panier',
  PRODUCT_ADDED_TO_WISHLIST: 'Produit ajouté aux favoris',
  ORDER_PLACED: 'Commande passée avec succès',
  PROFILE_UPDATED: 'Profil mis à jour',
  PASSWORD_CHANGED: 'Mot de passe modifié'
} as const;

// Regex patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
  POSTAL_CODE: /^\d{5}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
} as const;

// Types dérivés pour TypeScript
export type Category = typeof BUSINESS_CONSTANTS.CATEGORIES[number]['id'];
export type ProductType = typeof BUSINESS_CONSTANTS.PRODUCT_TYPES[number]['id'];
export type Size = typeof BUSINESS_CONSTANTS.SIZES[number];
export type OrderStatus = keyof typeof BUSINESS_CONSTANTS.ORDER_STATUSES;
export type PaymentMethod = keyof typeof BUSINESS_CONSTANTS.PAYMENT_METHODS;