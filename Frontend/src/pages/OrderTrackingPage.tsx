import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { adminService } from '../services/adminService';

interface OrderTrackingPageProps {
  orderId: string;
  onClose: () => void;
}

export default function OrderTrackingPage({ orderId, onClose }: OrderTrackingPageProps) {
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
            <p className="text-gray-600">La commande #{orderId} n'existe pas.</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-6 h-6" />;
      case 'confirmed': return <Package className="w-6 h-6" />;
      case 'shipped': return <Truck className="w-6 h-6" />;
      case 'delivered': return <CheckCircle className="w-6 h-6" />;
      default: return <Clock className="w-6 h-6" />;
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
    return labels[status];
  };

  const trackingSteps = [
    { key: 'confirmed', label: 'Commande confirmée', completed: ['confirmed', 'shipped', 'delivered'].includes(order.status) },
    { key: 'shipped', label: 'Expédiée', completed: ['shipped', 'delivered'].includes(order.status) },
    { key: 'delivered', label: 'Livrée', completed: order.status === 'delivered' }
  ];

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6">
        <button onClick={onClose} className="mb-6 flex items-center text-gray-600 hover:text-black">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Suivi de commande</h1>
          <p className="text-gray-600">Commande #{order.order_number || order.id}</p>
        </div>

        {/* Statut actuel */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${
              order.status === 'delivered' ? 'bg-green-100 text-green-600' :
              order.status === 'shipped' ? 'bg-blue-100 text-blue-600' :
              'bg-yellow-100 text-yellow-600'
            }`}>
              {getStatusIcon(order.status)}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{getStatusLabel(order.status)}</h3>
              <p className="text-gray-600">
                Commandé le {new Date(order.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Progression</h3>
          <div className="space-y-4">
            {trackingSteps.map((step, index) => (
              <div key={step.key} className="flex items-center space-x-4">
                <div className={`w-4 h-4 rounded-full ${
                  step.completed ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <div className={`flex-1 ${step.completed ? 'text-black' : 'text-gray-500'}`}>
                  {step.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Détails de la commande */}
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Détails de la commande</h3>
          <div className="space-y-4">
            {(order.order_items || []).map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <img
                  src={item.product?.images?.[0] || '/placeholder.jpg'}
                  alt={item.product?.name || 'Produit'}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.product?.name || 'Produit supprimé'}</h4>
                  <p className="text-sm text-gray-600">
                    Qté: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{Number(item.price * item.quantity).toFixed(2)}€</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{Number(order.total_amount || 0).toFixed(2)}€</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}