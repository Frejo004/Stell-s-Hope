import { useState, useRef, useEffect, useMemo } from 'react';
import { Heart, Star, ShoppingCart, Check } from 'lucide-react';
import { Product } from '../types';
import { useWishlist } from '../contexts/WishlistContext';
import { useCartContext } from '../contexts/CartContext';
import { getProductImageUrl } from '../utils/imageUtils';

import { formatPrice } from '../utils';
interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

export default function ProductCard({ product, onProductClick }: ProductCardProps) {
  const { addToWishlist, removeFromWishlist, isProductInWishlist } = useWishlist();
  const { addToCart, cart } = useCartContext();
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Image loading state
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const inWishlist = isProductInWishlist(product.id);
  const isItemInCart = cart.some((item: any) => item.productId === product.id);
  const imageUrl = useMemo(() => getProductImageUrl(product), [product]);

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
      className="group cursor-pointer relative flex flex-col"
      onClick={() => onProductClick(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-[#F3EFEA] rounded-2xl aspect-[3/4] border border-stone-200/50 shadow-sm transition-all duration-300 group-hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.07)]">
        {/* Skeleton Loader */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-stone-200/60 animate-pulse flex items-center justify-center">
            <span className="sr-only">Chargement...</span>
          </div>
        )}

        {/* Fallback Error Image */}
        {imageError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400">
            <span className="text-3xl">📷</span>
            <span className="text-[11px] mt-1 font-medium">Image indisponible</span>
          </div>
        ) : (
          <img
            ref={imgRef}
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
            className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isNew && (
            <span className="bg-stone-900/90 backdrop-blur-md text-white text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full shadow-sm">
              Nouveau
            </span>
          )}
          {product.isOnSale && (
            <span className="bg-rose-500/90 backdrop-blur-md text-white text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full shadow-sm">
              Promo
            </span>
          )}
          {product.is_bestseller && (
            <span className="bg-amber-600/90 backdrop-blur-md text-white text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full shadow-sm">
              Best-Seller
            </span>
          )}
        </div>

        {/* Wishlist Button (Glass Pill) */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/85 backdrop-blur-md shadow-sm border border-black/5 flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all duration-200 z-10"
          aria-label={inWishlist ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart className={`w-3.5 h-3.5 transition-colors ${inWishlist ? 'fill-rose-500 text-rose-500' : 'text-stone-700'}`} />
        </button>

        {/* Floating Quick Action Pill */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out hidden sm:block">
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || isItemInCart}
            className={`w-full py-2.5 px-4 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 shadow-lg flex items-center justify-center gap-2 border ${
              isItemInCart
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-white/95 backdrop-blur-md text-stone-900 border-white/80 hover:bg-stone-900 hover:text-white hover:border-stone-900'
            }`}
          >
            {isAddingToCart ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Ajout...</span>
              </>
            ) : isItemInCart ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Dans le panier</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Ajouter</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="mt-3.5 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xs sm:text-sm font-medium text-stone-900 group-hover:text-stone-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          {product.rating && (
            <div className="flex items-center space-x-1 shrink-0 bg-stone-100/80 px-1.5 py-0.5 rounded-full">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              <span className="text-[10px] font-semibold text-stone-700">
                {product.rating}
              </span>
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="flex items-baseline space-x-2 pt-0.5">
          <span className="text-sm sm:text-base font-bold text-stone-950">
            {formatPrice(product.price || 0)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-stone-400 line-through decoration-stone-300">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Color Swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center space-x-1.5 pt-1">
            {product.colors.slice(0, 4).map((color, index) => (
              <div
                key={index}
                className="w-3 h-3 rounded-full border border-stone-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-transform hover:scale-125"
                title={color}
                style={{
                  backgroundColor: color.toLowerCase() === 'blanc' ? '#ffffff' :
                    color.toLowerCase() === 'noir' ? '#121212' :
                      color.toLowerCase() === 'bleu marine' ? '#1e3a8a' :
                        color.toLowerCase() === 'rose poudré' ? '#f472b6' :
                          color.toLowerCase() === 'gris' ? '#78716c' :
                            color.toLowerCase() === 'camel' ? '#b45309' :
                              color.toLowerCase() === 'bordeaux' ? '#881337' :
                                color
                }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-stone-400 font-medium leading-none self-center">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}