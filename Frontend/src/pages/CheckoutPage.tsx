import { useState, useMemo } from 'react';
import { Truck, CreditCard, CheckCircle, ShieldCheck, Lock, ArrowLeft, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { useCartContext } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Order } from '../types/order';
import { CheckoutState } from '../types/checkout';
import OrderConfirmationPage from './OrderConfirmationPage';
import { useProducts } from '../hooks/useProducts';
import { paymentService } from '../services/paymentService';
import { orderService } from '../services/orderService';
import { commerce, formatPrice } from '../utils';
import { BUSINESS_CONSTANTS } from '../constants';

interface CheckoutPageProps {
  onClose: () => void;
  onOrderComplete?: (order: Order) => void;
}

export default function CheckoutPage({ onClose, onOrderComplete }: CheckoutPageProps) {
  const { cart, cartTotal, clearCart } = useCartContext();
  const { products } = useProducts();
  const { isAuthenticated, user: authUser, loading } = useAuth();
  const navigate = useNavigate();

  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    step: 'shipping',
    shippingAddress: {
      firstName: authUser?.first_name || '',
      lastName: authUser?.last_name || '',
      email: authUser?.email || '',
      street: authUser?.address || '',
      city: authUser?.city || 'Abidjan',
      postalCode: authUser?.postal_code || '',
      country: authUser?.country || "Côte d'Ivoire"
    },
    billingAddress: {},
    paymentMethod: 'moneroo',
    sameAsShipping: true
  });

  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; type: 'percentage' | 'fixed'; value: number } | null>(null);
  const [serverOrderTotal, setServerOrderTotal] = useState<number | null>(null);
  const [promoError, setPromoError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const hydratedCart = useMemo(() => cart.map((item: any) => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }), [cart, products]);

  const shipping = commerce.calculateShipping(cartTotal);
  const discount = appliedPromo ?
    (appliedPromo.type === 'percentage' ? cartTotal * (appliedPromo.value / 100) : appliedPromo.value) : 0;

  const finalTotal = Math.max(0, cartTotal + shipping - discount);

  const handleNextStep = (): void => {
    if (checkoutState.step === 'shipping') {
      if (!checkoutState.shippingAddress.firstName || !checkoutState.shippingAddress.street || !checkoutState.shippingAddress.email) {
        setErrorMsg('Veuillez renseigner votre prénom, email et adresse de livraison.');
        return;
      }
      setErrorMsg('');
      setCheckoutState((prev) => ({ ...prev, step: 'payment' }));
    } else if (checkoutState.step === 'payment') {
      setCheckoutState((prev) => ({ ...prev, step: 'review' }));
    }
  };

  const applyPromoCode = async (): Promise<void> => {
    if (!promoCode.trim()) return;
    setPromoError('');
    try {
      const res = await import('../services/api').then(m => m.default.post('/promotions/validate', {
        code: promoCode.trim().toUpperCase(),
        subtotal: cartTotal,
      }));
      const promo = res.data;
      setAppliedPromo({ code: promo.code, type: promo.type, value: Number(promo.value) });
    } catch {
      setPromoError('Code privilège invalide ou expiré.');
      setAppliedPromo(null);
    }
  };

  const handlePlaceOrder = async (): Promise<void> => {
    setIsProcessing(true);
    setErrorMsg('');

    try {
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
          first_name: checkoutState.billingAddress.firstName || '',
          last_name: checkoutState.billingAddress.lastName || '',
          street: checkoutState.billingAddress.street || '',
          city: checkoutState.billingAddress.city || '',
          postal_code: checkoutState.billingAddress.postalCode || '',
          country: checkoutState.billingAddress.country || ''
        },
        payment_method: checkoutState.paymentMethod || 'moneroo',
        items: hydratedCart.map(item => ({
          product_id: item.productId,
          quantity: item.quantity
        })),
        promotion_code: appliedPromo?.code
      };

      let orderResponse;
      try {
        orderResponse = await orderService.createOrder(orderPayload, idempotencyKey);
      } catch (err) {
        console.error("Erreur création commande", err);
        throw new Error("Impossible de créer la commande. Vérifiez votre panier.");
      }

      if (!orderResponse || !orderResponse.id) {
        throw new Error("Réponse de commande invalide");
      }

      const orderId = orderResponse.id;
      setServerOrderTotal(Number(orderResponse.total));

      if (checkoutState.paymentMethod === 'moneroo') {
        const paymentResponse = await paymentService.initiatePayment({
          order_id: orderId
        });

        if (paymentResponse.checkout_url) {
          window.location.href = paymentResponse.checkout_url;
        } else {
          throw new Error("Lien de paiement sécurisé non reçu.");
        }
      } else {
        // Mode Simulation direct pour Carte Test
        setTimeout(async () => {
          try {
            const fullOrder = await orderService.getOrder(orderId);
            setCompletedOrder(fullOrder);
            clearCart();
            if (onOrderComplete) onOrderComplete(fullOrder);
          } catch (e) {
            console.error("Erreur récupération commande complète", e);
            setCompletedOrder(orderResponse);
            clearCart();
            if (onOrderComplete) onOrderComplete(orderResponse);
          }
        }, 1500);
      }

    } catch (error) {
      console.error('Payment error:', error);
      setErrorMsg(error instanceof Error ? error.message : 'Une erreur est survenue lors du traitement.');
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

  // Loader d'authentification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="w-10 h-10 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Invitation à se connecter pour sécuriser l'achat
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] p-4 sm:p-6">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/60 shadow-card max-w-md w-full text-center space-y-5">
          <div className="w-16 h-16 bg-stone-100 rounded-3xl flex items-center justify-center mx-auto text-stone-900 shadow-sm">
            <Lock className="w-7 h-7 text-stone-800" />
          </div>
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-950">
              Identification Requise
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-light mt-2 leading-relaxed">
              Pour assurer le suivi personnalisé et la sécurité de votre commande, veuillez vous connecter ou créer un compte.
            </p>
          </div>
          <div className="space-y-2 pt-2">
            <button
              onClick={() => navigate('/login', { state: { from: '/checkout' } })}
              className="w-full py-3.5 bg-stone-950 hover:bg-black text-white rounded-full text-xs uppercase tracking-widest font-semibold transition-all shadow-md hover:shadow-lg"
            >
              Se connecter / Créer un compte
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 text-xs text-stone-500 hover:text-stone-950 font-medium transition-colors"
            >
              Retourner au panier
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 pb-24">
      {/* ─── Barre Supérieure & Stepper de Commande ─────────────────── */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500 hover:text-stone-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Quitter</span>
          </button>

          {/* Stepper en 3 étapes moderne */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {[
              { id: 'shipping', label: 'Livraison', stepNum: '1' },
              { id: 'payment', label: 'Paiement', stepNum: '2' },
              { id: 'review', label: 'Confirmation', stepNum: '3' }
            ].map((s, idx) => {
              const isActive = checkoutState.step === s.id;
              const isCompleted = ['shipping', 'payment', 'review'].indexOf(checkoutState.step) > idx;

              return (
                <div key={s.id} className="flex items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-stone-950 text-white shadow-sm ring-4 ring-stone-100'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-100 text-stone-400'
                    }`}
                  >
                    {isCompleted ? '✓' : s.stepNum}
                  </div>
                  <span
                    className={`ml-2 text-xs uppercase tracking-wider hidden md:inline ${
                      isActive ? 'font-bold text-stone-950' : 'font-medium text-stone-400'
                    }`}
                  >
                    {s.label}
                  </span>
                  {idx < 2 && (
                    <div
                      className={`w-6 sm:w-10 h-0.5 mx-2 rounded-full ${
                        isCompleted ? 'bg-emerald-600' : 'bg-stone-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">SSL 256 bits</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ─── Colonne Formulaire (Gauche - 7 cols) ───────────────── */}
          <div className="lg:col-span-7 space-y-6">
            {errorMsg && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Étape 1 : Coordonnées de Livraison */}
            {checkoutState.step === 'shipping' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/60 shadow-sm space-y-6">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Étape 1 sur 3</span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-950 mt-1">
                    Adresse de Livraison
                  </h2>
                  <p className="text-xs text-stone-500 font-light mt-1">
                    Indiquez où vous souhaitez recevoir vos articles.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-wider font-semibold text-stone-700">Prénom *</label>
                    <input
                      type="text"
                      required
                      placeholder="Votre prénom"
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200/80 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-400/20 focus:border-stone-400 transition-all"
                      value={checkoutState.shippingAddress.firstName}
                      onChange={(e) => setCheckoutState(prev => ({ ...prev, shippingAddress: { ...prev.shippingAddress, firstName: e.target.value } }))}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-wider font-semibold text-stone-700">Nom *</label>
                    <input
                      type="text"
                      required
                      placeholder="Votre nom"
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200/80 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-400/20 focus:border-stone-400 transition-all"
                      value={checkoutState.shippingAddress.lastName}
                      onChange={(e) => setCheckoutState(prev => ({ ...prev, shippingAddress: { ...prev.shippingAddress, lastName: e.target.value } }))}
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs uppercase tracking-wider font-semibold text-stone-700">Email de confirmation *</label>
                    <input
                      type="email"
                      required
                      placeholder="nom@exemple.com"
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200/80 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-400/20 focus:border-stone-400 transition-all"
                      value={checkoutState.shippingAddress.email}
                      onChange={(e) => setCheckoutState(prev => ({ ...prev, shippingAddress: { ...prev.shippingAddress, email: e.target.value } }))}
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs uppercase tracking-wider font-semibold text-stone-700">Adresse de livraison (Rue, Quartier, Repères) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Cocody Riviera Golf, Villa 12"
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200/80 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-400/20 focus:border-stone-400 transition-all"
                      value={checkoutState.shippingAddress.street}
                      onChange={(e) => setCheckoutState(prev => ({ ...prev, shippingAddress: { ...prev.shippingAddress, street: e.target.value } }))}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-wider font-semibold text-stone-700">Ville / Commune *</label>
                    <input
                      type="text"
                      placeholder="Abidjan"
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200/80 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-400/20 focus:border-stone-400 transition-all"
                      value={checkoutState.shippingAddress.city}
                      onChange={(e) => setCheckoutState(prev => ({ ...prev, shippingAddress: { ...prev.shippingAddress, city: e.target.value } }))}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-wider font-semibold text-stone-700">Pays *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200/80 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-400/20 focus:border-stone-400 transition-all"
                      value={checkoutState.shippingAddress.country}
                      onChange={(e) => setCheckoutState(prev => ({ ...prev, shippingAddress: { ...prev.shippingAddress, country: e.target.value } }))}
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-stone-950 hover:bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-full shadow-md transition-all hover:scale-[1.01]"
                  >
                    <span>Continuer vers le paiement</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Étape 2 : Mode de Paiement */}
            {checkoutState.step === 'payment' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/60 shadow-sm space-y-6">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Étape 2 sur 3</span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-950 mt-1">
                    Moyen de Paiement
                  </h2>
                  <p className="text-xs text-stone-500 font-light mt-1">
                    Sélectionnez votre mode de règlement sécurisé.
                  </p>
                </div>

                <div className="space-y-3.5">
                  {/* Moneroo (Mobile Money + Cartes) */}
                  <label
                    className={`block p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      checkoutState.paymentMethod === 'moneroo'
                        ? 'border-stone-950 bg-stone-50/70 shadow-sm'
                        : 'border-stone-200/70 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={checkoutState.paymentMethod === 'moneroo'}
                        onChange={() => setCheckoutState(prev => ({ ...prev, paymentMethod: 'moneroo' }))}
                        className="mt-1 accent-stone-950 h-4 w-4"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-bold text-stone-950">
                            Paiement Sécurisé Moneroo
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-stone-900 text-white rounded-full">
                            Recommandé
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 font-light mt-1 leading-relaxed">
                          Réglez instantanément avec <strong>Wave, Orange Money, MTN Moov</strong> ou par <strong>Carte Bancaire (Visa / Mastercard)</strong>. Redirection chiffrée.
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-stone-200/50 text-[10px] text-stone-600 font-medium">
                          <span className="bg-white px-2 py-0.5 rounded border border-stone-200">Wave</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-stone-200">Orange Money</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-stone-200">MTN MoMo</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-stone-200">Moov Money</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-stone-200">Visa / Mastercard</span>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Mode Test Développeur */}
                  <label
                    className={`block p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      checkoutState.paymentMethod === 'card'
                        ? 'border-stone-950 bg-stone-50/70 shadow-sm'
                        : 'border-stone-200/70 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={checkoutState.paymentMethod === 'card'}
                        onChange={() => setCheckoutState(prev => ({ ...prev, paymentMethod: 'card' }))}
                        className="mt-1 accent-stone-950 h-4 w-4"
                      />
                      <div className="flex-1">
                        <span className="text-xs sm:text-sm font-bold text-stone-950 block">
                          Simulation Carte Bancaire (Mode Démo)
                        </span>
                        <p className="text-xs text-stone-500 font-light mt-1">
                          Valide immédiatement la commande à des fins de test local sans prélèvement bancaire réel.
                        </p>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-stone-100">
                  <button
                    onClick={() => setCheckoutState(prev => ({ ...prev, step: 'shipping' }))}
                    className="text-xs font-semibold uppercase tracking-wider text-stone-500 hover:text-stone-950 transition-colors"
                  >
                    Retour à la livraison
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-stone-950 hover:bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-full shadow-md transition-all hover:scale-[1.01]"
                  >
                    <span>Vérifier ma commande</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Étape 3 : Confirmation finale */}
            {checkoutState.step === 'review' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/60 shadow-sm space-y-6">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Étape 3 sur 3</span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-950 mt-1">
                    Vérification Finale
                  </h2>
                  <p className="text-xs text-stone-500 font-light mt-1">
                    Assurez-vous que toutes les informations sont exactes avant le paiement.
                  </p>
                </div>

                {/* Récapitulatif Adresse */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60 flex items-start justify-between">
                  <div className="space-y-1 text-xs">
                    <span className="font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-500" />
                      Adresse de livraison :
                    </span>
                    <p className="text-stone-700 font-medium">
                      {checkoutState.shippingAddress.firstName} {checkoutState.shippingAddress.lastName}
                    </p>
                    <p className="text-stone-500 font-light">
                      {checkoutState.shippingAddress.street}, {checkoutState.shippingAddress.city} ({checkoutState.shippingAddress.country})
                    </p>
                    <p className="text-stone-500 font-light">
                      Email : {checkoutState.shippingAddress.email}
                    </p>
                  </div>
                  <button
                    onClick={() => setCheckoutState(prev => ({ ...prev, step: 'shipping' }))}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline"
                  >
                    Modifier
                  </button>
                </div>

                {/* Récapitulatif Moyen de paiement */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60 flex items-start justify-between">
                  <div className="space-y-1 text-xs">
                    <span className="font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-stone-500" />
                      Moyen de règlement :
                    </span>
                    <p className="text-stone-700 font-medium">
                      {checkoutState.paymentMethod === 'moneroo'
                        ? 'Moneroo (Mobile Money Wave / Orange / MTN & Cartes)'
                        : 'Carte Bancaire (Mode Démo)'}
                    </p>
                  </div>
                  <button
                    onClick={() => setCheckoutState(prev => ({ ...prev, step: 'payment' }))}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline"
                  >
                    Modifier
                  </button>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-stone-100">
                  <button
                    onClick={() => setCheckoutState(prev => ({ ...prev, step: 'payment' }))}
                    className="text-xs font-semibold uppercase tracking-wider text-stone-500 hover:text-stone-950 transition-colors"
                  >
                    Retour au paiement
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className={`inline-flex items-center gap-2 px-9 py-4 rounded-full text-xs uppercase tracking-widest font-semibold transition-all shadow-lg hover:shadow-xl ${
                      isProcessing
                        ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                        : 'bg-stone-950 hover:bg-black text-white hover:scale-[1.01]'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
                        <span>Sécurisation...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Confirmer & Payer {formatPrice(serverOrderTotal ?? finalTotal)}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ─── Colonne Récapitulatif Commande (Droite - 5 cols) ────── */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-stone-200/60 p-6 sm:p-7 shadow-sm space-y-6 lg:sticky lg:top-24">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <h3 className="font-serif text-xl font-normal text-stone-950">
                  Votre Commande
                </h3>
                <span className="text-xs font-semibold bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full">
                  {hydratedCart.reduce((sum, item) => sum + item.quantity, 0)} pièces
                </span>
              </div>

              {/* Liste miniature des articles */}
              <div className="space-y-3.5 max-h-64 overflow-y-auto pr-1 no-scrollbar">
                {hydratedCart.map((item: any, i: number) => (
                  <div key={`${item.productId}-${i}`} className="flex items-center gap-3">
                    <div className="w-14 h-16 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200/60">
                      <img
                        src={item.image || ''}
                        alt={item.name}
                        className="w-full h-full object-cover object-center"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-stone-900 truncate">{item.name}</h4>
                      <p className="text-[11px] text-stone-400">Qté : {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-stone-950 shrink-0">
                      {formatPrice((item.price || 0) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Code promo / privilège */}
              <div className="pt-2 border-t border-stone-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Code Privilège"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-4 py-2 bg-stone-50 border border-stone-200/80 rounded-xl text-xs uppercase text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-400/20"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-semibold rounded-xl transition-colors uppercase tracking-wider"
                  >
                    Appliquer
                  </button>
                </div>
                {promoError && <p className="text-[11px] text-rose-600 mt-1 pl-1">{promoError}</p>}
                {appliedPromo && (
                  <p className="text-[11px] text-emerald-600 mt-1 pl-1 font-medium">
                    Code {appliedPromo.code} appliqué (-{formatPrice(discount)})
                  </p>
                )}
              </div>

              {/* Lignes de calcul */}
              <div className="space-y-2.5 text-xs text-stone-600 border-t border-stone-100 pt-4">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span className="font-semibold text-stone-900">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frais d'expédition</span>
                  {shipping === 0 ? (
                    <span className="text-emerald-700 font-semibold">Offerts</span>
                  ) : (
                    <span className="font-semibold text-stone-900">{formatPrice(shipping)}</span>
                  )}
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Remise ({appliedPromo.code})</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline text-base font-bold text-stone-950 pt-3 border-t border-stone-100">
                  <span>Montant Total</span>
                  <span className="text-xl sm:text-2xl font-serif text-stone-950 font-bold">
                    {formatPrice(serverOrderTotal ?? finalTotal)}
                  </span>
                </div>
              </div>

              {/* Engagement réassurance */}
              <div className="p-3 bg-[#FAF9F6] rounded-2xl border border-stone-200/50 flex items-center justify-center gap-2 text-[10px] text-stone-500 font-light text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Paiement chiffré & expédition soignée Stell's Hope</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
