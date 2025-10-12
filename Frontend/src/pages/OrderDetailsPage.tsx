import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, MapPin, CreditCard } from 'lucide-react';
import { adminService } from '../services/adminService';

interface OrderDetailsPageProps {
  orderId: string;
  onClose: () => void;
}

export default function OrderDetailsPage({ orderId, onClose }: OrderDetailsPageProps) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await adminService.getOrder(parseInt(orderId));
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
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-6">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-6">
          <button onClick={onClose} className="mb-6 flex items-center text-gray-600 hover:text-black">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </button>
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Commande introuvable</h2>
          </div>
        </div>
      </div>
    );
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return labels[status];
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        <button onClick={onClose} className="mb-6 flex items-center text-gray-600 hover:text-black">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour
        </button>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Commande #{order.order_number || order.id}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
              order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {getStatusLabel(order.status)}
            </span>
          </div>
          <p className="text-gray-600">
            Commandé le {new Date(order.created_at).toLocaleDateString('fr-FR')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Produits */}
          <div className="lg:col-span-2">
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Produits commandés
              </h3>
              <div className="space-y-4">
                {(order.order_items || []).map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 pb-4 border-b last:border-b-0">
                    <img
                      src={item.product?.images?.[0] || '/placeholder.jpg'}
                      alt={item.product?.name || 'Produit'}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product?.name || 'Produit supprimé'}</h4>
                      <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{Number(item.price * item.quantity).toFixed(2)}€</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Informations */}
          <div className="space-y-6">
            {/* Résumé */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Résumé</h3>
              <div className="space-y-2">
                <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{Number(order.total_amount || 0).toFixed(2)}€</span>
                </div>
              </div>
            </div>

            {/* Adresse de livraison */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Livraison
              </h3>
              <div className="text-sm space-y-1">
                <p className="font-medium">{order.user?.first_name} {order.user?.last_name}</p>
                <p>{order.user?.address}</p>
                <p>{order.user?.postal_code} {order.user?.city}</p>
                <p>{order.user?.country}</p>
              </div>
            </div>

            {/* Paiement */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Paiement
              </h3>
              <p className="text-sm">
                {order.payment_method === 'card' ? 'Carte bancaire' : 
                 order.payment_method === 'bank_transfer' ? 'Virement bancaire' : 
                 order.payment_method || 'Non spécifié'}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex space-x-4">
          <button 
            onClick={() => window.location.href = `/order-tracking/${order.id}`}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900"
          >
            Suivre la commande
          </button>
          <button className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-50">
            Télécharger la facture
          </button>
        </div>
      </div>
    </div>
  );
}