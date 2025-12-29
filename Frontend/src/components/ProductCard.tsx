import { useState, useRef, useEffect } from 'react';
import { Heart, Star, ShoppingCart, Check } from 'lucide-react';
import { Product } from '../types';
import { useWishlist } from '../contexts/WishlistContext';
import { useCartContext } from '../contexts/CartContext';
import { getProductImageUrl } from '../utils/imageUtils';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

export default function ProductCard({ product, onProductClick }: ProductCardProps) {
  const { addToWishlist, removeFromWishlist, isProductInWishlist } = useWishlist();
  const { addToCart, guestCart } = useCartContext();
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Image loading state
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const inWishlist = isProductInWishlist(product.id);
  const isItemInCart = guestCart.some(item => item.productId === product.id);

  // Vérifier si l'image est déjà en cache lors du montage
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setImageLoaded(true);
    }
  }, []);

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

        {/* Skeleton Loader */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <span className="sr-only">Chargement...</span>
          </div>
        )}

        {/* Fallback Error Image */}
        {imageError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
            <span className="text-4xl">📷</span>
            <span className="text-xs mt-2">Image indisponible</span>
          </div>
        ) : (
          <img
            ref={imgRef}
            src={getProductImageUrl(product)}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
            className={`w-full h-full object-cover transition-all duration-500 ease-in-out ${
              // Zoom effect on hover
              isHovered ? 'scale-110' : 'scale-100'
              } ${
              // Fade in effect
              imageLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
              }`}
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.isNew && (
            <span className="bg-black text-white text-xs px-2 py-1 rounded shadow-sm">
              NOUVEAU
            </span>
          )}
          {product.isOnSale && (
            <span className="bg-rose-500 text-white text-xs px-2 py-1 rounded shadow-sm">
              PROMO
            </span>
          )}
          {product.is_bestseller && (
            <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded shadow-sm">
              BEST-SELLER
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:bg-gray-50 hover:scale-110 z-10"
          aria-label={inWishlist ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>

        {/* Quick view / Add to cart overlay */}
        <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 transition-all duration-300 transform ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
          <div className="flex flex-col space-y-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onProductClick(product);
              }}
              className="w-full bg-white/95 backdrop-blur-sm text-black py-2.5 px-4 rounded font-medium hover:bg-white transition-colors flex items-center justify-center shadow-lg"
            >
              <span>Voir les détails</span>
            </button>

            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || isItemInCart}
              className={`w-full py-2.5 px-4 rounded font-medium transition-all shadow-lg flex items-center justify-center space-x-2 ${isItemInCart
                  ? 'bg-green-500 text-white'
                  : 'bg-rose-500 text-white hover:bg-rose-600'
                }`}
            >
              {isAddingToCart ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Ajout...</span>
                </>
              ) : isItemInCart ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Dans le panier</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Ajouter</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium text-gray-900 group-hover:text-rose-500 transition-colors line-clamp-2 leading-tight">
            {product.name}
          </h3>
          {product.rating && (
            <div className="flex items-center space-x-1 shrink-0 bg-gray-50 px-1.5 py-0.5 rounded">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium text-gray-600">
                {product.rating}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-baseline space-x-2 pt-1">
          <span className="text-lg font-bold text-gray-900">
            {Number(product.price || 0).toFixed(2)} €
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through decoration-gray-400">
              {Number(product.originalPrice).toFixed(2)} €
            </span>
          )}
        </div>

        {/* Color swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex space-x-1.5 pt-1">
            {product.colors.slice(0, 4).map((color, index) => (
              <div
                key={index}
                className="w-3.5 h-3.5 rounded-full border border-gray-200 shadow-sm"
                title={color}
                style={{
                  backgroundColor: color.toLowerCase() === 'blanc' ? '#ffffff' :
                    color.toLowerCase() === 'noir' ? '#000000' :
                      color.toLowerCase() === 'bleu marine' ? '#1e3a8a' :
                        color.toLowerCase() === 'rose poudré' ? '#f9a8d4' :
                          color.toLowerCase() === 'gris' ? '#6b7280' :
                            color.toLowerCase() === 'camel' ? '#d2b48c' :
                              color.toLowerCase() === 'bordeaux' ? '#7f1d1d' :
                                color
                }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-gray-400 leading-none self-center">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}