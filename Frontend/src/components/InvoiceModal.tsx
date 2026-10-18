import { useRef } from 'react';
import { X, Printer, Download, Sparkles } from 'lucide-react';
import { formatPrice } from '../utils';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export default function InvoiceModal({ isOpen, onClose, order }: InvoiceModalProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !order) return null;

  const items = order.order_items || order.items || [];
  const shipping = typeof order.shipping_address === 'string'
    ? (() => { try { return JSON.parse(order.shipping_address); } catch { return { address: order.shipping_address }; } })()
    : (order.shipping_address || {});
  
  const clientName = `${shipping.first_name || ''} ${shipping.last_name || ''}`.trim() || order.user?.first_name || 'Client';
  const orderRef = order.order_number || `ORD-${order.id}`;
  const invoiceNumber = `FAC-${new Date(order.created_at || Date.now()).getFullYear()}-${String(order.id).padStart(5, '0')}`;
  const orderDate = new Date(order.created_at || Date.now()).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20mm;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-stone-200">
        {/* Barre d'action supérieure */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/60 no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-semibold text-stone-500">Facture & Reçu</span>
            <span className="text-xs font-mono text-stone-900 bg-stone-200 px-2 py-0.5 rounded">{invoiceNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-950 hover:bg-stone-800 text-white rounded-xl text-xs font-medium transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Corps de la Facture Imprimable */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-white" id="printable-invoice" ref={invoiceRef}>
          {/* En-tête Facture */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-stone-200 pb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-serif text-2xl font-bold tracking-widest text-stone-950">STELL'S HOPE</span>
                <Sparkles className="w-4 h-4 text-amber-600 no-print" />
              </div>
              <p className="text-[11px] uppercase tracking-widest text-stone-500">Maison de Haute Couture & Maroquinerie</p>
              <div className="mt-3 text-xs text-stone-500 space-y-0.5 leading-relaxed">
                <p>Siège : Boulevard de la République, Abidjan</p>
                <p>RCCM : CI-ABJ-2024-B-12849 &bull; N° CC : 2419204 M</p>
                <p>Email : contact@stellshope.com</p>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="inline-block px-3 py-1 bg-stone-100 text-stone-800 text-[10px] uppercase font-bold tracking-wider rounded-md mb-2">
                Facture Acquittée
              </span>
              <p className="font-mono text-base font-bold text-stone-900">{invoiceNumber}</p>
              <p className="text-xs text-stone-500 mt-1">Date d'émission : {orderDate}</p>
              <p className="text-xs text-stone-500">Réf. commande : #{orderRef}</p>
            </div>
          </div>

          {/* Adresses Facturation & Livraison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8 p-4 bg-stone-50/70 rounded-2xl border border-stone-100 text-xs text-stone-700">
            <div>
              <h4 className="font-semibold text-stone-950 uppercase tracking-wider text-[10px] mb-2">Facturé à</h4>
              <p className="font-medium text-stone-900 text-sm">{clientName}</p>
              <p>{shipping.street || shipping.address || 'Adresse fournie à la livraison'}</p>
              <p>{shipping.postal_code || ''} {shipping.city || ''}</p>
              <p>{shipping.country || 'Côte d\'Ivoire'}</p>
              {shipping.phone && <p className="text-stone-500 mt-1">Tél : {shipping.phone}</p>}
            </div>

            <div>
              <h4 className="font-semibold text-stone-950 uppercase tracking-wider text-[10px] mb-2">Détails de règlement</h4>
              <p><span className="text-stone-500">Mode de paiement :</span> <strong className="capitalize">{order.payment_method || 'Moneroo / Carte'}</strong></p>
              <p><span className="text-stone-500">Statut de transaction :</span> <strong className="text-emerald-700">{order.payment_status === 'paid' ? 'Payé' : 'Validé'}</strong></p>
              {order.payment_id && <p className="font-mono text-[10px] text-stone-400 mt-1">ID Trans. : {order.payment_id}</p>}
            </div>
          </div>

          {/* Tableau des pièces */}
          <div className="border border-stone-200 rounded-xl overflow-hidden mb-8">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100/70 text-stone-700 uppercase font-semibold text-[10px] tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Description de la création</th>
                  <th className="py-3 px-4 text-center">Quantité</th>
                  <th className="py-3 px-4 text-right">Prix Unitaire</th>
                  <th className="py-3 px-4 text-right">Montant Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {items.map((item: any, idx: number) => {
                  const name = item.product?.name || item.name || 'Pièce Haute Couture';
                  const qty = item.quantity || 1;
                  const price = Number(item.price || item.product?.price || 0);
                  return (
                    <tr key={idx} className="hover:bg-stone-50/50">
                      <td className="py-3 px-4">
                        <p className="font-semibold text-stone-950">{name}</p>
                        {(item.size || item.color) && (
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            {item.size ? `Taille : ${item.size}` : ''} {item.color ? `• Coloris : ${item.color}` : ''}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-medium">{qty}</td>
                      <td className="py-3 px-4 text-right font-mono">{formatPrice(price)}</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold">{formatPrice(price * qty)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totaux & Rapprochement */}
          <div className="flex justify-end mb-10">
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Sous-total HT</span>
                <span className="font-mono">{formatPrice(order.subtotal || order.total)}</span>
              </div>

              {Number(order.discount_amount) > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Remise {order.promotion_code ? `(${order.promotion_code})` : ''}</span>
                  <span className="font-mono">-{formatPrice(order.discount_amount)}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-600">
                <span>Frais de livraison</span>
                <span className="font-mono">
                  {Number(order.shipping_amount) > 0 ? formatPrice(order.shipping_amount) : 'Offerte'}
                </span>
              </div>

              <div className="border-t border-stone-200 pt-2 flex justify-between text-sm font-bold text-stone-950">
                <span>Total Net Payé (TTC)</span>
                <span className="font-mono text-base">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Mentions légales & Signature */}
          <div className="border-t border-stone-200 pt-6 text-[10px] text-stone-400 text-center leading-relaxed">
            <p className="font-medium text-stone-600">Merci de votre confiance en la Maison Stell's Hope.</p>
            <p className="mt-1">
              Cette facture électronique tient lieu de certificat d'authenticité et de justificatif de garantie pour nos créations.
            </p>
            <p className="mt-0.5">
              Service Clientèle & Conciergerie : contact@stellshope.com &bull; www.stellshope.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
