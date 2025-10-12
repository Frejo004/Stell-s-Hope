import React, { useState, useEffect } from 'react';
import { X, Package, MapPin, CreditCard } from 'lucide-react';
import { adminService } from '../../services/adminService';

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

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return labels[status as keyof typeof labels] || status;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Détails de la commande #{order?.order_number || orderId}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4">Chargement...</p>
          </div>
        ) : order ? (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Produits */}
              <div className="lg:col-span-2">
                <div className="border rounded-lg p-4">
                  <h4 className="text-md font-semibold mb-4 flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    Produits commandés
                  </h4>
                  <div className="space-y-3">
                    {(order.order_items || []).map((item: any, index: number) => (
                      <div key={index} className="flex items-center space-x-3 pb-3 border-b last:border-b-0">
                        <img
                          src={item.product?.images?.[0] || '/placeholder.jpg'}
                          alt={item.product?.name || 'Produit'}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{item.product?.name || 'Produit supprimé'}</h5>
                          <p className="text-xs text-gray-600">Quantité: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{Number(item.price * item.quantity).toFixed(2)}€</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Informations */}
              <div className="space-y-4">
                {/* Statut et Total */}
                <div className="border rounded-lg p-4">
                  <h4 className="text-md font-semibold mb-3">Résumé</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Statut</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Date</span>
                      <span className="text-sm">{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{Number(order.total_amount || 0).toFixed(2)}€</span>
                    </div>
                  </div>
                </div>

                {/* Client */}
                <div className="border rounded-lg p-4">
                  <h4 className="text-md font-semibold mb-3 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Client
                  </h4>
                  <div className="text-sm space-y-1">
                    <p className="font-medium">{order.user?.first_name} {order.user?.last_name}</p>
                    <p className="text-gray-600">{order.user?.email}</p>
                    <p className="text-gray-600">{order.user?.phone}</p>
                    <div className="mt-2 pt-2 border-t">
                      <p>{order.user?.address}</p>
                      <p>{order.user?.postal_code} {order.user?.city}</p>
                      <p>{order.user?.country}</p>
                    </div>
                  </div>
                </div>

                {/* Paiement */}
                <div className="border rounded-lg p-4">
                  <h4 className="text-md font-semibold mb-3 flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Paiement
                  </h4>
                  <p className="text-sm">
                    {order.payment_method === 'card' ? 'Carte bancaire' : 
                     order.payment_method === 'bank_transfer' ? 'Virement bancaire' : 
                     order.payment_method || 'Non spécifié'}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Statut: {order.payment_status || 'En attente'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p>Commande introuvable</p>
          </div>
        )}
      </div>
    </div>
  );
}