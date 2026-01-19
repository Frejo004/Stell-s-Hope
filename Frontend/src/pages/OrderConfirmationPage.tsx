import { CheckCircle, Package, Truck, Mail, Phone, Download, ArrowRight } from 'lucide-react';
import { Order } from '../types/order';
import { getImageUrl } from '../utils/imageUtils';

interface OrderConfirmationPageProps {
  order: Order;
  onContinueShopping: () => void;
}

export default function OrderConfirmationPage({ order, onContinueShopping }: OrderConfirmationPageProps) {
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        {/* Success Header */}
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Commande confirmée !</h1>
          <p className="text-gray-600 text-lg">
            Merci pour votre achat. Votre commande a été reçue et est en cours de traitement.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Numéro de commande</h3>
              <p className="text-2xl font-bold text-rose-300">#{order.id}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Date de commande</h3>
              <p className="text-lg">{new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Total payé</h3>
              <p className="text-2xl font-bold text-gray-900">{(order.total || order.total_amount || 0).toFixed(2)} €</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <h2 className="text-xl font-bold mb-4">Récapitulatif de la commande</h2>
            <div className="border rounded-lg p-4 space-y-4">
              {(order.order_items || []).map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <img
                    src={getImageUrl(item.product.images?.[0])}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">{item.color} • {item.size}</p>
                    <p className="text-sm">Qté: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">{((item.product.price || 0) * item.quantity).toFixed(2)} €</p>
                </div>
              ))}

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sous-total</span>
                  <span>{(order.subtotal || 0).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Livraison</span>
                  <span>{(order.shipping || 0).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>TVA</span>
                  <span>{(order.tax || 0).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>{(order.total || order.total_amount || 0).toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery & Next Steps */}
          <div className="space-y-6">
            {/* Delivery Info */}
            <div>
              <h2 className="text-xl font-bold mb-4">Informations de livraison</h2>
              <div className="border rounded-lg p-4">
                <div className="flex items-start space-x-3 mb-4">
                  <Truck className="w-5 h-5 text-rose-300 mt-1" />
                  <div>
                    <h3 className="font-semibold">Adresse de livraison</h3>
                    <p className="text-sm text-gray-600">
                      {(order.shipping_address?.first_name || '')} {(order.shipping_address?.last_name || '')}<br />
                      {(order.shipping_address?.street || '')}<br />
                      {(order.shipping_address?.postal_code || '')} {(order.shipping_address?.city || '')}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm font-medium text-blue-800">
                    📦 Livraison estimée : {estimatedDelivery.toLocaleDateString('fr-FR')}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Vous recevrez un email de suivi dès l'expédition
                  </p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div>
              <h2 className="text-xl font-bold mb-4">Prochaines étapes</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-green-800">Commande confirmée</p>
                    <p className="text-xs text-green-600">Maintenant</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                  <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Préparation</p>
                    <p className="text-xs text-gray-600">Sous 24h</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                  <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Expédition</p>
                    <p className="text-xs text-gray-600">1-2 jours ouvrés</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                  <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                    <Package className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Livraison</p>
                    <p className="text-xs text-gray-600">{estimatedDelivery.toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Info */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-4">Besoin d'aide ?</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-600" />
                <span>contact@stellshope.fr</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-600" />
                <span>+33 1 23 45 67 89</span>
              </div>
              <p className="text-gray-600">
                Notre équipe est disponible du lundi au vendredi de 9h à 19h
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 rounded hover:bg-gray-200">
              <Download className="w-4 h-4" />
              <span>Télécharger la facture</span>
            </button>

            <button
              onClick={onContinueShopping}
              className="w-full flex items-center justify-center space-x-2 bg-black text-white py-3 rounded hover:bg-gray-900"
            >
              <span>Continuer mes achats</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Email Confirmation Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">Confirmation par email</h4>
              <p className="text-sm text-blue-700 mt-1">
                Un email de confirmation a été envoyé à <strong>{(order.shipping_address?.first_name || 'utilisateur').toLowerCase()}@example.com</strong>.
                Vérifiez également vos spams si vous ne le recevez pas dans les prochaines minutes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}