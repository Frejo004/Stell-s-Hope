import { useState, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from '../contexts/AuthContext';

export const useCart = () => {
  const [cart, setCart] = useState({ items: [], total: 0, count: 0 });
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

  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      await cartService.addToCart(productId, quantity);
      await fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const updateCart = async (productId: number, quantity: number) => {
    try {
      await cartService.updateCart(productId, quantity);
      await fetchCart();
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      await cartService.removeFromCart(productId);
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
    refetch: fetchCart
  };
};