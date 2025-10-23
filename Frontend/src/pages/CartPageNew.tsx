import React from 'react';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../contexts/CartContext';

interface CartPageProps {
  onClose: () => void;
}

export default function CartPageNew({ onClose }: CartPageProps) {
  const { cartItemsCount } = useCartContext();
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

        {cartItemsCount === 0 ? (
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
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-rose-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">{cartItemsCount} article{cartItemsCount > 1 ? 's' : ''} dans votre panier</h2>
            <p className="text-gray-600 mb-6">Fonctionnalité en cours de développement</p>
            <button 
              onClick={() => navigate('/checkout')}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 mr-4"
            >
              Commander
            </button>
            <button 
              onClick={onClose}
              className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50"
            >
              Continuer mes achats
            </button>
          </div>
        )}
      </div>
    </div>
  );
}