import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';

interface GuestCartItem {
  productId: number;
  quantity: number;
  name?: string;
  price?: number;
  image?: string;
}

interface CartContextType {
  cartItemsCount: number;
  guestCart: GuestCartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addToCart: (data: { productId: number; quantity: number; name?: string; price?: number; image?: string }) => void;
  removeFromCart: (productId: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [guestCart, setGuestCart] = useState<GuestCartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  // Charger le panier invité depuis localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      const saved = localStorage.getItem('guestCart');
      if (saved) {
        setGuestCart(JSON.parse(saved));
      }
    }
  }, [isAuthenticated]);

  const addToCart = useCallback((data: { productId: number; quantity: number; name?: string; price?: number; image?: string }) => {
    console.log('🛒 CartContext.addToCart called with:', data);
    
    if (!isAuthenticated) {
      setGuestCart(prevCart => {
        const newItem = {
          productId: data.productId,
          quantity: data.quantity,
          name: data.name,
          price: data.price,
          image: data.image
        };
        
        const existingIndex = prevCart.findIndex(item => item.productId === newItem.productId);
        let updatedCart;
        
        if (existingIndex >= 0) {
          updatedCart = [...prevCart];
          updatedCart[existingIndex].quantity += newItem.quantity;
        } else {
          updatedCart = [...prevCart, newItem];
        }
        
        localStorage.setItem('guestCart', JSON.stringify(updatedCart));
        console.log('✅ Guest cart updated:', updatedCart);
        return updatedCart;
      });
    }
  }, [isAuthenticated]);

  const removeFromCart = useCallback((productId: number) => {
    setGuestCart(prevCart => {
      const updatedCart = prevCart.filter(item => item.productId !== productId);
      localStorage.setItem('guestCart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  }, []);

  const cartItemsCount = guestCart.reduce((sum, item) => sum + item.quantity, 0);

  const contextValue = useMemo(() => ({
    cartItemsCount,
    guestCart,
    isOpen,
    setIsOpen,
    addToCart,
    removeFromCart
  }), [cartItemsCount, guestCart, isOpen, addToCart, removeFromCart]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};