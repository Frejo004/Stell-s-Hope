import React from 'react';
import { ArrowLeft, Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../hooks/useCart';
import { Product } from '../types';

interface WishlistPageProps {
  onClose: () => void;
  onProductClick: (product: Product) => void;
}

export default function WishlistPage({ onClose, onProductClick }: WishlistPageProps) {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    // Assurez-vous que les tailles et couleurs existent avant de les utiliser
    const size = product.sizes?.[0] || '';
    const color = product.colors?.[0] || '';
    addToCart(product, size, color, 1);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mes Favoris</h1>
          <p className="text-gray-600">{wishlist.length} produit{wishlist.length > 1 ? 's' : ''}</p>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Votre liste est vide</h2>
            <p className="text-gray-600 mb-6">Ajoutez vos produits préférés pour les retrouver facilement</p>
            <button 
              onClick={onClose}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900"
            >
              Découvrir nos produits
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div key={product.id} className="group relative">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => onProductClick(product)}
                  />
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                  >
                    <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <h3 
                    className="font-medium cursor-pointer hover:text-rose-300"
                    onClick={() => onProductClick(product)}
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{Number(product.price || 0).toFixed(2)}€</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {Number(product.originalPrice || 0).toFixed(2)}€
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full flex items-center justify-center space-x-2 bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Ajouter au panier</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}