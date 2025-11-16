import { createContext, useContext, useState, useEffect, useMemo, useCallback  } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Product } from '../types';

interface GuestCartItem {
  productId: number;
  quantity: number;
  name?: string;
  price?: number;
  image?: string;
  // optional full product object when available
  product?: Product;
}

interface CartContextType {
  cartItemsCount: number;
  cartTotal: number;
  guestCart: GuestCartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addToCart: (data: { productId?: number; product_id?: number; product?: Product; quantity: number; name?: string; price?: number; image?: string; size?:string; color?:string }) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
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

  const addToCart = useCallback((data: { productId?: number; product_id?: number; product?: Product; quantity: number; name?: string; price?: number; image?: string; size?:string; color?:string }) => {
    console.log('🛒 CartContext.addToCart called with:', data);
    
    if (!isAuthenticated) {
      setGuestCart(prevCart => {
        const productId = data.product_id || data.productId || data.product?.id;
        const name = data.name ?? data.product?.name;
        const price = data.price ?? data.product?.price;
        const image = data.image ?? (data.product && Array.isArray(data.product.images) ? data.product.images[0] : undefined);

        const newItem: GuestCartItem = {
          productId: productId as number,
          quantity: data.quantity,
          name,
          price,
          image,
          product: data.product
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

  const clearCart = useCallback(() => {
    setGuestCart([]);
    localStorage.removeItem('guestCart');
  }, []);

  const cartItemsCount = guestCart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = guestCart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  const contextValue = useMemo(() => ({
    cartItemsCount,
    guestCart,
    isOpen,
    setIsOpen,
    addToCart,
    removeFromCart,
    cartTotal,
    clearCart
  }), [cartItemsCount, guestCart, isOpen, cartTotal, addToCart, removeFromCart, clearCart]);

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