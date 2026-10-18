import { X, ShoppingBag, Trash2, ArrowRight, Lock, Sparkles, ShieldCheck } from 'lucide-react';
import { useCartContext } from '../contexts/CartContext';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';
import { commerce, formatPrice } from '../utils';
import { BUSINESS_CONSTANTS } from '../constants';

export default function CartSidebarNew() {
  const { cartItemsCount, cart, isOpen, setIsOpen, removeFromCart, cartTotal } = useCartContext();
  const { isAuthenticated } = useAuth();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Bloquer le scroll du body quand le panier est ouvert
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const shipping = commerce.calculateShipping(cartTotal);
  const total = cartTotal + shipping;
  const missingForFreeShipping = Math.max(0, BUSINESS_CONSTANTS.FREE_SHIPPING_THRESHOLD - cartTotal);
  const freeShippingProgress = Math.min((cartTotal / BUSINESS_CONSTANTS.FREE_SHIPPING_THRESHOLD) * 100, 100);

  const handleCheckout = () => {
    setIsOpen(false);
    navigate(isAuthenticated ? '/checkout' : '/login');
  };

  const handleViewCart = () => {
    setIsOpen(false);
    navigate('/cart');
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <>
      {/* Backdrop sombre avec flou */}
      <div
        className={`fixed inset-0 z-[99998] bg-stone-950/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar Drawer */}
      <div
        ref={sidebarRef}
        role="dialog"
        aria-modal="true"
        aria-label="Panier d'achats"
        className={`fixed right-0 top-0 h-screen h-[100dvh] w-full sm:w-[440px] bg-[#FAF9F6] z-[99999] shadow-2xl flex flex-col transition-transform duration-300 ease-out sm:rounded-l-3xl border-l border-stone-200/60 overflow-hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* ── Header ── */}
        <div className="shrink-0 flex items-center justify-between px-6 py-5 border-b border-stone-200/60 bg-white/70 backdrop-blur-md sm:rounded-tl-3xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-900">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-stone-950">Mon Panier</h2>
              <p className="text-[11px] text-stone-500 font-medium">
                {cartItemsCount} {cartItemsCount > 1 ? 'articles sélectionnés' : 'article sélectionné'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            aria-label="Fermer le panier"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Jauge de Livraison Offerte ── */}
        {cartItemsCount > 0 && (
          <div className="shrink-0 px-6 py-3.5 bg-white border-b border-stone-200/50">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-stone-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                {missingForFreeShipping === 0 ? (
                  <span className="text-emerald-700 font-semibold">Livraison offerte débloquée !</span>
                ) : (
                  <span>
                    Plus que <strong className="text-stone-950">{formatPrice(missingForFreeShipping)}</strong> pour la livraison gratuite
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
        )}

        {/* ── Contenu / Liste des articles ── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar flex flex-col">
          {cartItemsCount === 0 ? (
            /* État vide */
            <div className="my-auto flex flex-col items-center justify-center text-center px-4 py-8">
              <div className="w-20 h-20 bg-stone-100 rounded-3xl flex items-center justify-center mb-5 border border-stone-200/60 shadow-sm">
                <ShoppingBag className="w-8 h-8 text-stone-400" />
              </div>
              <h3 className="font-serif text-xl font-normal text-stone-950 mb-2">Votre panier est vide</h3>
              <p className="text-stone-500 text-xs sm:text-sm mb-6 leading-relaxed max-w-xs font-light">
                Explorez nos collections et dénichez les pièces d'exception faites pour vous.
              </p>
              <button
                onClick={() => { setIsOpen(false); navigate('/boutique'); }}
                className="px-6 py-3 bg-stone-950 hover:bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-full shadow-md transition-all hover:scale-105 active:scale-95"
              >
                Découvrir la boutique
              </button>
            </div>
          ) : (
            /* Liste des articles */
            cart.map((item: any, index: number) => (
              <div
                key={`${item.productId}-${index}`}
                className="flex gap-4 p-3.5 bg-white rounded-2xl border border-stone-200/60 shadow-sm transition-all hover:shadow-card"
              >
                {/* Image */}
                <div
                  className="w-20 h-24 bg-stone-100 rounded-xl overflow-hidden shrink-0 cursor-pointer border border-stone-200/40"
                  onClick={() => { setIsOpen(false); navigate(`/product/${item.productId}`); }}
                >
                  {item.image || item.product?.images?.[0] ? (
                    <img
                      src={getImageUrl(item.product?.images?.[0] || item.image)}
                      alt={item.name}
                      className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-stone-300" />
                    </div>
                  )}
                </div>

                {/* Détails du produit */}
                <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className="text-xs sm:text-sm font-semibold text-stone-900 line-clamp-1 cursor-pointer hover:text-stone-600 transition-colors"
                      onClick={() => { setIsOpen(false); navigate(`/product/${item.productId}`); }}
                    >
                      {item.name || `Pièce #${item.productId}`}
                    </h3>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="p-1 text-stone-300 hover:text-rose-600 rounded-full transition-colors shrink-0"
                      aria-label="Supprimer cet article"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Attributs éventuels (Taille / Couleur) */}
                  <div className="flex items-center gap-2 text-[11px] text-stone-400">
                    {item.size && <span>Taille : <strong className="text-stone-600">{item.size}</strong></span>}
                    {item.color && <span>• Couleur : <strong className="text-stone-600">{item.color}</strong></span>}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full font-medium">
                      Qté : {item.quantity}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-stone-950">
                      {item.price ? `${formatPrice(Number(item.price) * item.quantity)}` : '—'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Footer du panier ── */}
        {cartItemsCount > 0 && (
          <div className="shrink-0 border-t border-stone-200/60 bg-white/95 backdrop-blur-md px-6 py-5 space-y-4 sm:rounded-bl-3xl">
            {/* Récapitulatif tarifaire */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-stone-500">
                <span>Sous-total</span>
                <span className="font-semibold text-stone-900">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Livraison estimée</span>
                {shipping === 0 ? (
                  <span className="text-emerald-600 font-semibold">Gratuite</span>
                ) : (
                  <span className="font-semibold text-stone-900">{formatPrice(shipping)}</span>
                )}
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-950 pt-2 border-t border-stone-100">
                <span>Total estimé</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Actions principales */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 bg-stone-950 hover:bg-black text-white py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Passer commande</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleViewCart}
                className="w-full py-2.5 text-xs text-stone-600 hover:text-stone-950 font-medium transition-colors text-center"
              >
                Voir le détail du panier
              </button>
            </div>

            {/* Badge de réassurance paiement */}
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
              <span>Paiement sécurisé Moneroo • Mobile Money & Cartes</span>
            </div>
          </div>
        )}
      </div>
    </>,
    document.body
  );
}
