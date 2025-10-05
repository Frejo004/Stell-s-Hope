import { useState, useEffect } from 'react';
import { cartService, AddToCartData, UpdateCartData, RemoveFromCartData } from '../services/cartService';
import { useAuth } from '../contexts/AuthContext';
import { CartItem } from '../types';

export const useCart = () => {
  const [cart, setCart] = useState<{ items: CartItem[]; total: number; count: number }>({ 
    items: [], 
    total: 0, 
    count: 0 
  });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (data: AddToCartData) => {
    try {
      await cartService.addToCart(data);
      await fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const updateCart = async (data: UpdateCartData) => {
    try {
      await cartService.updateCart(data);
      await fetchCart();
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (data: RemoveFromCartData) => {
    try {
      await cartService.removeFromCart(data);
      await fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      await fetchCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  return {
    cart,
    loading,
    addToCart,
    updateCart,
    removeFromCart,
    clearCart,
    refetch: fetchCart,
    cartItemsCount: cart.count,
    setIsOpen: () => {} // Placeholder pour compatibilité
  };
};