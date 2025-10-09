import React from 'react';
import { Heart, Star } from 'lucide-react';
import { Product } from '../types';
import { useWishlist } from '../hooks/useWishlist';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

export default function ProductCard({ product, onProductClick }: ProductCardProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  return (
    <div className="group cursor-pointer" onClick={() => onProductClick(product)}>
      <div className="relative overflow-hidden bg-gray-200 rounded-lg aspect-[3/4]">
        <img
          src={product.images?.[0] || '/placeholder.jpg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-black text-white text-xs px-2 py-1 rounded">
              NOUVEAU
            </span>
          )}
          {product.isOnSale && (
            <span className="bg-rose-300 text-white text-xs px-2 py-1 rounded">
              PROMO
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
              BEST-SELLER
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button 
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>

        {/* Quick view on hover */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onProductClick(product);
            }}
            className="w-full bg-white text-black py-2 px-4 rounded font-medium hover:bg-gray-100 transition-colors"
          >
            Aperçu rapide
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900 group-hover:text-rose-300 transition-colors">
            {product.name}
          </h3>
          {product.rating && (
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-600">
                {product.rating} ({product.reviewCount || 0})
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-gray-900">
            {Number(product.price || 0).toFixed(2)} €
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {Number(product.originalPrice).toFixed(2)} €
            </span>
          )}
        </div>

        {/* Color swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex space-x-1">
            {product.colors.slice(0, 4).map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{
                  backgroundColor: color.toLowerCase() === 'blanc' ? '#ffffff' :
                                 color.toLowerCase() === 'noir' ? '#000000' :
                                 color.toLowerCase() === 'bleu marine' ? '#1e3a8a' :
                                 color.toLowerCase() === 'rose poudré' ? '#f9a8d4' :
                                 color.toLowerCase() === 'gris' ? '#6b7280' :
                                 color.toLowerCase() === 'camel' ? '#d2b48c' :
                                 color.toLowerCase() === 'bordeaux' ? '#7f1d1d' :
                                 '#e5e7eb'
                }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-gray-500 ml-1">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}