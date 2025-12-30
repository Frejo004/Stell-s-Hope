import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Product } from '../types';
import { cartService } from '../services/cartService';
import { eventBus } from '../utils/eventBus';

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
  addToCart: (data: { productId?: number; product_id?: number; product?: Product; quantity: number; name?: string; price?: number; image?: string; size?: string; color?: string }) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [guestCart, setGuestCart] = useState<GuestCartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  // Charger le panier (invité ou DB selon l'auth)
  const fetchCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const data = await cartService.getCart();
        // Adapter le format DB au format GuestCartItem pour l'UI si nécessaire
        // ou simplement utiliser des états séparés
        const items = data.items.map((item: any) => ({
          productId: item.product?.id || item.product_id,
          quantity: item.quantity,
          name: item.product?.name,
          price: item.product?.price,
          image: item.product?.images?.[0],
          product: item.product
        }));
        setGuestCart(items as GuestCartItem[]);
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
      }
    } else {
      const saved = localStorage.getItem('guestCart');
      if (saved) {
        setGuestCart(JSON.parse(saved));
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(async (data: { productId?: number; product_id?: number; product?: Product; quantity: number; name?: string; price?: number; image?: string; size?: string; color?: string }) => {
    console.log('🛒 CartContext.addToCart called with:', data);

    const productId = data.product_id || data.productId || data.product?.id;
    if (!productId) return;

    if (isAuthenticated) {
      try {
        await cartService.addToCart({
          product_id: productId,
          quantity: data.quantity
        });
        await fetchCart();
        eventBus.emit('show-toast', {
          message: 'Produit ajouté au panier !',
          type: 'success'
        });
        setIsOpen(true);
      } catch (error) {
        console.error('Erreur lors de l\'ajout au panier (DB):', error);
      }
    } else {
      setGuestCart(prevCart => {
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

        eventBus.emit('show-toast', {
          message: 'Produit ajouté au panier (invité) !',
          type: 'success'
        });
        setIsOpen(true);
        return updatedCart;
      });
    }
  }, [isAuthenticated, fetchCart]);

  const removeFromCart = useCallback(async (productId: number) => {
    if (isAuthenticated) {
      try {
        await cartService.removeFromCart({ productId });
        await fetchCart();
      } catch (error) {
        console.error('Erreur retrait panier:', error);
      }
    } else {
      setGuestCart(prevCart => {
        const updatedCart = prevCart.filter(item => item.productId !== productId);
        localStorage.setItem('guestCart', JSON.stringify(updatedCart));
        return updatedCart;
      });
    }
  }, [isAuthenticated, fetchCart]);

  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await cartService.clearCart();
        await fetchCart();
      } catch (error) {
        console.error('Erreur vidage panier:', error);
      }
    } else {
      setGuestCart([]);
      localStorage.removeItem('guestCart');
    }
  }, [isAuthenticated, fetchCart]);

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