import { CheckCircle, Package, Truck, Mail, Phone, Download, ArrowRight, Sparkles } from 'lucide-react';
import { Order } from '../types/order';
import { getImageUrl } from '../utils/imageUtils';
import { useAuth } from '../hooks/useAuth';
import { formatPrice } from '../utils';

interface OrderConfirmationPageProps {
  order: Order;
  onContinueShopping: () => void;
}

export default function OrderConfirmationPage({ order, onContinueShopping }: OrderConfirmationPageProps) {
  const { user } = useAuth();
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

  const orderItems = order.order_items || order.items || [];
  const orderTotal = order.total || orderItems.reduce((acc: number, item: any) => acc + ((item.price || item.product?.price || 0) * item.quantity), 0);

  return (
    <div className="fixed inset-0 bg-[#FAF9F6] z-50 overflow-y-auto text-stone-900 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* ─── En-tête de Succès & Félicitations ─── */}
        <div className="text-center space-y-4 mb-12">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm ring-8 ring-emerald-50/50">
            <CheckCircle className="w-10 h-10" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full">
              Paiement Validé avec Succès
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-stone-950 mt-3 tracking-tight">
              Merci pour votre commande
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-light max-w-md mx-auto mt-2 leading-relaxed">
              Nous préparons votre colis avec le plus grand soin dans nos ateliers. Vous recevrez un avis d'expédition par email.
            </p>
          </div>
        </div>

        {/* ─── Cartes Métriques Clés ─── */}
        <div className="bg-white rounded-3xl border border-stone-200/60 p-6 sm:p-8 mb-10 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-stone-100">
            <div className="py-2">
              <span className="text-[10px] uppercase tracking-widest font-semibold text-stone-400">Numéro de Commande</span>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 mt-1">#{order.id}</p>
            </div>
            <div className="py-2">
              <span className="text-[10px] uppercase tracking-widest font-semibold text-stone-400">Date d'Enregistrement</span>
              <p className="text-sm sm:text-base font-semibold text-stone-800 mt-2">
                {order.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                }) : new Date().toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div className="py-2">
              <span className="text-[10px] uppercase tracking-widest font-semibold text-stone-400">Montant Total Réglé</span>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 mt-1">
                {formatPrice(orderTotal)}
              </p>
            </div>
          </div>
        </div>

        {/* ─── Grille Détails Commande & Livraison ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
          {/* Articles de la commande (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-stone-200/60 shadow-sm space-y-5">
            <h2 className="font-serif text-xl font-normal text-stone-950">
              Pièces Commandées ({orderItems.length})
            </h2>

            <div className="space-y-4 divide-y divide-stone-100">
              {orderItems.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-4 pt-4 first:pt-0">
                  <div className="w-16 h-20 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200/60">
                    <img
                      src={getImageUrl(item.product?.images?.[0] || item.image)}
                      alt={item.product?.name || item.name}
                      className="w-full h-full object-cover object-center"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-semibold text-stone-950 truncate">
                      {item.product?.name || item.name}
                    </h3>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      {item.color ? `${item.color} • ` : ''}{item.size || 'Taille unique'}
                    </p>
                    <p className="text-xs text-stone-600 font-medium mt-1">Quantité : {item.quantity}</p>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-stone-950 shrink-0">
                    {formatPrice((item.price || item.product?.price || 0) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span className="font-semibold text-stone-900">{formatPrice(order.subtotal || orderTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span className="text-emerald-700 font-semibold">
                  {order.shipping ? formatPrice(order.shipping) : 'Offerte'}
                </span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-bold text-stone-950 pt-3 border-t border-stone-100">
                <span>Total TTC</span>
                <span>{formatPrice(orderTotal)}</span>
              </div>
            </div>
          </div>

          {/* Étapes & Expédition (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Adresse & Livraison estimée */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200/60 shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-normal text-stone-950 flex items-center gap-2">
                <Truck className="w-4 h-4 text-stone-700" />
                <span>Expédition & Destination</span>
              </h3>

              <div className="text-xs text-stone-600 font-light leading-relaxed pl-3 border-l-2 border-stone-200">
                <p className="font-semibold text-stone-950">
                  {order.shipping_address?.first_name} {order.shipping_address?.last_name}
                </p>
                <p>{order.shipping_address?.street}</p>
                <p>{order.shipping_address?.city} {order.shipping_address?.postal_code}</p>
                <p>{order.shipping_address?.country}</p>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/60 text-xs space-y-1">
                <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  Livraison estimée : {estimatedDelivery.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                </span>
                <p className="text-[11px] text-stone-500 font-light">
                  Numéro de suivi transmis dès prise en charge par le transporteur.
                </p>
              </div>
            </div>

            {/* Suivi des 4 étapes */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200/60 shadow-sm space-y-3">
              <h3 className="font-serif text-lg font-normal text-stone-950">
                Parcours de votre Colis
              </h3>

              <div className="space-y-3 pt-1 text-xs">
                <div className="flex items-center gap-3 p-2.5 bg-emerald-50 rounded-xl text-emerald-800">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                  <div className="flex-1">
                    <p className="font-semibold">Commande Confirmée</p>
                    <p className="text-[10px] text-emerald-600">Enregistrée à l'instant</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 bg-stone-50 rounded-xl text-stone-700">
                  <span className="w-5 h-5 rounded-full bg-stone-300 text-stone-700 flex items-center justify-center text-[10px] font-bold">2</span>
                  <div className="flex-1">
                    <p className="font-semibold">Préparation à l'Atelier</p>
                    <p className="text-[10px] text-stone-400">Sous 24h ouvrées</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 bg-stone-50 rounded-xl text-stone-700">
                  <span className="w-5 h-5 rounded-full bg-stone-300 text-stone-700 flex items-center justify-center text-[10px] font-bold">3</span>
                  <div className="flex-1">
                    <p className="font-semibold">Expédition & Acheminement</p>
                    <p className="text-[10px] text-stone-400">1 à 2 jours ouvrés</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 bg-stone-50 rounded-xl text-stone-700">
                  <span className="w-5 h-5 rounded-full bg-stone-300 text-stone-700 flex items-center justify-center text-[10px] font-bold">4</span>
                  <div className="flex-1">
                    <p className="font-semibold">Remise en main propre</p>
                    <p className="text-[10px] text-stone-400">{estimatedDelivery.toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Actions & Bouton Continuer ─── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200/60">
          <div className="text-xs text-stone-500 font-light">
            Une confirmation a été envoyée à <strong>{user?.email || order.shipping_address?.email || 'votre adresse'}</strong>.
          </div>

          <button
            onClick={onContinueShopping}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-stone-950 hover:bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01]"
          >
            <span>Poursuivre mes achats</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}