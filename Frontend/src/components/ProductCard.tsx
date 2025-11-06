;
import { useState } from 'react';
import { Heart, Star, ShoppingCart, Check } from 'lucide-react';
import { Product } from '../types';
import { useWishlist } from '../contexts/WishlistContext';
import { useCartContext } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

export default function ProductCard({ product, onProductClick }: ProductCardProps) {
  const { addToWishlist, removeFromWishlist, isProductInWishlist } = useWishlist();
  const { addToCart, guestCart } = useCartContext();
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const inWishlist = isProductInWishlist(product.id);
  const isItemInCart = guestCart.some(item => item.productId === product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAddingToCart) return;
    
    setIsAddingToCart(true);
    try {
      addToCart({
        productId: product.id,
        quantity: 1,
        name: product.name,
        price: product.price,
        image: product.images?.[0]
      });
      
      // Réinitialiser l'état après 2 secondes
      setTimeout(() => {
        setIsAddingToCart(false);
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      setIsAddingToCart(false);
    }
  };

  return (
    <div 
      className="group cursor-pointer relative" 
      onClick={() => onProductClick(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden bg-gray-200 rounded-lg aspect-[3/4]">
        <img
          src={product.images && product.images.length > 0 ? product.images[0] : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            console.log('Image error for product:', product.name, 'URL:', e.currentTarget.src, 'Images array:', product.images);
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmY2NjY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVycm9yPC90ZXh0Pjwvc3ZnPg==';
          }}
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
          {product.is_bestseller && (
            <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
              BEST-SELLER
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button 
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md opacity-100 transition-opacity duration-300 hover:bg-gray-50"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>

        {/* Quick view on hover */}
        <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <div className="flex flex-col space-y-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onProductClick(product);
              }}
              className="w-full bg-white text-black py-2 px-4 rounded font-medium hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <span>Voir les détails</span>
            </button>
            
            <button 
              onClick={handleAddToCart}
              disabled={isAddingToCart || isItemInCart}
              className={`w-full py-2 px-4 rounded font-medium transition-colors flex items-center justify-center space-x-2 ${
                isItemInCart
                  ? 'bg-green-100 text-green-700'
                  : 'bg-rose-500 text-white hover:bg-rose-600'
              }`}
            >
              {isAddingToCart ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Ajout en cours...</span>
                </>
              ) : isItemInCart ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Ajouté au panier</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Ajouter au panier</span>
                </>
              )}
            </button>
          </div>
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