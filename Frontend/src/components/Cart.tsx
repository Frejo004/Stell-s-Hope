import React, { useState } from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import CheckoutPage from './CheckoutPage';
import { Order } from '../types/order';

interface CartProps {
  onOrderComplete?: (order: Order) => void;
}

export default function Cart({ onOrderComplete }: CartProps = {}) {
  const {
    cart,
    isOpen,
    setIsOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    cartItemsCount
  } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">
              Panier ({cartItemsCount})
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Votre panier est vide</p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-4 text-rose-300 hover:underline"
                >
                  Continuer mes achats
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div key={`${item.product.id}-${item.size}-${item.color}-${index}`} className="flex space-x-3 border-b pb-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">
                        {item.color} • {item.size}
                      </p>
                      <p className="font-semibold text-sm">
                        {item.product.price.toFixed(2)} €
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg">{cartTotal.toFixed(2)} €</span>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-900 transition-colors"
                >
                  Commander
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    window.location.href = '/cart';
                  }}
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
      
      {isCheckoutOpen && (
        <CheckoutPage 
          onClose={() => setIsCheckoutOpen(false)}
          onOrderComplete={onOrderComplete}
        />
      )}
    </div>
  );
}