import { Heart, ShoppingBag, ArrowLeft, Trash2, Sparkles, ChevronRight } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCartContext } from '../contexts/CartContext';
import { Product } from '../types';
import { getImageUrl } from '../utils/imageUtils';
import { formatPrice } from '../utils';
import { useNavigate, Link } from 'react-router-dom';
import { eventBus } from '../utils/eventBus';

interface WishlistPageProps {
  onClose?: () => void;
  onProductClick?: (product: Product) => void;
}

export default function WishlistPage({ onClose, onProductClick }: WishlistPageProps) {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCartContext();
  const navigate = useNavigate();

  const handleProductSelect = (product: Product) => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      product_id: product.id,
      product: product,
      quantity: 1,
      size: product.sizes?.[0] || '',
      color: product.colors?.[0] || ''
    });
    eventBus.emit('show-toast', {
      type: 'success',
      message: `${product.name} a été ajouté à votre panier.`
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 selection:bg-stone-900 selection:text-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-400 mb-6">
          <Link to="/" className="hover:text-stone-950 transition-colors">Accueil</Link>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <Link to="/boutique" className="hover:text-stone-950 transition-colors">Boutique</Link>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <span className="text-stone-900 font-semibold">Mes Favoris</span>
        </nav>

        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10 pb-6 border-b border-stone-200/80">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-stone-100 text-stone-700 border border-stone-200 mb-3">
              <Sparkles className="w-3 h-3 text-terracotta-500" />
              Carnet Privé
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-stone-950">
              Coups de Cœur
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              {wishlist.length} création{wishlist.length > 1 ? 's' : ''} enregistrée{wishlist.length > 1 ? 's' : ''} dans vos favoris
            </p>
          </div>

          <Link
            to="/boutique"
            className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-stone-950 transition-colors"
          >
            <span>Poursuivre mes découvertes</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-20 px-4 max-w-lg mx-auto bg-white rounded-3xl border border-stone-200/80 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-6 text-rose-400 shadow-inner">
              <Heart className="w-9 h-9 stroke-[1.5]" />
            </div>
            <h2 className="font-serif text-2xl font-medium text-stone-950 mb-2">
              Votre carnet de favoris est vide
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mb-8 leading-relaxed">
              Laissez-vous inspirer par nos nouvelles collections et mémorisez vos pièces coup de cœur pour les retrouver aisément.
            </p>
            <Link
              to="/boutique"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-stone-950 text-white text-xs font-semibold tracking-wider uppercase hover:bg-stone-800 transition-all shadow-card-luxury"
            >
              <span>Découvrir la collection</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-card-luxury transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image 3:4 */}
                <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
                  <img
                    src={getImageUrl(product.images?.[0])}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer"
                    onClick={() => handleProductSelect(product)}
                  />

                  {/* Remove Button */}
                  <button
                    onClick={() => {
                      removeFromWishlist(product.id);
                      eventBus.emit('show-toast', { message: 'Produit retiré des favoris.', type: 'info' });
                    }}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-stone-200/60 shadow-sm flex items-center justify-center text-stone-400 hover:text-red-500 hover:bg-white transition-all"
                    aria-label="Retirer de ma sélection"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {product.isNew && (
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-stone-950/80 backdrop-blur-sm text-white">
                      Nouveau
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-1">
                      {product.category?.name || 'Atelier'}
                    </p>
                    <h3
                      onClick={() => handleProductSelect(product)}
                      className="font-serif text-base font-medium text-stone-900 group-hover:text-terracotta-600 transition-colors cursor-pointer line-clamp-1"
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="font-serif text-base font-semibold text-stone-950">
                        {formatPrice(product.price || 0)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-stone-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full py-3 px-4 rounded-2xl bg-stone-950 text-white text-xs font-semibold tracking-wider uppercase hover:bg-stone-800 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.99]"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
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