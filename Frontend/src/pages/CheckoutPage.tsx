import React, { useState } from 'react';
import { ArrowLeft, Truck, CreditCard, CheckCircle } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { CheckoutState, Order } from '../types/order';
import OrderConfirmationPage from './OrderConfirmationPage';

interface CheckoutPageProps {
  onClose: () => void;
  onOrderComplete?: (order: Order) => void;
}

export default function CheckoutPage({ onClose, onOrderComplete }: CheckoutPageProps) {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    step: 'shipping',
    shippingAddress: {},
    billingAddress: {},
    paymentMethod: null,
    sameAsShipping: true
  });
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const shipping = 5.99;
  const tax = cartTotal * 0.2;
  const total = cartTotal + shipping + tax;

  const handleNextStep = () => {
    if (checkoutState.step === 'shipping') {
      setCheckoutState(prev => ({ ...prev, step: 'payment' }));
    } else if (checkoutState.step === 'payment') {
      setCheckoutState(prev => ({ ...prev, step: 'review' }));
    }
  };

  const handlePlaceOrder = () => {
    // Création de la commande
    const newOrder: Order = {
      id: 'CMD' + Date.now().toString().slice(-6),
      items: cart,
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
      shipping: shipping,
      tax: tax,
      total: total,
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
          <h2 className="text-2xl font-bold mb-4">Connexion requise</h2>
          <p className="text-gray-600 mb-6">Veuillez vous connecter pour finaliser votre commande</p>
          <button onClick={onClose} className="bg-black text-white px-6 py-2 rounded">
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onClose} className="flex items-center text-gray-600 hover:text-black">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour au panier
          </button>
          <h1 className="text-2xl font-bold">Commande</h1>
          <div className="w-20"></div>
        </div>

        {/* Progress */}
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
          {/* Main Content */}
          <div className="lg:col-span-2">
            {checkoutState.step === 'shipping' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Adresse de livraison</h2>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Prénom"
                    className="border rounded px-3 py-2"
                    value={checkoutState.shippingAddress.firstName || ''}
                    onChange={(e) => setCheckoutState(prev => ({
                      ...prev,
                      shippingAddress: { ...prev.shippingAddress, firstName: e.target.value }
                    }))}
                  />
                  <input
                    type="text"
                    placeholder="Nom"
                    className="border rounded px-3 py-2"
                    value={checkoutState.shippingAddress.lastName || ''}
                    onChange={(e) => setCheckoutState(prev => ({
                      ...prev,
                      shippingAddress: { ...prev.shippingAddress, lastName: e.target.value }
                    }))}
                  />
                  <input
                    type="text"
                    placeholder="Adresse"
                    className="col-span-2 border rounded px-3 py-2"
                    value={checkoutState.shippingAddress.street || ''}
                    onChange={(e) => setCheckoutState(prev => ({
                      ...prev,
                      shippingAddress: { ...prev.shippingAddress, street: e.target.value }
                    }))}
                  />
                  <input
                    type="text"
                    placeholder="Ville"
                    className="border rounded px-3 py-2"
                    value={checkoutState.shippingAddress.city || ''}
                    onChange={(e) => setCheckoutState(prev => ({
                      ...prev,
                      shippingAddress: { ...prev.shippingAddress, city: e.target.value }
                    }))}
                  />
                  <input
                    type="text"
                    placeholder="Code postal"
                    className="border rounded px-3 py-2"
                    value={checkoutState.shippingAddress.postalCode || ''}
                    onChange={(e) => setCheckoutState(prev => ({
                      ...prev,
                      shippingAddress: { ...prev.shippingAddress, postalCode: e.target.value }
                    }))}
                  />
                </div>
              </div>
            )}

            {checkoutState.step === 'payment' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Mode de paiement</h2>
                <div className="space-y-4">
                  <label className="flex items-center p-4 border rounded cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={checkoutState.paymentMethod === 'card'}
                      onChange={(e) => setCheckoutState(prev => ({ ...prev, paymentMethod: e.target.value as 'card' }))}
                      className="mr-3"
                    />
                    <span>Carte bancaire</span>
                  </label>
                  <label className="flex items-center p-4 border rounded cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={checkoutState.paymentMethod === 'paypal'}
                      onChange={(e) => setCheckoutState(prev => ({ ...prev, paymentMethod: e.target.value as 'paypal' }))}
                      className="mr-3"
                    />
                    <span>PayPal</span>
                  </label>
                </div>
              </div>
            )}

            {checkoutState.step === 'review' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Récapitulatif</h2>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex items-center space-x-4">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-gray-600">{item.size} • {item.color}</p>
                        <p className="text-sm">Qté: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">{(item.product.price * item.quantity).toFixed(2)} €</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg h-fit">
            <h3 className="text-lg font-semibold mb-4">Résumé de commande</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{cartTotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span>{shipping.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>TVA</span>
                <span>{tax.toFixed(2)} €</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>
            
            <button
              onClick={checkoutState.step === 'review' ? handlePlaceOrder : handleNextStep}
              className="w-full bg-black text-white py-3 rounded mt-6 hover:bg-gray-900"
            >
              {checkoutState.step === 'review' ? 'Confirmer la commande' : 'Continuer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}