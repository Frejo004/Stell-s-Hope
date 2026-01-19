import { useState, useMemo } from 'react';
import { Truck, CreditCard, CheckCircle, ShieldCheck, Lock } from 'lucide-react';
import { useCartContext } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Order } from '../types/order';
import { CheckoutState } from '../types/checkout';
import OrderConfirmationPage from './OrderConfirmationPage';
import { useProducts } from '../hooks/useProducts';
import { paymentService } from '../services/paymentService';
import { orderService } from '../services/orderService';

interface CheckoutPageProps {
  onClose: () => void;
  onOrderComplete?: (order: Order) => void;
}

export default function CheckoutPage({ onClose, onOrderComplete }: CheckoutPageProps) {
  const { guestCart, cartTotal, clearCart } = useCartContext();
  const { products } = useProducts();
  const { isAuthenticated, user: authUser, loading } = useAuth();
  const navigate = useNavigate();

  // Initialiser les valeurs par défaut avec les données de l'utilisateur si connecté
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    step: 'shipping',
    shippingAddress: {
      firstName: authUser?.first_name || '',
      lastName: authUser?.last_name || '',
      email: authUser?.email || '',
      street: authUser?.address || '',
      city: authUser?.city || '',
      postalCode: authUser?.postal_code || '',
      country: authUser?.country || 'France'
    },
    billingAddress: {},
    paymentMethod: 'moneroo', // Par défaut pour inciter
    sameAsShipping: true
  });

  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [promoError, setPromoError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const hydratedCart = useMemo(() => guestCart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }), [guestCart, products]);

  const shipping = cartTotal > 100 ? 0 : 5.99; // Livraison gratuite > 100€
  const discount = appliedPromo ?
    (appliedPromo.type === 'percentage' ? cartTotal * (appliedPromo.value / 100) : appliedPromo.value) : 0;

  // Calcul total (TVA incluse implicitement ou ajoutée selon regle, ici on suppose incluse dans prix produit pour simplicité affichage client)
  const finalTotal = Math.max(0, cartTotal + shipping - discount);

  const handleNextStep = (): void => {
    if (checkoutState.step === 'shipping') {
      if (!checkoutState.shippingAddress.firstName || !checkoutState.shippingAddress.street || !checkoutState.shippingAddress.email) {
        setErrorMsg('Veuillez remplir tous les champs obligatoires.');
        return;
      }
      setErrorMsg('');
      setCheckoutState((prev) => ({ ...prev, step: 'payment' }));
    } else if (checkoutState.step === 'payment') {
      setCheckoutState((prev) => ({ ...prev, step: 'review' }));
    }
  };

  const applyPromoCode = async (): Promise<void> => {
    // Simulation simple pour l'UI, à connecter au backend réel si endpoint dispo
    if (promoCode.toUpperCase() === 'WELCOME10') {
      setAppliedPromo({ code: 'WELCOME10', type: 'percentage', value: 10 });
      setPromoError('');
    } else {
      setPromoError('Code promo invalide');
    }
  };

  const handlePlaceOrder = async (): Promise<void> => {
    setIsProcessing(true);
    setErrorMsg('');

    try {
      // 1. Créer la commande d'abord
      const orderPayload = {
        shipping_address: {
          first_name: checkoutState.shippingAddress.firstName || '',
          last_name: checkoutState.shippingAddress.lastName || '',
          street: checkoutState.shippingAddress.street || '',
          city: checkoutState.shippingAddress.city || '',
          postal_code: checkoutState.shippingAddress.postalCode || '',
          country: checkoutState.shippingAddress.country || ''
        },
        billing_address: checkoutState.sameAsShipping ? {
          first_name: checkoutState.shippingAddress.firstName || '',
          last_name: checkoutState.shippingAddress.lastName || '',
          street: checkoutState.shippingAddress.street || '',
          city: checkoutState.shippingAddress.city || '',
          postal_code: checkoutState.shippingAddress.postalCode || '',
          country: checkoutState.shippingAddress.country || ''
        } : {
          // Si différent, mapper billingAddress ici
          first_name: checkoutState.shippingAddress.firstName || '', // Fallback
          last_name: checkoutState.shippingAddress.lastName || '',
          street: '',
          city: '',
          postal_code: '',
          country: ''
        },
        payment_method: checkoutState.paymentMethod || 'card',
        items: hydratedCart.map(item => ({
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price || item.product?.price || 0
        }))
      };

      // Appel API création commande
      // Note: Assurez-vous que orderService.createOrder pointe bien vers POST /api/orders
      // Si l'API attend un format spécifique, ajustez ici.
      let orderResponse;
      try {
        orderResponse = await orderService.createOrder(orderPayload);
      } catch (err) {
        console.error("Erreur création commande", err);
        throw new Error("Impossible de créer la commande. Vérifiez votre panier.");
      }

      if (!orderResponse || !orderResponse.id) {
        throw new Error("Réponse de commande invalide");
      }

      const orderId = orderResponse.id;

      // 2. Initier le paiement
      if (checkoutState.paymentMethod === 'moneroo') {
        const paymentResponse = await paymentService.initiatePayment({
          order_id: orderId,
          amount: finalTotal // Optionnel si le backend utilise le total de l'order
        });

        if (paymentResponse.checkout_url) {
          window.location.href = paymentResponse.checkout_url;
        } else {
          throw new Error("Pas d'URL de paiement reçue");
        }
      } else {
        // Simulation Paiement Carte "Test" direct
        // Dans un vrai cas, on appellerait Stripe/autre ici
        // Simulation Paiement Carte "Test" direct
        // Dans un vrai cas, on appellerait Stripe/autre ici
        setTimeout(async () => {
          try {
            // Récupérer la commande complète avec relations pour l'affichage
            const fullOrder = await orderService.getOrder(orderId);
            setCompletedOrder(fullOrder);
            clearCart();
            if (onOrderComplete) onOrderComplete(fullOrder);
          } catch (e) {
            // Fallback sur la réponse de création si le fetch échoue
            console.error("Erreur récupération commande complète", e);
            setCompletedOrder(orderResponse);
            clearCart();
            if (onOrderComplete) onOrderComplete(orderResponse);
          }
        }, 1500);
      }

    } catch (error: any) {
      console.error('Payment error:', error);
      setErrorMsg(error.message || 'Une erreur est survenue lors du traitement.');
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

  // Loader d'auth
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  // Login requis
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/90 backdrop-blur-sm p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-900">Connectez-vous</h2>
          <p className="text-gray-500 mb-8">Pour sécuriser votre commande et suivre sa livraison, veuillez vous identifier.</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/login', { state: { from: '/cart' } })}
              className="w-full bg-black text-white py-3.5 rounded-xl font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
            >
              Se connecter / S'inscrire
            </button>
            <button
              onClick={onClose}
              className="w-full text-gray-500 py-3 font-medium hover:text-gray-900"
            >
              Retour au panier
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] bg-gray-50 overflow-hidden flex flex-col">
      {/* Checkout Progress Bar */}
      <div className="bg-white border-b px-4 lg:px-8 py-4 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold hidden sm:block">Paiement Sécurisé</h1>
          </div>

          {/* Steps Indicator */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {[
              { id: 'shipping', label: 'Livraison', icon: Truck },
              { id: 'payment', label: 'Paiement', icon: CreditCard },
              { id: 'review', label: 'Confirmer', icon: CheckCircle }
            ].map((s, idx) => {
              const isActive = checkoutState.step === s.id;
              const isCompleted = ['shipping', 'payment', 'review'].indexOf(checkoutState.step) > idx;
              const Icon = s.icon;
              return (
                <div key={s.id} className={`flex items-center ${isActive ? 'text-black' : isCompleted ? 'text-green-600' : 'text-gray-300'}`}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${isActive ? 'border-black bg-black text-white' :
                    isCompleted ? 'border-green-600 bg-green-600 text-white' :
                      'border-gray-200 bg-transparent'
                    }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`hidden sm:block ml-2 text-sm font-medium ${isActive ? 'text-black' : 'text-gray-400'}`}>{s.label}</span>
                  {idx < 2 && <div className={`w-8 h-0.5 mx-2 hidden sm:block ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}`} />}
                </div>
              );
            })}
          </div>

          <div className="flex items-center text-green-600 text-xs sm:text-sm font-medium">
            <ShieldCheck className="w-4 h-4 mr-1.5" />
            <span className="hidden sm:inline">Crypté SSL</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 h-full overflow-hidden w-full">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 h-full">

          {/* Colonne Principale (Gauche) */}
          <div className="flex-1 overflow-y-auto pr-2 pb-20 no-scrollbar">
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center">
                <span className="mr-2">⚠️</span> {errorMsg}
              </div>
            )}

            {/* Étape 1: Livraison */}
            {checkoutState.step === 'shipping' && (
              <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold mb-6">Adresse de livraison</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Prénom</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                      placeholder="Jean"
                      value={checkoutState.shippingAddress.firstName}
                      onChange={(e) => setCheckoutState(prev => ({ ...prev, shippingAddress: { ...prev.shippingAddress, firstName: e.target.value } }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Nom</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                      placeholder="Dupont"
                      value={checkoutState.shippingAddress.lastName}
                      onChange={(e) => setCheckoutState(prev => ({ ...prev, shippingAddress: { ...prev.shippingAddress, lastName: e.target.value } }))}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                      placeholder="jean.dupont@email.com"
                      value={checkoutState.shippingAddress.email}
                      onChange={(e) => setCheckoutState(prev => ({ ...prev, shippingAddress: { ...prev.shippingAddress, email: e.target.value } }))}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Adresse</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                      placeholder="123 Rue de la Liberté"
                      value={checkoutState.shippingAddress.street}
                      onChange={(e) => setCheckoutState(prev => ({ ...prev, shippingAddress: { ...prev.shippingAddress, street: e.target.value } }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Code postal</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                      placeholder="75001"
                      value={checkoutState.shippingAddress.postalCode}
                      onChange={(e) => setCheckoutState(prev => ({ ...prev, shippingAddress: { ...prev.shippingAddress, postalCode: e.target.value } }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Ville</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                      placeholder="Paris"
                      value={checkoutState.shippingAddress.city}
                      onChange={(e) => setCheckoutState(prev => ({ ...prev, shippingAddress: { ...prev.shippingAddress, city: e.target.value } }))}
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleNextStep}
                    className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Continuer vers le paiement
                  </button>
                </div>
              </div>
            )}

            {/* Étape 2: Paiement */}
            {checkoutState.step === 'payment' && (
              <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold mb-6">Moyen de paiement</h2>

                <div className="space-y-4">
                  {/* Moneroo */}
                  <label className={`relative flex items-center p-6 border-2 rounded-xl cursor-pointer transition-all ${checkoutState.paymentMethod === 'moneroo' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-200'
                    }`}>
                    <input
                      type="radio"
                      name="payment"
                      className="sr-only"
                      checked={checkoutState.paymentMethod === 'moneroo'}
                      onChange={() => setCheckoutState(prev => ({ ...prev, paymentMethod: 'moneroo' }))}
                    />
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${checkoutState.paymentMethod === 'moneroo' ? 'border-black' : 'border-gray-300'
                      }`}>
                      {checkoutState.paymentMethod === 'moneroo' && <div className="w-3 h-3 bg-black rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-lg">Paiement Sécurisé (Moneroo)</span>
                        <div className="flex gap-2">
                          <img src="https://logowik.com/content/uploads/images/orange-money-icon1083.logowik.com.webp" alt="OM" className="h-6 object-contain" />
                          <img src="https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg" alt="Crypto" className="h-6 object-contain" />
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm">Mobile Money (Orange, MTN, Moov) et Cartes Bancaires. Redirection sécurisée.</p>
                    </div>
                  </label>

                  {/* Card Test */}
                  <label className={`relative flex items-center p-6 border-2 rounded-xl cursor-pointer transition-all ${checkoutState.paymentMethod === 'card' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-200'
                    }`}>
                    <input
                      type="radio"
                      name="payment"
                      className="sr-only"
                      checked={checkoutState.paymentMethod === 'card'}
                      onChange={() => setCheckoutState(prev => ({ ...prev, paymentMethod: 'card' }))}
                    />
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${checkoutState.paymentMethod === 'card' ? 'border-black' : 'border-gray-300'
                      }`}>
                      {checkoutState.paymentMethod === 'card' && <div className="w-3 h-3 bg-black rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-lg">Carte Bancaire (Test)</span>
                        <CreditCard className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">Simulation de paiement direct pour le développement.</p>
                    </div>
                  </label>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setCheckoutState(prev => ({ ...prev, step: 'shipping' }))}
                    className="text-gray-500 font-medium px-6 py-4 hover:text-black transition-colors"
                  >
                    Retour
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Vérifier la commande
                  </button>
                </div>
              </div>
            )}

            {/* Étape 3: Review */}
            {checkoutState.step === 'review' && (
              <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold mb-6">Confirmer la commande</h2>

                <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h3 className="font-semibold mb-2 text-gray-900">Adresse de livraison</h3>
                  <p className="text-gray-600 pl-4 border-l-2 border-gray-300 text-sm leading-relaxed">
                    {checkoutState.shippingAddress.firstName} {checkoutState.shippingAddress.lastName}<br />
                    {checkoutState.shippingAddress.street}<br />
                    {checkoutState.shippingAddress.postalCode} {checkoutState.shippingAddress.city}<br />
                    {checkoutState.shippingAddress.country}
                  </p>
                  <button onClick={() => setCheckoutState(prev => ({ ...prev, step: 'shipping' }))} className="text-sm font-medium text-black mt-3 hover:underline">Modifier</button>
                </div>

                <h3 className="font-semibold mb-4 text-gray-900">Articles ({hydratedCart.reduce((acc, i) => acc + i.quantity, 0)})</h3>
                <div className="space-y-6">
                  {hydratedCart.map((item) => (
                    <div key={item.productId} className="flex gap-4 p-4 border rounded-xl hover:border-gray-300 transition-colors bg-white">
                      <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        <img src={item.image || ''} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-900 line-clamp-2">{item.name}</h4>
                          <span className="font-bold text-gray-900 ml-4 whitespace-nowrap">{((item.price || 0) * item.quantity).toFixed(2)} €</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Quantité: <span className="text-black font-medium">{item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t flex justify-between items-center">
                  <button
                    onClick={() => setCheckoutState(prev => ({ ...prev, step: 'payment' }))}
                    className="text-gray-500 font-medium px-6 py-4 hover:text-black transition-colors"
                  >
                    Retour
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Colonne Latérale Sticky (Droite) - Résumé */}
          <div className="lg:w-1/3 overflow-y-auto pb-20 no-scrollbar">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                Résumé
                <span className="ml-2 text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {hydratedCart.length} articles
                </span>
              </h3>

              <div className="space-y-4 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span className="font-medium text-gray-900">{cartTotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison</span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-medium">Gratuite</span>
                  ) : (
                    <span className="font-medium text-gray-900">{shipping.toFixed(2)} €</span>
                  )}
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-green-600 bg-green-50 p-2 rounded-lg">
                    <span>Code "{appliedPromo.code}"</span>
                    <span>-{discount.toFixed(2)} €</span>
                  </div>
                )}
                <div className="pt-4 border-t flex justify-between items-end">
                  <span className="font-medium text-gray-900 text-lg">Total</span>
                  <div className="text-right">
                    <span className="font-bold text-2xl text-black block">{finalTotal.toFixed(2)} €</span>
                    <span className="text-xs text-gray-400">TVA incluse</span>
                  </div>
                </div>
              </div>

              {/* Code promo */}
              <div className="mb-6">
                <div className="relative flex">
                  <input
                    type="text"
                    placeholder="Code promo"
                    className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none uppercase text-sm"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button
                    onClick={applyPromoCode}
                    className="absolute right-2 top-2 bg-white text-black text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    APPLIQUER
                  </button>
                </div>
                {promoError && <p className="text-red-500 text-xs mt-2 pl-1">{promoError}</p>}
              </div>

              {/* Submit Button Global (si étape finale) */}
              {checkoutState.step === 'review' && (
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center ${isProcessing ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-900'
                    }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                      Traitement...
                    </>
                  ) : (
                    'Payer maintenant'
                  )}
                </button>
              )}

              <p className="mt-4 text-xs text-gray-400 text-center leading-relaxed">
                En validant votre commande, vous acceptez nos <a href="#" className="underline hover:text-gray-600">conditions générales de vente</a> et notre politique de confidentialité.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>

  );
}