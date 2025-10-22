
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Product } from '../types';
import { useAuth } from '../hooks/useAuth';
import { getWishlist, addToWishlist as apiAddToWishlist, removeFromWishlist as apiRemoveFromWishlist } from '../services/wishlistService';

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  isProductInWishlist: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          const userWishlist = await getWishlist();
          setWishlist(userWishlist);
        } catch (error) {
          console.error('Failed to fetch wishlist:', error);
        }
      } else {
        // Charger depuis localStorage si pas connecté
        const saved = localStorage.getItem('wishlist');
        if (saved) {
          setWishlist(JSON.parse(saved));
        } else {
          setWishlist([]);
        }
      }
    };

    fetchWishlist();
  }, [user]);

  const addToWishlist = async (product: Product) => {
    if (user) {
      try {
        await apiAddToWishlist(product.id);
        setWishlist(prev => [...prev, product]);
      } catch (error) {
        console.error('Failed to add to wishlist:', error);
      }
    } else {
      // Utiliser localStorage si pas connecté
      const newWishlist = [...wishlist, product];
      setWishlist(newWishlist);
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    }
  };

  const removeFromWishlist = async (productId: number) => {
    if (user) {
      try {
        await apiRemoveFromWishlist(productId);
        setWishlist(prev => prev.filter(p => p.id !== productId));
      } catch (error) {
        console.error('Failed to remove from wishlist:', error);
      }
    } else {
      // Utiliser localStorage si pas connecté
      const newWishlist = wishlist.filter(p => p.id !== productId);
      setWishlist(newWishlist);
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    }
  };

  const isProductInWishlist = (productId: number) => {
    return wishlist.some(p => p.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isProductInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
