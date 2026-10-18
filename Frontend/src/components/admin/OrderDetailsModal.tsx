import { useState, useEffect } from 'react';
import { X, Package, MapPin, CreditCard, Sparkles, Printer } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatPrice } from '../../utils';

interface OrderDetailsModalProps {
  isOpen: boolean;
  orderId: number | null;
  onClose: () => void;
}

export default function OrderDetailsModal({ isOpen, orderId, onClose }: OrderDetailsModalProps) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrder();
    }
  }, [isOpen, orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await adminService.getOrder(orderId!);
      setOrder(data);
    } catch (error) {
      console.error('Erreur commande:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending': return { label: 'En attente', color: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'confirmed': return { label: 'Confirmée', color: 'bg-stone-100 text-stone-800 border-stone-300' };
      case 'shipped': return { label: 'Expédiée', color: 'bg-sky-50 text-sky-800 border-sky-200' };
      case 'delivered': return { label: 'Livrée', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'cancelled': return { label: 'Annulée', color: 'bg-rose-50 text-rose-800 border-rose-200' };
      default: return { label: status, color: 'bg-stone-50 text-stone-700 border-stone-200' };
    }
  };

  if (!isOpen) return null;

  const items = order?.order_items || order?.items || [];
  const statusCfg = order ? getStatusConfig(order.status) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-stone-200/80">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 bg-stone-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-stone-950 text-white flex items-center justify-center font-serif text-sm">
              <Sparkles className="w-4 h-4 text-terracotta-400" />
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">Dossier Commande</span>
              <h3 className="font-serif text-lg font-normal text-stone-950">
                #{order?.order_number || orderId}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
              title="Imprimer le bon de commande"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Corps du modal */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 border-2 border-stone-300 border-t-stone-950 rounded-full animate-spin mx-auto"></div>
              <p className="text-xs uppercase tracking-widest text-stone-400 font-medium">Chargement des détails...</p>
            </div>
          ) : order ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Colonne gauche (2 tiers) : Liste des pièces commandées */}
              <div className="lg:col-span-2 space-y-4">
                <div className="border border-stone-200/80 rounded-3xl p-5 bg-white space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <h4 className="font-serif text-base font-normal text-stone-950 flex items-center gap-2">
                      <Package className="w-4 h-4 text-stone-700" />
                      <span>Pièces confectionnées & Articles ({items.length})</span>
                    </h4>
                  </div>

                  <div className="divide-y divide-stone-100">
                    {items.map((item: any, index: number) => {
                      const image = item.product?.images?.[0] || '/placeholder.jpg';
                      return (
                        <div key={index} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                          <img
                            src={image}
                            alt={item.product?.name || 'Produit'}
                            className="w-14 h-16 object-cover rounded-xl border border-stone-200/60 bg-stone-50 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-xs text-stone-900 truncate">
                              {item.product?.name || 'Article haute couture'}
                            </h5>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500 font-light">
                              <span>Qté : {item.quantity}</span>
                              {item.size && <span>• Taille : {item.size}</span>}
                              {item.color && <span>• Coloris : {item.color}</span>}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-serif text-xs font-semibold text-stone-950">
                              {formatPrice((item.price || item.product?.price || 0) * item.quantity)}
                            </p>
                            <p className="text-[10px] text-stone-400">
                              {formatPrice(item.price || item.product?.price || 0)} / u.
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Colonne droite (1 tiers) : Facturation & Destinataire */}
              <div className="space-y-4">
                {/* Statut & Total Card */}
                <div className="border border-stone-200/80 rounded-3xl p-5 bg-stone-50/60 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-500 uppercase tracking-wider text-[10px] font-medium">Statut</span>
                    {statusCfg && (
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${statusCfg.color}`}>
                        {statusCfg.label}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-xs text-stone-600">
                    <span className="font-light">Date</span>
                    <span className="font-medium text-stone-900">
                      {new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="border-t border-stone-200/60 pt-3 flex justify-between items-baseline">
                    <span className="text-xs uppercase tracking-wider font-semibold text-stone-900">Montant Total</span>
                    <span className="font-serif text-lg font-medium text-stone-950">
                      {formatPrice(order.total || 0)}
                    </span>
                  </div>
                </div>

                {/* Client & Adresse */}
                <div className="border border-stone-200/80 rounded-3xl p-5 bg-white space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-medium text-stone-950 pb-2 border-b border-stone-100">
                    <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
                    <span>Adresse de Livraison</span>
                  </div>
                  <p className="font-serif text-sm font-medium text-stone-900 pt-1">
                    {order.shipping_address?.first_name || order.user?.first_name || ''} {order.shipping_address?.last_name || order.user?.last_name || ''}
                  </p>
                  <p className="text-stone-600 font-light leading-relaxed">
                    {order.shipping_address?.street || order.user?.address || 'Adresse saisie à la commande'}
                  </p>
                  <p className="text-stone-600 font-light">
                    {order.shipping_address?.postal_code || order.user?.postal_code || ''} {order.shipping_address?.city || order.user?.city || ''}
                  </p>
                  <p className="text-stone-600 font-light">
                    {order.shipping_address?.country || order.user?.country || 'Côte d\'Ivoire'}
                  </p>
                  {(order.shipping_address?.phone || order.user?.phone) && (
                    <p className="text-stone-500 text-[11px] pt-1 border-t border-stone-100 mt-2">
                      Tél : {order.shipping_address?.phone || order.user?.phone}
                    </p>
                  )}
                </div>

                {/* Règlement */}
                <div className="border border-stone-200/80 rounded-3xl p-5 bg-white space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-medium text-stone-950 pb-2 border-b border-stone-100">
                    <CreditCard className="w-3.5 h-3.5 text-stone-700" />
                    <span>Mode de Règlement</span>
                  </div>
                  <p className="font-medium text-stone-800 capitalize">
                    {order.payment_method?.replace('_', ' ') || 'Moneroo (Mobile Money / Carte)'}
                  </p>
                  <p className="text-[11px] text-stone-400 font-light">
                    Statut du versement : <span className="font-medium text-stone-700">{order.payment_status || 'Confirmé'}</span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-stone-400 italic">
              Cette commande est introuvable.
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-stone-100 bg-stone-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-stone-950 hover:bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-full shadow-sm transition-all"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
