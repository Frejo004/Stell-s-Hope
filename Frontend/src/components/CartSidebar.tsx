;
import { X, ShoppingBag } from 'lucide-react';
import { useCartContext } from '../contexts/CartContext';
import { useAuth } from '../hooks/useAuth';

export default function CartSidebar() {
  const { cartItemsCount, isOpen, setIsOpen } = useCartContext();
  const { isAuthenticated } = useAuth();

  console.log('🛒 CartSidebar render - isOpen:', isOpen, 'cartItemsCount:', cartItemsCount);

  if (!isOpen) {
    console.log('❌ CartSidebar not rendering because isOpen is false');
    return null;
  }
  
  console.log('✅ CartSidebar rendering!');

  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Rediriger vers la connexion seulement au moment du paiement
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
    <div className="fixed inset-0 z-[9999] overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => {
        console.log('Background clicked, closing cart');
        setIsOpen(false);
      }} />
      
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
            {cartItemsCount === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Votre panier est vide</p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-rose-300 hover:underline"
                >
                  Continuer mes achats
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <ShoppingBag className="w-16 h-16 text-rose-300 mx-auto mb-4" />
                  <p className="font-medium mb-2">
                    {cartItemsCount} article{cartItemsCount > 1 ? 's' : ''} dans votre panier
                  </p>
                  {!isAuthenticated && (
                    <p className="text-sm text-gray-500 mb-4">
                      Connectez-vous pour voir les détails
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
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