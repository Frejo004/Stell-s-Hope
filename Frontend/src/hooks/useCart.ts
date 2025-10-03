import { useState, useEffect, useMemo, useCallback } from 'react';
import { CartItem, Product } from '../types';

// Constantes pour la gestion du localStorage
const CART_STORAGE_KEY = 'cart';
const MAX_QUANTITY = 99;

// Utilitaire pour valider les données du panier
const validateCartItem = (item: any): item is CartItem => {
  return (
    item &&
    typeof item === 'object' &&
    item.product &&
    typeof item.product.id === 'string' &&
    typeof item.size === 'string' &&
    typeof item.color === 'string' &&
    typeof item.quantity === 'number' &&
    item.quantity > 0 &&
    item.quantity <= MAX_QUANTITY
  );
};

// Utilitaire pour sauvegarder le panier
const saveCartToStorage = (cart: CartItem[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du panier:', error);
  }
};

// Utilitaire pour charger le panier
const loadCartFromStorage = (): CartItem[] => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      if (Array.isArray(parsedCart)) {
        return parsedCart.filter(validateCartItem);
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement du panier:', error);
    localStorage.removeItem(CART_STORAGE_KEY);
  }
  return [];
};

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadedCart = loadCartFromStorage();
    setCart(loadedCart);
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  const addToCart = (product: Product, size: string, color: string, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(
        item => item.product.id === product.id && item.size === size && item.color === color
      );

      if (existingItem) {
        return prevCart.map(item =>
          item === existingItem
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevCart, { product, size, color, quantity }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setCart(prevCart =>
      prevCart.filter(
        item => !(item.product.id === productId && item.size === size && item.color === color)
      )
    );
  };

  const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = useMemo(() => 
    cart.reduce((total, item) => total + (item.product.price * item.quantity), 0),
    [cart]
  );
  const cartItemsCount = useMemo(() => 
    cart.reduce((count, item) => count + item.quantity, 0),
    [cart]
  );

  return {
    cart,
    isOpen,
    setIsOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartItemsCount
  };
};