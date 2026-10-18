import { useState, useMemo, useEffect } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { Star, Heart, Truck, RotateCcw, ShieldCheck, Plus, Minus, Share2, ChevronLeft, ChevronRight, ArrowLeft, Check, Sparkles, MessageSquarePlus, X } from 'lucide-react';
import { Product } from '../types';
import { useCartContext } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../hooks/useAuth';
import { getImageUrl } from '../utils/imageUtils';
import { reviews } from '../data/reviews';
import { products } from '../data/products';
import ProductCard from './ProductCard';
import { formatPrice } from '../utils';
import { BUSINESS_CONSTANTS } from '../constants';
import SEO from './SEO';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

export default function ProductDetail({ product, onClose }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(product.colors && product.colors.length > 0 ? product.colors[0] : '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'composition' | 'entretien' | 'avis'>('description');
  const [sortOrder, setSortOrder] = useState('recent');
  const [filterRating, setFilterRating] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const { addToCart } = useCartContext();
  const { isProductInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const inWishlist = isProductInWishlist(product.id);

  const getImageSrc = (imagePath: string) => {
    return getImageUrl(imagePath);
  };

  const { isAuthenticated } = useAuth();
  const [liveReviews, setLiveReviews] = useState<any[]>([]);
  const [apiAverage, setApiAverage] = useState<number | null>(null);
  const [apiCount, setApiCount] = useState<number | null>(null);
  const [apiBreakdown, setApiBreakdown] = useState<Record<number, number> | null>(null);

  // Modal de dépôt d'avis
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewFeedback, setReviewFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    import('../services/api').then(({ default: api }) => {
      api.get(`/products/${product.id}/reviews`)
        .then(res => {
          if (res.data && res.data.reviews) {
            setLiveReviews(res.data.reviews);
            setApiAverage(res.data.average_rating);
            setApiCount(res.data.total_reviews);
            if (res.data.breakdown) {
              setApiBreakdown(res.data.breakdown);
            }
          }
        })
        .catch(err => {
          console.warn('Erreur chargement avis API:', err);
        });
    });
  }, [product.id]);

  const productReviews = useMemo(() => {
    if (liveReviews.length > 0) {
      return liveReviews.map(r => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        customerName: r.author,
        verified_purchase: r.verified_purchase,
        date: r.date,
        created_at: r.date
      }));
    }
    return reviews.filter(review => review.product_id === product.id);
  }, [liveReviews, product.id]);

  const relatedProducts = products.filter(p =>
    p.category_id === product.category_id && p.id !== product.id
  ).slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes && product.sizes.length > 1) {
      alert('Veuillez sélectionner une taille');
      return;
    }

    try {
      addToCart({
        product_id: product.id,
        product: product,
        quantity,
        size: selectedSize || (product.sizes?.[0] ?? ''),
        color: selectedColor || (product.colors?.[0] ?? '')
      });

      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2500);
    } catch (error) {
      console.error('Erreur ajout au panier:', error);
    }
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const ratingDistribution = useMemo(() => {
    if (apiBreakdown) return apiBreakdown;
    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    productReviews.forEach(review => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1;
    });
    return distribution;
  }, [apiBreakdown, productReviews]);

  const finalAverage = apiAverage !== null ? apiAverage : (product.rating || 5);
  const finalReviewCount = apiCount !== null ? apiCount : productReviews.length;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingReview(true);
      setReviewFeedback(null);
      const { default: api } = await import('../services/api');
      const res = await api.post('/reviews', {
        product_id: product.id,
        rating: newRating,
        comment: newComment.trim()
      });
      setReviewFeedback({
        type: 'success',
        message: res.data.message || 'Merci ! Votre avis a été soumis avec succès.'
      });
      setTimeout(() => {
        setIsReviewModalOpen(false);
        setReviewFeedback(null);
        setNewComment('');
        setNewRating(5);
      }, 2500);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Une erreur est survenue. Veuillez vérifier votre connexion ou vous identifier.';
      setReviewFeedback({ type: 'error', message: msg });
    } finally {
      setSubmittingReview(false);
    }
  };

  const filteredAndSortedReviews = useMemo(() => {
    return productReviews
      .filter(review => filterRating === 0 || review.rating === filterRating)
      .sort((a, b) => {
        if (sortOrder === 'recent') {
          return new Date(b.date || b.created_at).getTime() - new Date(a.date || a.created_at).getTime();
        }
        return b.rating - a.rating;
      });
  }, [productReviews, sortOrder, filterRating]);

  const currentImageSrc = getImageSrc(
    product.images?.[selectedImage] || product.images?.[0] || ''
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 pb-20">
      <SEO
        title={product.name}
        description={product.description || `Découvrez ${product.name} de la Maison Stell's Hope.`}
        image={currentImageSrc}
        type="product"
      />

      {/* ─── Breadcrumb / Navigation supérieure ────────────────────── */}
      <div className="border-b border-stone-200/60 bg-white/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-stone-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à la boutique</span>
          </button>

          <div className="hidden sm:flex items-center space-x-2 text-xs text-stone-500 font-light truncate max-w-md">
            <span>Boutique</span>
            <span>/</span>
            <span className="capitalize">{product.category_id || 'Collection'}</span>
            <span>/</span>
            <span className="text-stone-950 font-medium truncate">{product.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleWishlistToggle}
              className="p-2 rounded-full border border-stone-200 hover:bg-stone-50 transition-colors"
              aria-label="Ajouter aux favoris"
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500 text-rose-500' : 'text-stone-700'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* ─── Galerie d'Images (7 colonnes) ───────────────────────── */}
          <div className="lg:col-span-7 space-y-4">
            {/* Image Principale */}
            <div className="relative aspect-[4/5] bg-[#F3EFEA] rounded-3xl overflow-hidden border border-stone-200/60 shadow-sm group">
              <Zoom>
                <img
                  src={currentImageSrc}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjNFRkVBIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzc4NzE2YyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlBob3RvIGluZGlzcG9uaWJsZTwvdGV4dD48L3N2Zz4=';
                  }}
                />
              </Zoom>

              {/* Badges Flottants */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
                {product.isNew && (
                  <span className="bg-stone-900/90 backdrop-blur-md text-white text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full shadow-sm">
                    Nouveau
                  </span>
                )}
                {product.isOnSale && (
                  <span className="bg-rose-500/90 backdrop-blur-md text-white text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full shadow-sm">
                    Vente Privée
                  </span>
                )}
              </div>

              {/* Flèches de navigation de photos */}
              {product.images && product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-stone-200/60 flex items-center justify-center text-stone-800 opacity-0 group-hover:opacity-100 hover:bg-stone-950 hover:text-white transition-all shadow-sm"
                    aria-label="Image précédente"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev + 1) % product.images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-stone-200/60 flex items-center justify-center text-stone-800 opacity-0 group-hover:opacity-100 hover:bg-stone-950 hover:text-white transition-all shadow-sm"
                    aria-label="Image suivante"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Rangée de Miniatures */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                {product.images.map((image, index) => {
                  const isSelected = selectedImage === index;
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-24 rounded-2xl overflow-hidden shrink-0 border-2 transition-all duration-200 ${
                        isSelected ? 'border-stone-950 scale-105 shadow-md' : 'border-stone-200/70 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={getImageSrc(image)}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover object-center"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ─── Informations & Panier Sticky (5 colonnes) ───────────── */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 bg-stone-100 text-stone-700 rounded-full">
                  Pièce d'Exception
                </span>
                {product.rating && (
                  <div className="flex items-center gap-1 text-xs text-stone-600 font-medium">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-stone-400">({product.reviewCount || 0} avis)</span>
                  </div>
                )}
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-950 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Prix */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-3xl font-bold text-stone-950">
                  {formatPrice(product.price || 0)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-stone-400 line-through decoration-stone-300">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed pt-1">
                {product.description}
              </p>
            </div>

            {/* Sélecteur de Taille */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2.5 pt-2 border-t border-stone-200/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-stone-700">Taille</span>
                  <button className="text-stone-500 hover:text-stone-950 underline font-medium">
                    Guide des mesures
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`h-11 px-5 rounded-2xl text-xs font-semibold tracking-wider uppercase transition-all duration-200 border ${
                          isSelected
                            ? 'bg-stone-950 text-white border-stone-950 shadow-md'
                            : 'bg-white text-stone-800 border-stone-200/80 hover:bg-stone-50 hover:border-stone-300'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sélecteur de Couleur */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2.5 pt-2 border-t border-stone-200/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-stone-700">
                    Nuance : <span className="font-normal text-stone-900 capitalize">{selectedColor}</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`w-9 h-9 rounded-full border-2 transition-all p-0.5 ${
                          isSelected ? 'border-stone-950 scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                        }`}
                        title={color}
                      >
                        <div
                          className="w-full h-full rounded-full border border-black/10 shadow-inner"
                          style={{
                            backgroundColor: color.toLowerCase() === 'blanc' ? '#ffffff' :
                              color.toLowerCase() === 'noir' ? '#121212' :
                                color.toLowerCase() === 'bleu marine' ? '#1e3a8a' :
                                  color.toLowerCase() === 'rose poudré' ? '#f472b6' :
                                    color.toLowerCase() === 'gris' ? '#78716c' :
                                      color.toLowerCase() === 'camel' ? '#b45309' :
                                        color.toLowerCase() === 'bordeaux' ? '#881337' :
                                          '#e5e7eb'
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantité & Bouton d'Ajout */}
            <div className="space-y-3 pt-3 border-t border-stone-200/60">
              <div className="flex items-center gap-3">
                {/* Sélecteur de quantité sous forme de pilule */}
                <div className="flex items-center bg-white border border-stone-200/80 rounded-full px-2 py-1 shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-stone-600 hover:text-stone-950 hover:bg-stone-100 transition-colors"
                    aria-label="Diminuer la quantité"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-bold text-xs text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-stone-600 hover:text-stone-950 hover:bg-stone-100 transition-colors"
                    aria-label="Augmenter la quantité"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Bouton d'ajout au panier principal */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-8 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-lg active:scale-[0.98] ${
                    isAdded
                      ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                      : 'bg-stone-950 hover:bg-black text-white hover:shadow-xl'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Ajouté au panier !</span>
                    </>
                  ) : (
                    <>
                      <span>Ajouter au panier</span>
                      <span>•</span>
                      <span>{formatPrice((product.price || 0) * quantity)}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Piliers de réassurance */}
            <div className="p-4 bg-white/80 rounded-2xl border border-stone-200/60 shadow-sm space-y-3 text-xs text-stone-600">
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-stone-800 shrink-0" />
                <span>Livraison offerte dès {formatPrice(BUSINESS_CONSTANTS.FREE_SHIPPING_THRESHOLD)}</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-4 h-4 text-stone-800 shrink-0" />
                <span>Retours et échanges simples sous 30 jours</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Paiement sécurisé via Mobile Money (Wave, Orange, MTN) & Cartes</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Onglets de Détails (Description, Composition, Entretien, Avis) ─ */}
        <div className="mt-20 pt-10 border-t border-stone-200/60">
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 bg-stone-100 rounded-full border border-stone-200/60">
              {(['description', 'composition', 'entretien', 'avis'] as const).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-white text-stone-950 shadow-sm'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    {tab === 'description' && 'Description'}
                    {tab === 'composition' && 'Matières'}
                    {tab === 'entretien' && 'Entretien'}
                    {tab === 'avis' && `Avis (${finalReviewCount})`}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="max-w-3xl mx-auto py-4">
            {activeTab === 'description' && (
              <div className="space-y-4 text-sm text-stone-700 leading-relaxed font-light">
                <p>{product.description}</p>
                <p>
                  Pensée avec une exigence absolue du détail, cette pièce incarne le savoir-faire de notre atelier.
                  Idéale pour composer une silhouette résolument moderne et sophistiquée.
                </p>
              </div>
            )}

            {activeTab === 'composition' && (
              <div className="space-y-4">
                <p className="text-sm text-stone-700 font-light leading-relaxed">
                  {product.composition || 'Matière noble sélectionnée pour sa tenue et sa douceur.'}
                </p>
                <div className="p-6 bg-white rounded-2xl border border-stone-200/60 space-y-2 text-xs text-stone-700">
                  <h4 className="font-semibold text-stone-950 uppercase tracking-wider">Engagements de Confection :</h4>
                  <ul className="space-y-1.5 font-light">
                    <li>• Fibres haut de gamme respirantes et résistantes</li>
                    <li>• Teintures certifiées respectueuses des peaux sensibles</li>
                    <li>• Finitions et surpiqûres renforcées</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'entretien' && (
              <div className="space-y-4">
                <p className="text-sm text-stone-700 font-light leading-relaxed">
                  {product.care || 'Pour préserver la splendeur de votre vêtement au fil des saisons :'}
                </p>
                <div className="p-6 bg-stone-100/70 rounded-2xl border border-stone-200/60 space-y-2 text-xs text-stone-700 font-light">
                  <p>• Lavage délicat à l'envers à 30°C maximum</p>
                  <p>• Séchage naturel à plat à l'abri du soleil direct</p>
                  <p>• Repassage doux sur l'envers</p>
                </div>
              </div>
            )}

            {activeTab === 'avis' && (
              <div className="space-y-8">
                {/* Scorecard */}
                <div className="p-8 bg-white rounded-3xl border border-stone-200/60 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="font-serif text-2xl text-stone-950 font-normal">Notes & Retours</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.round(finalAverage) ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} />
                        ))}
                      </div>
                      <span className="font-bold text-lg text-stone-950">{finalAverage} / 5</span>
                    </div>
                    <p className="text-xs text-stone-400 mt-1">Sur la base de {finalReviewCount} avis certifiés</p>
                    <div className="mt-4">
                      <button
                        onClick={() => setIsReviewModalOpen(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-950 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-full shadow-sm hover:scale-[1.02] transition-all"
                      >
                        <MessageSquarePlus className="w-3.5 h-3.5" />
                        <span>Partager mon avis</span>
                      </button>
                    </div>
                  </div>

                  <div className="w-full md:w-64 space-y-1.5">
                    {Object.entries(ratingDistribution).reverse().map(([star, count]) => (
                      <div key={star} className="flex items-center gap-2 text-xs text-stone-500">
                        <span className="w-10">{star} ★</span>
                        <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${(count / (finalReviewCount || 1)) * 100}%` }}
                          />
                        </div>
                        <span className="w-6 text-right font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Liste des avis */}
                <div className="space-y-4">
                  {filteredAndSortedReviews.map((review) => (
                    <div key={review.id} className="p-6 bg-white rounded-2xl border border-stone-200/60 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-stone-100 font-bold text-xs flex items-center justify-center text-stone-700">
                            {(review.customerName || 'U').charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-xs text-stone-950">{review.customerName || 'Client vérifié'}</span>
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                                <ShieldCheck className="w-3 h-3" /> Achat vérifié
                              </span>
                            </div>
                            <div className="flex text-amber-400 mt-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${i < review.rating ? 'fill-amber-400' : 'text-stone-200'}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-[11px] text-stone-400">
                          {new Date(review.date || review.created_at || '').toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Pièces Similaires Recommandées ───────────────────────── */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-stone-200/60">
            <div className="text-center mb-10">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">
                Harmonie du Style
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-stone-950 font-normal mt-1">
                Vous Aimerez Aussi
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onProductClick={() => {
                    // Si on clique sur un produit similaire, remonter en haut
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              ))}
            </div>
          </div>
        )}
        {/* ─── Modal de Dépôt d'Avis ─────────────────────────────────── */}
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-stone-200/80 relative">
              <button
                onClick={() => {
                  setIsReviewModalOpen(false);
                  setReviewFeedback(null);
                }}
                className="absolute top-6 right-6 p-2 text-stone-400 hover:text-stone-950 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">Votre Expérience</span>
                <h3 className="font-serif text-2xl text-stone-950 font-normal mt-1">Évaluer cette création</h3>
                <p className="text-xs text-stone-500 mt-1">{product.name}</p>
              </div>

              {reviewFeedback ? (
                <div className={`p-4 rounded-2xl text-xs font-medium text-center ${reviewFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                  {reviewFeedback.message}
                </div>
              ) : !isAuthenticated ? (
                <div className="text-center py-6 space-y-4">
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Pour garantir l'authenticité de nos avis, vous devez être connecté(e) à votre compte client Stell's Hope pour déposer un témoignage.
                  </p>
                  <a
                    href="/login"
                    className="inline-block px-6 py-2.5 bg-stone-950 text-white text-xs font-semibold uppercase tracking-wider rounded-full shadow-sm hover:bg-black transition-all"
                  >
                    Me connecter
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2 text-center">
                      Note globale ({newRating} / 5)
                    </label>
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewRating(star)}
                          className="p-1 transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-7 h-7 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Votre commentaire
                    </label>
                    <textarea
                      rows={4}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Matières, tombé du vêtement, finitions, confort..."
                      required
                      maxLength={1000}
                      className="w-full text-xs p-3.5 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white transition-all resize-none"
                    />
                    <div className="text-right text-[10px] text-stone-400 mt-1">
                      {newComment.length} / 1000 caractères
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="w-full py-3.5 bg-stone-950 hover:bg-black disabled:bg-stone-300 text-white text-xs uppercase tracking-widest font-semibold rounded-full shadow-lg transition-all"
                    >
                      {submittingReview ? 'Publication en cours...' : 'Publier mon avis'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}