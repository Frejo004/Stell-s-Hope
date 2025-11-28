import { useState, useMemo } from 'react';
import { ArrowLeft, Truck, CreditCard, CheckCircle } from 'lucide-react';
import { useCartContext } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Order } from '../types/order';
import { CheckoutState } from '../types/checkout';
import OrderConfirmationPage from './OrderConfirmationPage';
import { useProducts } from '../hooks/useProducts';
import { paymentService } from '../services/paymentService';

interface CheckoutPageProps {
  onClose: () => void;
  onOrderComplete?: (order: Order) => void;
}

export default function CheckoutPage({ onClose, onOrderComplete }: CheckoutPageProps) {
  const { guestCart, cartTotal, clearCart } = useCartContext();
  const { products } = useProducts();
  const { isAuthenticated, user: authUser } = useAuth();
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
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleNextStep = (): void => {
    if (checkoutState.step === 'shipping') {
      setCheckoutState((prev: CheckoutState) => ({ ...prev, step: 'payment' }));
    } else if (checkoutState.step === 'payment') {
      setCheckoutState((prev: CheckoutState) => ({ ...prev, step: 'review' }));
    }
  };

  const applyPromoCode = async (): Promise<void> => {
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

  const removePromoCode = (): void => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
  };

  const handlePlaceOrder = async (): Promise<void> => {
    if (!checkoutState.paymentMethod) {
      alert('Veuillez sélectionner un mode de paiement');
      return;
    }

    setIsProcessing(true);

    try {
      if (checkoutState.paymentMethod === 'moneroo') {
        const paymentData = {
          amount: total,
          currency: 'XOF',
          customer_email: isAuthenticated && authUser ? authUser.email : checkoutState.shippingAddress.email || 'guest@example.com',
          customer_name: isAuthenticated && authUser ? `${authUser.first_name} ${authUser.last_name}` : `${checkoutState.shippingAddress.firstName} ${checkoutState.shippingAddress.lastName}`,
        };

        const response = await paymentService.initiatePayment(paymentData);
        if (response.checkout_url) {
          window.location.href = response.checkout_url;
        } else {
          alert('Erreur lors de l\'initialisation du paiement');
          setIsProcessing(false);
        }
        return;
      }

      // Construction de l'objet Order conforme à l'interface
      const order: Order = {
        id: Date.now(),
        user_id: authUser ? authUser.id : 0,
        total: total,
        subtotal: cartTotal,
        shipping: shipping,
        tax: tax,
        status: 'confirmed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        payment_method: checkoutState.paymentMethod || 'card',
        shipping_address: {
          first_name: checkoutState.shippingAddress.firstName || '',
          last_name: checkoutState.shippingAddress.lastName || '',
          street: checkoutState.shippingAddress.street || '',
          city: checkoutState.shippingAddress.city || '',
          postal_code: checkoutState.shippingAddress.postalCode || '',
          country: 'France'
        },
        billing_address: {
          first_name: checkoutState.shippingAddress.firstName || '',
          last_name: checkoutState.shippingAddress.lastName || '',
          street: checkoutState.shippingAddress.street || '',
          city: checkoutState.shippingAddress.city || '',
          postal_code: checkoutState.shippingAddress.postalCode || '',
          country: 'France'
        },
        order_items: hydratedCart.map(item => ({
          id: Date.now() + Math.random(),
          order_id: 0, // Sera défini par le backend
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price || 0,
          product: {
            id: item.productId,
            name: item.name || '',
            images: [item.image || ''],
            price: item.price || 0
          }
        }))
      };

      setCompletedOrder(order);
      clearCart();
      onOrderComplete?.(order);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Une erreur est survenue lors du paiement');
    } finally {
      setIsProcessing(false);
    }
  };

  if (completedOrder) {
    return (
      <OrderConfirmationPage
        order={completedOrder}
        onContinueShopping={onClose}
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-50 to-rose-100">
        <div className="text-center bg-white p-12 rounded-xl shadow-2xl max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Vous devez être connecté</h2>
          <p className="text-gray-600 mb-8">Veuillez vous connecter pour finaliser votre commande.</p>
          <div className="flex justify-center space-x-4">
            <button onClick={() => navigate('/login', { state: { from: '/cart' } })} className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
              Se connecter
            </button>
            <button onClick={onClose} className="border border-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Retour
            </button>
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
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${checkoutState.step === step ? 'bg-black text-white' :
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
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-black focus:border-black"
                      value={checkoutState.shippingAddress.firstName || ''}
                      onChange={(e) => setCheckoutState(prev => ({
                        ...prev,
                        shippingAddress: { ...prev.shippingAddress, firstName: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-black focus:border-black"
                      value={checkoutState.shippingAddress.lastName || ''}
                      onChange={(e) => setCheckoutState(prev => ({
                        ...prev,
                        shippingAddress: { ...prev.shippingAddress, lastName: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-black focus:border-black"
                      value={checkoutState.shippingAddress.email || ''}
                      onChange={(e) => setCheckoutState(prev => ({
                        ...prev,
                        shippingAddress: { ...prev.shippingAddress, email: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-black focus:border-black"
                      value={checkoutState.shippingAddress.street || ''}
                      onChange={(e) => setCheckoutState(prev => ({
                        ...prev,
                        shippingAddress: { ...prev.shippingAddress, street: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-black focus:border-black"
                      value={checkoutState.shippingAddress.city || ''}
                      onChange={(e) => setCheckoutState(prev => ({
                        ...prev,
                        shippingAddress: { ...prev.shippingAddress, city: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-black focus:border-black"
                      value={checkoutState.shippingAddress.postalCode || ''}
                      onChange={(e) => setCheckoutState(prev => ({
                        ...prev,
                        shippingAddress: { ...prev.shippingAddress, postalCode: e.target.value }
                      }))}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleNextStep}
                    className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Continuer vers le paiement
                  </button>
                </div>
              </div>
            )}

            {checkoutState.step === 'payment' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Mode de paiement</h2>
                <div className="space-y-4">
                  <div
                    className={`border p-4 rounded-lg cursor-pointer flex items-center justify-between transition-colors ${checkoutState.paymentMethod === 'moneroo'
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                    onClick={() => setCheckoutState(prev => ({ ...prev, paymentMethod: 'moneroo' }))}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-4 ${checkoutState.paymentMethod === 'moneroo' ? 'border-black' : 'border-gray-300'
                        }`}>
                        {checkoutState.paymentMethod === 'moneroo' && (
                          <div className="w-3 h-3 rounded-full bg-black"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">Payer avec Moneroo</p>
                        <p className="text-sm text-gray-500">Mobile Money (Orange, MTN, Moov) & Carte Bancaire</p>
                      </div>
                    </div>
                    <CreditCard className="w-6 h-6 text-gray-400" />
                  </div>

                  {/* Option Carte Bancaire (Mock) */}
                  <div
                    className={`border p-4 rounded-lg cursor-pointer flex items-center justify-between transition-colors ${checkoutState.paymentMethod === 'card'
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                    onClick={() => setCheckoutState(prev => ({ ...prev, paymentMethod: 'card' }))}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-4 ${checkoutState.paymentMethod === 'card' ? 'border-black' : 'border-gray-300'
                        }`}>
                        {checkoutState.paymentMethod === 'card' && (
                          <div className="w-3 h-3 rounded-full bg-black"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">Carte Bancaire (Test)</p>
                        <p className="text-sm text-gray-500">Paiement direct (Simulation)</p>
                      </div>
                    </div>
                    <CreditCard className="w-6 h-6 text-gray-400" />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleNextStep}
                    disabled={!checkoutState.paymentMethod}
                    className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continuer
                  </button>
                </div>
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

                <div className="flex justify-end mt-6">
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Traitement...' : 'Confirmer et Payer'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-6 rounded-lg h-fit">
            <h3 className="text-lg font-semibold mb-4">Résumé de commande</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total</span>
                <span>{cartTotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Livraison</span>
                <span>{shipping.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes (20%)</span>
                <span>{tax.toFixed(2)} €</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-green-600">
                  <span>Réduction ({appliedPromo.code})</span>
                  <span>-{discount.toFixed(2)} €</span>
                </div>
              )}
              <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Code promo"
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-black focus:border-black"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button
                  onClick={applyPromoCode}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                >
                  Appliquer
                </button>
              </div>
              {promoError && <p className="text-red-500 text-sm mt-2">{promoError}</p>}
              {appliedPromo && (
                <div className="flex justify-between items-center mt-2 bg-green-50 p-2 rounded text-sm text-green-700">
                  <span>Code appliqué !</span>
                  <button onClick={removePromoCode} className="text-red-500 hover:text-red-700">×</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}