import React, { useState, useMemo } from 'react';
import { ArrowLeft, Truck, CreditCard, CheckCircle } from 'lucide-react';
import { useCartContext } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { CheckoutState, Order } from '../types/order';
import OrderConfirmationPage from './OrderConfirmationPage';
import { useProducts } from '../hooks/useProducts';

interface CheckoutPageProps {
  onClose: () => void;
  onOrderComplete?: (order: Order) => void;
}

export default function CheckoutPage({ onClose, onOrderComplete }: CheckoutPageProps) {
  const { guestCart, cartTotal, clearCart } = useCartContext();
  const { products } = useProducts();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    step: 'shipping',
    shippingAddress: {},
    billingAddress: {},
    paymentMethod: null,
    sameAsShipping: true
  });
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [promoError, setPromoError] = useState('');

  const hydratedCart = useMemo(() => guestCart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }), [guestCart, products]);

  const shipping = 5.99;
  const discount = appliedPromo ? 
    (appliedPromo.type === 'percentage' ? cartTotal * (appliedPromo.value / 100) : appliedPromo.value) : 0;
  const discountedSubtotal = cartTotal - discount;
  const tax = discountedSubtotal * 0.2;
  const total = discountedSubtotal + shipping + tax;

  const handleNextStep = () => {
    if (checkoutState.step === 'shipping') {
      setCheckoutState(prev => ({ ...prev, step: 'payment' }));
    } else if (checkoutState.step === 'payment') {
      setCheckoutState(prev => ({ ...prev, step: 'review' }));
    }
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;
    
    try {
      const response = await fetch('http://localhost:8000/api/promotions/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode, amount: cartTotal })
      });
      
      if (response.ok) {
        const promo = await response.json();
        setAppliedPromo(promo);
        setPromoError('');
      } else {
        setPromoError('Code promo invalide');
      }
    } catch {
      setPromoError('Erreur lors de la validation');
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
  };

  const handlePlaceOrder = () => {
    const newOrder: Order = {
      id: 'CMD' + Date.now().toString().slice(-6),
      items: hydratedCart.map(item => ({ 
        productId: item.productId, 
        quantity: item.quantity,
        name: item.name || '',
        price: item.price || 0,
        image: item.image || ''
      })),
      shippingAddress: {
        id: '1',
        type: 'shipping',
        firstName: checkoutState.shippingAddress.firstName || '',
        lastName: checkoutState.shippingAddress.lastName || '',
        street: checkoutState.shippingAddress.street || '',
        city: checkoutState.shippingAddress.city || '',
        postalCode: checkoutState.shippingAddress.postalCode || '',
        country: 'France',
        isDefault: true
      },
      billingAddress: {
        id: '2',
        type: 'billing',
        firstName: checkoutState.shippingAddress.firstName || '',
        lastName: checkoutState.shippingAddress.lastName || '',
        street: checkoutState.shippingAddress.street || '',
        city: checkoutState.shippingAddress.city || '',
        postalCode: checkoutState.shippingAddress.postalCode || '',
        country: 'France',
        isDefault: true
      },
      subtotal: cartTotal,
      discount: discount,
      shipping: shipping,
      tax: tax,
      total: total,
      promoCode: appliedPromo?.code,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      paymentMethod: checkoutState.paymentMethod || 'card'
    };

    setCompletedOrder(newOrder);
    clearCart();
    onOrderComplete?.(newOrder);
  };

  if (completedOrder) {
    return (
      <OrderConfirmationPage
        order={completedOrder}
        onClose={onClose}
        onContinueShopping={onClose}
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Vous devez être connecté</h2>
          <p className="text-gray-600 mb-6">Veuillez vous connecter pour finaliser votre commande</p>
          <div className="flex justify-center space-x-4">
            <button onClick={() => navigate('/login', { state: { from: '/cart' } })} className="bg-black text-white px-6 py-2 rounded">
              Se connecter
            </button>
            <button onClick={onClose} className="border border-gray-300 px-6 py-2 rounded">Retour</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onClose} className="flex items-center text-gray-600 hover:text-black">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour au panier
          </button>
          <h1 className="text-2xl font-bold">Commande</h1>
          <div className="w-20"></div>
        </div>

        <div className="flex items-center justify-center mb-8">
          {['shipping', 'payment', 'review'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                checkoutState.step === step ? 'bg-black text-white' :
                ['shipping', 'payment', 'review'].indexOf(checkoutState.step) > index ? 'bg-green-500 text-white' :
                'bg-gray-200 text-gray-500'
              }`}>
                {step === 'shipping' && <Truck className="w-4 h-4" />}
                {step === 'payment' && <CreditCard className="w-4 h-4" />}
                {step === 'review' && <CheckCircle className="w-4 h-4" />}
              </div>
              {index < 2 && <div className="w-16 h-0.5 bg-gray-200 mx-4"></div>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {checkoutState.step === 'shipping' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Adresse de livraison</h2>
                <div className="grid grid-cols-2 gap-4">
                  {/* ... form inputs ... */}
                </div>
              </div>
            )}

            {checkoutState.step === 'payment' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Mode de paiement</h2>
                {/* ... payment options ... */}
              </div>
            )}

            {checkoutState.step === 'review' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Récapitulatif</h2>
                <div className="space-y-4">
                  {hydratedCart.map((item) => (
                    <div key={item.productId} className="flex items-center space-x-4">
                      <img src={item.image || ''} alt={item.name || ''} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm">Qté: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">{((item.price || 0) * item.quantity).toFixed(2)} €</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-6 rounded-lg h-fit">
            <h3 className="text-lg font-semibold mb-4">Résumé de commande</h3>
            {/* ... order summary ... */}
          </div>
        </div>
      </div>
    </div>
  );
}