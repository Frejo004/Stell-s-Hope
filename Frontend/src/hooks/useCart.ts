import { useState, useEffect } from 'react';
import { cartService, AddToCartData, UpdateCartData, RemoveFromCartData } from '../services/cartService';
import { useAuth } from '../contexts/AuthContext';
import { CartItem } from '../types';

interface GuestCartItem {
  productId: number;
  quantity: number;
  name?: string;
  price?: number;
  image?: string;
}

export const useCart = () => {
  const [cart, setCart] = useState<{ items: CartItem[]; total: number; count: number }>({ 
    items: [], 
    total: 0, 
    count: 0 
  });
  const [guestCart, setGuestCart] = useState<GuestCartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { isAuthenticated } = useAuth();

  // Charger le panier invité depuis localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      const saved = localStorage.getItem('guestCart');
      if (saved) {
        const guestItems = JSON.parse(saved);
        setGuestCart(guestItems);
        setCart({
          items: [],
          total: 0,
          count: guestItems.reduce((sum: number, item: GuestCartItem) => sum + item.quantity, 0)
        });
      }
    }
  }, [isAuthenticated]);

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
    console.log('🛒 useCart.addToCart called with:', data);
    console.log('isAuthenticated:', isAuthenticated);
    console.log('Current guestCart:', guestCart);
    
    if (!isAuthenticated) {
      console.log('👥 User not authenticated, using guest cart');
      // Panier invité
      const newItem: GuestCartItem = {
        productId: data.productId || data.product_id,
        quantity: data.quantity
      };
      
      console.log('New item to add:', newItem);
      
      const existingIndex = guestCart.findIndex(item => item.productId === newItem.productId);
      let updatedCart;
      
      if (existingIndex >= 0) {
        console.log('Item exists, updating quantity');
        updatedCart = [...guestCart];
        updatedCart[existingIndex].quantity += newItem.quantity;
      } else {
        console.log('New item, adding to cart');
        updatedCart = [...guestCart, newItem];
      }
      
      console.log('Updated cart:', updatedCart);
      
      setGuestCart(updatedCart);
      localStorage.setItem('guestCart', JSON.stringify(updatedCart));
      
      const newCount = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
      console.log('New cart count:', newCount);
      
      setCart({
        items: [],
        total: 0,
        count: newCount
      });
      

      
      console.log('✅ Guest cart updated successfully');
      return;
    }

    console.log('🔐 User authenticated, using API');
    try {
      await cartService.addToCart(data);
      await fetchCart();
      console.log('✅ API cart updated successfully');
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      throw error;
    }
  };

  const updateCart = async (data: UpdateCartData) => {
    if (!isAuthenticated) {
      // Mise à jour panier invité
      const updatedCart = guestCart.map(item => 
        item.productId === data.productId ? { ...item, quantity: data.quantity } : item
      );
      setGuestCart(updatedCart);
      localStorage.setItem('guestCart', JSON.stringify(updatedCart));
      
      setCart({
        items: [],
        total: 0,
        count: updatedCart.reduce((sum, item) => sum + item.quantity, 0)
      });
      return;
    }

    try {
      await cartService.updateCart(data);
      await fetchCart();
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (data: RemoveFromCartData) => {
    if (!isAuthenticated) {
      // Suppression panier invité
      const updatedCart = guestCart.filter(item => item.productId !== data.productId);
      setGuestCart(updatedCart);
      localStorage.setItem('guestCart', JSON.stringify(updatedCart));
      
      setCart({
        items: [],
        total: 0,
        count: updatedCart.reduce((sum, item) => sum + item.quantity, 0)
      });
      return;
    }

    try {
      await cartService.removeFromCart(data);
      await fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      setGuestCart([]);
      localStorage.removeItem('guestCart');
      setCart({ items: [], total: 0, count: 0 });
      return;
    }

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

  const cartItemsCount = isAuthenticated ? cart.count : guestCart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart,
    guestCart,
    loading,
    addToCart,
    updateCart,
    removeFromCart,
    clearCart,
    refetch: fetchCart,
    cartItemsCount,
    isOpen,
    setIsOpen
  };
};