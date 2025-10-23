import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface GuestCartItem {
  productId: number;
  quantity: number;
}

interface CartContextType {
  cartItemsCount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addToCart: (data: { productId: number; quantity: number }) => void;
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

  const addToCart = (data: { productId: number; quantity: number }) => {
    console.log('🛒 CartContext.addToCart called with:', data);
    
    if (!isAuthenticated) {
      const newItem = {
        productId: data.productId,
        quantity: data.quantity
      };
      
      const existingIndex = guestCart.findIndex(item => item.productId === newItem.productId);
      let updatedCart;
      
      if (existingIndex >= 0) {
        updatedCart = [...guestCart];
        updatedCart[existingIndex].quantity += newItem.quantity;
      } else {
        updatedCart = [...guestCart, newItem];
      }
      
      setGuestCart(updatedCart);
      localStorage.setItem('guestCart', JSON.stringify(updatedCart));
      console.log('✅ Guest cart updated:', updatedCart);
    }
  };

  const cartItemsCount = guestCart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItemsCount,
      isOpen,
      setIsOpen,
      addToCart
    }}>
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