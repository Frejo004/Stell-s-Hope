import { useState } from 'react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Lock, ShieldCheck, Sparkles, Tag, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../contexts/CartContext';
import { getImageUrl } from '../utils/imageUtils';
import { commerce, formatPrice } from '../utils';
import { BUSINESS_CONSTANTS } from '../constants';
import SEO from '../components/SEO';

interface CartPageProps {
  onClose?: () => void;
}

export default function CartPageNew({ onClose }: CartPageProps) {
  const { cart, cartItemsCount, cartTotal, removeFromCart, updateQuantity } = useCartContext();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; type: 'percentage' | 'fixed'; value: number } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;
    setPromoError('');
    try {
      setPromoLoading(true);
      const { default: api } = await import('../services/api');
      const res = await api.post('/promotions/validate', {
        code: promoCode.trim().toUpperCase(),
        subtotal: cartTotal,
      });
      const promo = res.data;
      setAppliedPromo({ code: promo.code, type: promo.type, value: Number(promo.value) });
    } catch (err: any) {
      setPromoError(err.response?.data?.error || 'Code privilège invalide ou expiré.');
      setAppliedPromo(null);
    } finally {
      setPromoLoading(false);
    }
  };

  const discount = appliedPromo
    ? (appliedPromo.type === 'percentage' ? cartTotal * (appliedPromo.value / 100) : appliedPromo.value)
    : 0;

  const handleIncreaseQuantity = (productId: number) => {
    const item = cart.find((i: any) => i.productId === productId);
    if (item) {
      updateQuantity(productId, item.quantity + 1);
    }
  };

  const handleDecreaseQuantity = (productId: number) => {
    const item = cart.find((i: any) => i.productId === productId);
    if (item) {
      updateQuantity(productId, item.quantity - 1);
    }
  };

  const shipping = commerce.calculateShipping(cartTotal);
  const total = Math.max(0, cartTotal - discount + shipping);
  const missingForFreeShipping = Math.max(0, BUSINESS_CONSTANTS.FREE_SHIPPING_THRESHOLD - cartTotal);
  const freeShippingProgress = Math.min((cartTotal / BUSINESS_CONSTANTS.FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-10 sm:py-16 text-stone-900">
      <SEO title="Mon Panier" description="Consultez et validez votre sélection de créations exclusives Stell's Hope." />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {cartItemsCount === 0 ? (
          <div className="text-center py-20 px-4 bg-white rounded-3xl border border-stone-200/60 shadow-sm max-w-xl mx-auto">
            <div className="w-20 h-20 bg-stone-100 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-stone-200/50 shadow-sm">
              <ShoppingBag className="w-8 h-8 text-stone-400" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-950 mb-3">
              Votre panier est vide
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mb-8 font-light max-w-sm mx-auto leading-relaxed">
              Explorez nos collections et découvrez les pièces conçues pour sublimer votre allure.
            </p>
            <button
              onClick={() => {
                if (onClose) onClose();
                navigate('/boutique');
              }}
              className="px-8 py-3.5 bg-stone-950 hover:bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-full shadow-md transition-all hover:scale-105"
            >
              Découvrir la boutique
            </button>
          </div>
        ) : (
          <div>
            {/* ─── En-tête de page ─── */}
            <div className="mb-10">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">
                Commande en cours
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-stone-950 font-normal mt-1">
                Mon Panier d'Achats
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 font-light mt-1">
                {cartItemsCount} {cartItemsCount > 1 ? 'articles sélectionnés' : 'article sélectionné'}
              </p>
            </div>

            {/* ─── Grille Panier + Récapitulatif ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Colonne des articles (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                {/* Jauge Livraison Offerte */}
                <div className="p-4 bg-white rounded-2xl border border-stone-200/60 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-stone-700 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                      {missingForFreeShipping === 0 ? (
                        <span className="text-emerald-700 font-semibold">Livraison offerte débloquée !</span>
                      ) : (
                        <span>
                          Plus que <strong className="text-stone-950">{formatPrice(missingForFreeShipping)}</strong> pour la livraison offerte
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] font-bold text-stone-500">{Math.round(freeShippingProgress)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        missingForFreeShipping === 0 ? 'bg-emerald-500' : 'bg-stone-900'
                      }`}
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>

                {/* Liste des articles */}
                {cart.map((item: any, index: number) => (
                  <div
                    key={`${item.productId}-${index}`}
                    className="flex gap-4 p-4 bg-white rounded-2xl border border-stone-200/60 shadow-sm transition-all hover:shadow-card items-center"
                  >
                    {/* Miniature Photo */}
                    <div
                      className="w-20 h-24 sm:w-24 sm:h-28 bg-[#F3EFEA] rounded-xl overflow-hidden shrink-0 cursor-pointer border border-stone-200/50"
                      onClick={() => navigate(`/product/${item.productId}`)}
                    >
                      <img
                        src={getImageUrl(item.product?.images?.[0] || item.image)}
                        alt={item.name}
                        className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjNFRkVBIi8+PC9zdmc+';
                        }}
                      />
                    </div>

                    {/* Informations */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3
                        className="text-xs sm:text-sm font-semibold text-stone-950 line-clamp-1 cursor-pointer hover:text-stone-600 transition-colors"
                        onClick={() => navigate(`/product/${item.productId}`)}
                      >
                        {item.name}
                      </h3>
                      <p className="text-xs text-stone-400 font-light">
                        Prix unitaire : <span className="text-stone-700 font-medium">{formatPrice(item.price)}</span>
                      </p>

                      {/* Contrôle de quantité sous forme de pilule */}
                      <div className="flex items-center gap-3 pt-2">
                        <div className="inline-flex items-center bg-stone-100 rounded-full px-2 py-0.5 border border-stone-200/60">
                          <button
                            onClick={() => handleDecreaseQuantity(item.productId)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-stone-600 hover:text-stone-950 transition-colors"
                            aria-label="Diminuer la quantité"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncreaseQuantity(item.productId)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-stone-600 hover:text-stone-950 transition-colors"
                            aria-label="Augmenter la quantité"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="inline-flex items-center gap-1 text-[11px] text-stone-400 hover:text-rose-600 transition-colors"
                          aria-label="Supprimer"
                        >
                          <Trash2 size={13} />
                          <span className="hidden sm:inline">Retirer</span>
                        </button>
                      </div>
                    </div>

                    {/* Prix Total de la ligne */}
                    <div className="text-right shrink-0">
                      <p className="text-sm sm:text-base font-bold text-stone-950">
                        {formatPrice(Number(item.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Résumé de commande (5 cols) */}
              <div className="lg:col-span-5">
                <div className="lg:sticky lg:top-24 bg-white rounded-3xl border border-stone-200/60 p-6 sm:p-8 shadow-sm space-y-5">
                  <h2 className="font-serif text-2xl font-normal text-stone-950">
                    Récapitulatif
                  </h2>

                  <div className="space-y-3 text-xs sm:text-sm text-stone-600 border-b border-stone-100 pb-5">
                    <div className="flex justify-between">
                      <span>Sous-total articles</span>
                      <span className="font-semibold text-stone-950">{formatPrice(cartTotal)}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>Remise {appliedPromo?.code ? `(${appliedPromo.code})` : ''}</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Frais de livraison estimés</span>
                      {shipping === 0 ? (
                        <span className="text-emerald-700 font-semibold">Offerte</span>
                      ) : (
                        <span className="font-semibold text-stone-950">{formatPrice(shipping)}</span>
                      )}
                    </div>
                  </div>

                  {/* Code Privilège / Promo */}
                  <div className="space-y-2 border-b border-stone-100 pb-5">
                    <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider">
                      Code Privilège / Remise
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Ex: BIENVENUE10"
                          className="w-full text-xs pl-8 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white uppercase font-mono tracking-wider"
                        />
                      </div>
                      <button
                        onClick={applyPromoCode}
                        disabled={promoLoading || !promoCode.trim()}
                        className="px-4 py-2.5 bg-stone-900 hover:bg-black disabled:bg-stone-200 disabled:text-stone-400 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all"
                      >
                        {promoLoading ? '...' : 'Appliquer'}
                      </button>
                    </div>

                    {promoError && (
                      <p className="text-[11px] text-rose-600 pl-1">{promoError}</p>
                    )}

                    {appliedPromo && (
                      <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Check className="w-3.5 h-3.5" />
                          Code {appliedPromo.code} actif
                        </span>
                        <button
                          onClick={() => {
                            setAppliedPromo(null);
                            setPromoCode('');
                          }}
                          className="text-[10px] uppercase font-bold text-emerald-800 hover:underline"
                        >
                          Retirer
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-baseline text-base sm:text-lg font-bold text-stone-950">
                    <span>Total de la commande</span>
                    <span className="text-xl sm:text-2xl font-bold">{formatPrice(total)}</span>
                  </div>

                  <button
                    onClick={() => navigate('/checkout', { state: { promoCode: appliedPromo?.code } })}
                    className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-stone-950 hover:bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.98]"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Valider ma commande</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="p-3 bg-stone-50 rounded-2xl flex items-center justify-center gap-2 text-[11px] text-stone-500 font-light text-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Transaction chiffrée SSL • Mobile Money & Cartes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
