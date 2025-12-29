
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartContext } from '../contexts/CartContext';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useRef } from 'react';

export default function CartSidebarNew() {
  const { cartItemsCount, guestCart, isOpen, setIsOpen, removeFromCart } = useCartContext();
  const { isAuthenticated } = useAuth();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent body scroll when cart is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckout = () => {
    setIsOpen(false);
    if (!isAuthenticated) {
      window.location.href = '/login?redirect=checkout';
    } else {
      window.location.href = '/checkout';
    }
  };

  const handleViewCart = () => {
    setIsOpen(false);
    window.location.href = '/cart';
  };

  const calculateTotal = () => {
    return guestCart.reduce((total, item) => {
      const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
      return total + (price || 0) * item.quantity;
    }, 0);
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden" role="dialog" aria-modal="true">
      {/* Overlay backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar Panel */}
      <div
        ref={sidebarRef}
        className="absolute right-0 top-0 h-full w-full sm:w-[400px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
            <h2 className="text-xl font-medium text-gray-900 flex items-center">
              <ShoppingBag className="w-5 h-5 mr-3" />
              Panier ({cartItemsCount})
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 -mr-2 text-gray-400 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
              aria-label="Fermer le panier"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {cartItemsCount === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <ShoppingBag className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Votre panier est vide</h3>
                <p className="text-gray-500 mb-8 max-w-[200px]">
                  Découvrez nos nouvelles collections et trouvez votre bonheur.
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-900 transition-all hover:shadow-lg"
                >
                  Continuer mes achats
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {guestCart.map((item, index) => (
                  <div key={`${item.productId}-${index}`} className="flex space-x-4 group">
                    <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden shrink-0 relaitve">
                      {item.image ? (
                        <img
                          src={typeof item.image === 'string' ? item.image : ''}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                          <ShoppingBag className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-medium text-gray-900 line-clamp-2 pr-4 hover:text-rose-500 transition-colors cursor-pointer">
                            {item.name || `Produit #${item.productId}`}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-gray-400 hover:text-red-500 p-1 -mt-1 -mr-1 transition-colors"
                            aria-label="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {/* Optionnel: Variant info like Size/Color if available in item */}
                        {/* <p className="text-sm text-gray-500">Taille: M • Noir</p> */}
                      </div>

                      <div className="flex justify-between items-end">
                        <div className="text-sm text-gray-500">
                          Qté: <span className="font-medium text-gray-900">{item.quantity}</span>
                        </div>
                        <div className="font-medium text-gray-900">
                          {item.price ? `${(Number(item.price) * item.quantity).toFixed(2)} €` : '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {cartItemsCount > 0 && (
            <div className="border-t border-gray-100 bg-white p-4 sm:p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-500">
                  <span>Sous-total</span>
                  <span>{calculateTotal().toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Livraison</span>
                  <span className="text-green-600">Gratuite</span>
                </div>
                <div className="flex justify-between text-lg font-medium text-gray-900 pt-3 border-t">
                  <span>Total</span>
                  <span>{calculateTotal().toFixed(2)} €</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-900 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>Paiement sécurisé</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </button>
                <button
                  onClick={handleViewCart}
                  className="w-full py-4 border border-gray-200 rounded-full font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  Voir le panier complet
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}