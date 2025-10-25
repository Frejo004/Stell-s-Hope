import React from 'react';
import { ArrowLeft, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../contexts/CartContext';

interface CartPageProps {
  onClose: () => void;
}

export default function CartPageNew({ onClose }: CartPageProps) {
  const { guestCart, cartItemsCount, cartTotal, removeFromCart, addToCart } = useCartContext();
  const navigate = useNavigate();

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    const item = guestCart.find(i => i.productId === productId);
    if (item) {
      addToCart({ productId, quantity, name: item.name, price: item.price, image: item.image });
    }
  };

  const handleIncreaseQuantity = (productId: number) => {
    handleUpdateQuantity(productId, 1);
  };

  const handleDecreaseQuantity = (productId: number) => {
    const item = guestCart.find(i => i.productId === productId);
    if (item && item.quantity > 1) {
      // To decrease, we need a dedicated function, or addToCart needs to handle negative values.
      // Let's assume addToCart can handle this by replacing the quantity.
      // A better context would have `updateQuantity`. For now, let's re-implement it here.
      const newQuantity = item.quantity - 1;
      // This is a workaround. Ideally, the context would provide an `updateItemQuantity` function.
      // For now, we will remove and re-add. This is not ideal.
      // A better approach is to have a proper update function in the context.
      // Let's see if addToCart can handle quantity updates. The context file shows it does.
      // `updatedCart[existingIndex].quantity += newItem.quantity;`
      // So to decrease, I need to add with a negative quantity.
      addToCart({ productId, quantity: -1, name: item.name, price: item.price, image: item.image });

    } else if (item && item.quantity === 1) {
      removeFromCart(productId);
    }
  };


  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <button onClick={onClose} className="mb-6 flex items-center text-gray-600 hover:text-black">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Continuer mes achats
        </button>

        {cartItemsCount === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Votre panier est vide</h2>
            <p className="text-gray-600 mb-6">Découvrez nos produits et ajoutez-les à votre panier</p>
            <button 
              onClick={onClose}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900"
            >
              Parcourir les produits
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Mon Panier</h1>
              <p className="text-gray-600">{cartItemsCount} article{cartItemsCount > 1 ? 's' : ''}</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {guestCart.map((item) => (
                    <div key={item.productId} className="flex items-center space-x-4 border-b pb-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-md overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-500">Prix: {Number(item.price).toFixed(2)} €</p>
                        <div className="flex items-center mt-2">
                          <p className="text-sm text-gray-600 mr-4">Quantité:</p>
                          <div className="flex items-center border rounded">
                            <button onClick={() => handleDecreaseQuantity(item.productId)} className="px-2 py-1 text-gray-600 hover:bg-gray-100"><Minus size={16}/></button>
                            <span className="px-3 py-1">{item.quantity}</span>
                            <button onClick={() => handleIncreaseQuantity(item.productId)} className="px-2 py-1 text-gray-600 hover:bg-gray-100"><Plus size={16}/></button>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{(Number(item.price) * item.quantity).toFixed(2)} €</p>
                        <button onClick={() => removeFromCart(item.productId)} className="text-red-500 hover:text-red-700 text-sm mt-2">
                          <Trash2 className="inline-block" size={16} /> Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-bold mb-4">Résumé de la commande</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Sous-total</span>
                      <span>{cartTotal.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Livraison</span>
                      <span>Gratuite</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                      <span>Total</span>
                      <span>{cartTotal.toFixed(2)} €</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-black text-white mt-6 py-3 rounded-lg font-semibold hover:bg-gray-800"
                  >
                    Passer la commande
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
