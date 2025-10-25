import React from 'react';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartContext } from '../contexts/CartContext';
import { useAuth } from '../hooks/useAuth';

export default function CartSidebarNew() {
  const { cartItemsCount, guestCart, isOpen, setIsOpen, removeFromCart } = useCartContext();
  const { isAuthenticated } = useAuth();

  if (!isOpen) return null;

  const handleCheckout = () => {
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

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">
              Panier ({cartItemsCount})
            </h2>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cartItemsCount === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Votre panier est vide</p>
                <button onClick={() => setIsOpen(false)} className="text-rose-300 hover:underline">
                  Continuer mes achats
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {guestCart.map((item, index) => (
                  <div key={index} className="flex space-x-3 border-b pb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.name || `Produit #${item.productId}`}</h3>
                      <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                      {item.price && (
                        <p className="text-sm font-semibold">{Number(item.price).toFixed(2)} €</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cartItemsCount > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Articles:</span>
                <span className="font-bold text-lg">{cartItemsCount}</span>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-900 transition-colors"
                >
                  {isAuthenticated ? 'Commander' : 'Se connecter pour commander'}
                </button>
                <button
                  onClick={handleViewCart}
                  className="w-full py-3 border border-gray-300 rounded font-medium hover:bg-gray-50 transition-colors"
                >
                  Voir le panier
                </button>
              </div>
              
              <p className="text-xs text-gray-500 text-center">
                Livraison gratuite dès 100€
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}