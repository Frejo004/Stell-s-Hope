import { X, ShoppingBag, Trash2, ArrowRight, Lock, Tag } from 'lucide-react';
import { useCartContext } from '../contexts/CartContext';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';

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

  const shipping = cartTotal > 100 ? 0 : 5.99;
  const total = cartTotal + shipping;

  const handleCheckout = () => {
    setIsOpen(false);
    navigate(isAuthenticated ? '/checkout' : '/login');
  };

  const handleViewCart = () => {
    setIsOpen(false);
    navigate('/cart');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        role="dialog"
        aria-modal="true"
        aria-label="Panier"
        className={`fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white z-[9999] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">
              Mon panier
              {cartItemsCount > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-400">({cartItemsCount} article{cartItemsCount > 1 ? 's' : ''})</span>
              )}
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
            aria-label="Fermer le panier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Contenu ── */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {cartItemsCount === 0 ? (
            /* État vide */
            <div className="h-full flex flex-col items-center justify-center text-center px-8 py-12">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 border-2 border-dashed border-gray-200">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Votre panier est vide</h3>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                Découvrez nos collections et ajoutez vos articles préférés.
              </p>
              <button
                onClick={() => { setIsOpen(false); navigate('/boutique'); }}
                className="btn-primary px-8 py-3 rounded-full"
              >
                Découvrir la boutique
              </button>
            </div>
          ) : (
            /* Liste des articles */
            <div className="px-6 py-4 space-y-5">
              {cart.map((item: any, index: number) => (
                <div key={`${item.productId}-${index}`} className="flex gap-4 group">
                  {/* Image */}
                  <div
                    className="w-20 h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0 cursor-pointer"
                    onClick={() => { setIsOpen(false); navigate(`/product/${item.productId}`); }}
                  >
                    {item.image || item.product?.images?.[0] ? (
                      <img
                        src={getImageUrl(item.product?.images?.[0] || item.image)}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Infos */}
                  <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className="text-sm font-medium text-gray-900 line-clamp-2 cursor-pointer hover:text-rose-500 transition-colors"
                        onClick={() => { setIsOpen(false); navigate(`/product/${item.productId}`); }}
                      >
                        {item.name || `Produit #${item.productId}`}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="p-1 text-gray-300 hover:text-red-500 transition-colors shrink-0"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                        Qté : <span className="font-semibold text-gray-700">{item.quantity}</span>
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {item.price ? `${(Number(item.price) * item.quantity).toFixed(2)} €` : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Livraison gratuite progress */}
              {cartTotal < 100 && (
                <div className="bg-rose-50 rounded-xl p-3 border border-rose-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-3.5 h-3.5 text-rose-500" />
                    <p className="text-xs text-rose-700 font-medium">
                      Plus que <strong>{(100 - cartTotal).toFixed(2)} €</strong> pour la livraison gratuite !
                    </p>
                  </div>
                  <div className="h-1.5 bg-rose-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((cartTotal / 100) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        {cartItemsCount > 0 && (
          <div className="border-t border-gray-100 bg-white px-6 py-5 space-y-4">
            {/* Récapitulatif */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Sous-total</span>
                <span className="font-medium text-gray-900">{cartTotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Livraison</span>
                {shipping === 0
                  ? <span className="text-green-600 font-medium">Gratuite</span>
                  : <span className="font-medium text-gray-900">{shipping.toFixed(2)} €</span>
                }
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>

            {/* Boutons */}
            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 bg-black text-white py-3.5 rounded-xl font-semibold hover:bg-gray-900 transition-all shadow-black/10 hover:shadow-lg active:scale-[0.98]"
            >
              <Lock className="w-4 h-4" />
              Paiement sécurisé
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleViewCart}
              className="w-full py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all text-sm"
            >
              Voir le panier complet
            </button>
          </div>
        )}
      </div>
    </>
  );
}
