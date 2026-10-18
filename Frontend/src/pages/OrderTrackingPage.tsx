import { useState, useEffect } from 'react';
import { ArrowLeft, Package, Truck, CheckCircle2, Clock, Sparkles, MapPin, Calendar } from 'lucide-react';
import { orderService } from '../services/orderService';
import { Order, OrderItem } from '../types/order';
import { formatPrice } from '../utils';
import { getImageUrl } from '../utils/imageUtils';
import Logo from '../components/Logo';

interface OrderTrackingPageProps {
  orderId: string;
  onClose: () => void;
}

export default function OrderTrackingPage({ orderId, onClose }: OrderTrackingPageProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrder(orderId);
        setOrder(data);
      } catch (error) {
        console.error('Erreur chargement commande:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#FAF9F6] z-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-stone-300 border-t-stone-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="font-serif text-base text-stone-700">Recherche de votre commande...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="fixed inset-0 bg-[#FAF9F6] z-50 overflow-y-auto p-6 flex flex-col justify-between">
        <div className="max-w-xl mx-auto w-full my-auto text-center py-12">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-500 hover:text-stone-950 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </button>
          <div className="p-8 rounded-3xl bg-white border border-stone-200/80 shadow-sm">
            <h2 className="font-serif text-2xl font-medium text-stone-950 mb-2">Commande introuvable</h2>
            <p className="text-xs text-stone-500 mb-6">
              Aucun détail n'a pu être chargé pour la référence #{orderId}.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-full bg-stone-950 text-white text-xs font-semibold tracking-wider uppercase hover:bg-stone-800 transition-colors shadow-card-luxury"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    { key: 'pending', label: 'Commande reçue', icon: Clock, desc: 'Enregistrée dans nos ateliers' },
    { key: 'confirmed', label: 'Confirmée & préparée', icon: Package, desc: 'Contrôle qualité & confection' },
    { key: 'shipped', label: 'En cours d\'acheminement', icon: Truck, desc: 'Prise en charge par le transporteur' },
    { key: 'delivered', label: 'Remise en mains propres', icon: CheckCircle2, desc: 'Colis livré avec soin' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'delivered': return 3;
      case 'shipped': return 2;
      case 'confirmed':
      case 'processing': return 1;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(order.status);

  return (
    <div className="fixed inset-0 bg-[#FAF9F6] text-stone-900 selection:bg-stone-900 selection:text-white z-50 overflow-y-auto">
      {/* Top Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-stone-200/80 px-6 sm:px-10 py-4 flex items-center justify-between">
        <button
          onClick={onClose}
          className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-500 hover:text-stone-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Retour à l'espace</span>
        </button>

        <Logo className="h-6" />

        <div className="w-20 text-right">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
            Suivi 24/7
          </span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Banner Summary */}
        <div className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-stone-100 text-stone-700 border border-stone-200 mb-2">
                <Sparkles className="w-3 h-3 text-terracotta-500" />
                Expédition Prioritaire Stell's Hope
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-stone-950">
                Commande #{order.order_number || order.id}
              </h1>
              <p className="text-xs text-stone-500 mt-1 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Passée le {new Date(order.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</span>
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-1">Montant total</p>
              <p className="font-serif text-2xl font-bold text-stone-950">
                {formatPrice(order.total)}
              </p>
            </div>
          </div>
        </div>

        {/* Stepper Timeline */}
        <div className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h2 className="font-serif text-lg font-medium text-stone-950 mb-6">
            Étape d'acheminement
          </h2>

          <div className="relative">
            {/* Horizontal line for desktop */}
            <div className="hidden md:block absolute top-6 left-12 right-12 h-0.5 bg-stone-200 -z-0" />
            <div
              className="hidden md:block absolute top-6 left-12 h-0.5 bg-stone-950 transition-all duration-700 -z-0"
              style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isPassed = idx <= currentIndex;
                const isCurrent = idx === currentIndex;

                return (
                  <div key={step.key} className="flex md:flex-col items-center md:text-center gap-4 md:gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isCurrent
                        ? 'bg-stone-950 text-white shadow-card-luxury ring-4 ring-stone-950/10'
                        : isPassed
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-400 border border-stone-200'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`text-xs font-semibold ${isPassed ? 'text-stone-950' : 'text-stone-400'}`}>
                        {step.label}
                      </h3>
                      <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Products in order */}
        <div className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="font-serif text-lg font-medium text-stone-950">
            Contenu du colis ({order.order_items?.length || 0})
          </h2>

          <div className="divide-y divide-stone-100">
            {(order.order_items || []).map((item: OrderItem) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                <div className="w-16 h-20 rounded-2xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200/60">
                  <img
                    src={getImageUrl(item.product?.images?.[0])}
                    alt={item.product?.name || 'Produit'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-sm font-medium text-stone-900 truncate">
                    {item.product?.name || 'Création Stell\'s Hope'}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                    {item.size && <span>Taille : {item.size}</span>}
                    {item.color && <span>Coloris : {item.color}</span>}
                    <span>Quantité : {item.quantity}</span>
                  </div>
                </div>
                <div className="text-right font-serif text-sm font-semibold text-stone-950">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Préparé avec papier de soie & signature olfactive de la Maison</span>
            <span className="font-semibold text-stone-900">Livraison suivie assurée</span>
          </div>
        </div>
      </div>
    </div>
  );
}
