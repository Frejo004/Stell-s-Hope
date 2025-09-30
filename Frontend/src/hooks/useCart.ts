import { useState, useEffect, useMemo } from 'react';
import { CartItem, Product } from '../types';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Erreur parsing cart:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
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