import { useState, useEffect } from 'react';
import { ArrowLeft, Package, MapPin, CreditCard, Sparkles, Printer, Truck, ShieldCheck } from 'lucide-react';
import { orderService } from '../services/orderService';
import { Order, OrderItem } from '../types/order';
import { formatPrice } from '../utils';
import { getImageUrl } from '../utils/imageUtils';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';

interface OrderDetailsPageProps {
  orderId: string;
  onClose: () => void;
}

export default function OrderDetailsPage({ orderId, onClose }: OrderDetailsPageProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrder(orderId);
        setOrder(data);
      } catch (error) {
        console.error('Erreur commande:', error);
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
          <p className="font-serif text-base text-stone-700">Chargement de la commande...</p>
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
              Impossible d'accéder aux informations de la commande #{orderId}.
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return { label: 'Livrée avec succès', classes: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'shipped':
        return { label: 'Colis expédié', classes: 'bg-stone-100 text-stone-900 border-stone-300' };
      case 'processing':
        return { label: 'En confection', classes: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'confirmed':
        return { label: 'Paiement confirmé', classes: 'bg-stone-900 text-white border-stone-900' };
      case 'cancelled':
        return { label: 'Commande annulée', classes: 'bg-red-50 text-red-700 border-red-200' };
      default:
        return { label: 'Enregistrée', classes: 'bg-stone-100 text-stone-700 border-stone-200' };
    }
  };

  const badge = getStatusBadge(order.status);

  return (
    <div className="fixed inset-0 bg-[#FAF9F6] text-stone-900 selection:bg-stone-900 selection:text-white z-50 overflow-y-auto">
      {/* Top Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-stone-200/80 px-6 sm:px-10 py-4 flex items-center justify-between">
        <button
          onClick={onClose}
          className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-500 hover:text-stone-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Retour</span>
        </button>

        <Logo className="h-6" />

        <button
          onClick={() => window.print()}
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-stone-950"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimer</span>
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Banner */}
        <div className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-stone-100 text-stone-700 border border-stone-200 mb-3">
                <Sparkles className="w-3 h-3 text-terracotta-500" />
                Facture & Récapitulatif
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-stone-950">
                Commande #{order.order_number || order.id}
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                Enregistrée le {new Date(order.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${badge.classes}`}>
                {badge.label}
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Articles list */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="font-serif text-lg font-medium text-stone-950">
                Articles commandés ({order.order_items?.length || 0})
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
                        {item.product?.name || 'Création Atelier Stell\'s Hope'}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-1">
                        {item.size && <span>Taille : {item.size}</span>}
                        {item.color && <span>Nuance : {item.color}</span>}
                        <span>Qté : {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right font-serif text-sm font-semibold text-stone-950">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking banner CTA */}
            <div className="p-6 rounded-3xl bg-stone-950 text-white flex flex-wrap items-center justify-between gap-4 shadow-card-luxury">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Truck className="w-6 h-6 text-rose-300" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-medium">Suivre l'acheminement en direct</h3>
                  <p className="text-xs text-white/70">Consultez chaque étape de la préparation à la remise.</p>
                </div>
              </div>
              <button
                onClick={() => { onClose(); navigate(`/order-tracking/${order.id}`); }}
                className="px-5 py-2.5 rounded-full bg-white text-stone-950 text-xs font-semibold tracking-wider uppercase hover:bg-stone-100 transition-colors"
              >
                Accéder au suivi
              </button>
            </div>
          </div>

          {/* Right Sidebar: Details */}
          <div className="lg:col-span-4 space-y-6">
            {/* Financial Summary */}
            <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-serif text-base font-medium text-stone-950">
                Paiement & Montant
              </h3>
              <div className="space-y-2.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Sous-total articles</span>
                  <span className="font-serif font-medium text-stone-900">{formatPrice(order.total || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison sécurisée</span>
                  <span className="font-semibold text-emerald-700">Offerte</span>
                </div>
                <div className="pt-3 border-t border-stone-100 flex justify-between font-serif text-base font-bold text-stone-950">
                  <span>Montant Total</span>
                  <span>{formatPrice(order.total || 0)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center gap-2 text-xs text-stone-500">
                <CreditCard className="w-4 h-4 text-stone-400" />
                <span>
                  {order.payment_method === 'card' ? 'Carte Bancaire (3D Secure)' :
                   order.payment_method === 'mobile_money' ? 'Mobile Money (Moneroo)' :
                   'Paiement sécurisé Moneroo'}
                </span>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
                <MapPin className="w-4 h-4 text-terracotta-500" />
                <span>Adresse de livraison</span>
              </div>
              <div className="text-xs text-stone-700 leading-relaxed">
                <p className="font-serif font-medium text-sm text-stone-900">
                  {order.shipping_first_name || order.user?.first_name} {order.shipping_last_name || order.user?.last_name}
                </p>
                <p className="mt-1">{order.shipping_address || order.user?.address || 'Adresse renseignée à la commande'}</p>
                <p>{order.shipping_postal_code || order.user?.postal_code} {order.shipping_city || order.user?.city}</p>
                <p>{order.shipping_country || order.user?.country || 'Côte d\'Ivoire'}</p>
                {(order.shipping_phone || order.user?.phone) && (
                  <p className="mt-2 text-stone-500">Tél : {order.shipping_phone || order.user?.phone}</p>
                )}
              </div>
            </div>

            {/* Assistance badge */}
            <div className="p-5 rounded-2xl bg-stone-100/70 border border-stone-200/60 flex items-start gap-3 text-xs text-stone-600">
              <ShieldCheck className="w-5 h-5 text-stone-800 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-stone-900">Service Conciergerie</p>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Une question sur cette commande ? Nos stylistes et conseillers sont à votre écoute du lundi au samedi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}