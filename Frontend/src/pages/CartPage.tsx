import React from 'react';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

interface CartPageProps {
  onClose: () => void;
}

export default function CartPage({ onClose }: CartPageProps) {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartItemsCount } = useCart();
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        <button onClick={onClose} className="mb-6 flex items-center text-gray-600 hover:text-black">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mon Panier</h1>
          <p className="text-gray-600">{cartItemsCount} article{cartItemsCount > 1 ? 's' : ''}</p>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Votre panier est vide</h2>
            <p className="text-gray-600 mb-6">Découvrez nos produits et ajoutez-les à votre panier</p>
            <button 
              onClick={onClose}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900"
            >
              Continuer mes achats
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Articles */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, index) => (
                <div key={`${item.product.id}-${item.size}-${item.color}-${index}`} className="border rounded-lg p-4">
                  <div className="flex space-x-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Couleur: {item.color} • Taille: {item.size}
                      </p>
                      <p className="font-semibold">{Number(item.product.price || 0).toFixed(2)}€</p>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                            className="p-2 border rounded hover:bg-gray-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                            className="p-2 border rounded hover:bg-gray-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                          className="p-2 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Résumé */}
            <div className="lg:col-span-1">
              <div className="border rounded-lg p-6 sticky top-6">
                <h3 className="text-lg font-semibold mb-4">Résumé</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{cartTotal.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span>{cartTotal >= 100 ? 'Gratuite' : '4.90€'}</span>
                  </div>
                </div>
                
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{(cartTotal + (cartTotal >= 100 ? 0 : 4.90)).toFixed(2)}€</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 mb-3"
                >
                  Commander
                </button>
                
                <button 
                  onClick={onClose}
                  className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50"
                >
                  Continuer mes achats
                </button>
                
                {cartTotal < 100 && (
                  <p className="text-sm text-gray-500 text-center mt-3">
                    Plus que {(100 - cartTotal).toFixed(2)}€ pour la livraison gratuite
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}