import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, XCircle, MapPin, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { orderService } from '../services/orderService';
import { Order } from '../types/order';

export default function PublicOrderTrackingPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ order_number: '', email: '' });
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOrder(null);
    setLoading(true);
    setSearched(true);

    try {
      // On cherche par numéro de commande — le backend filtre aussi par email pour sécurité
      const response = await orderService.trackOrderPublic(form.order_number, form.email);
      setOrder(response);
    } catch {
      setError('Aucune commande trouvée avec ces informations. Vérifiez le numéro et l\'email utilisé lors de la commande.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { key: 'pending',   label: 'Commande reçue',   icon: Clock,        statuses: ['pending', 'confirmed', 'processing', 'shipped', 'delivered'] },
    { key: 'confirmed', label: 'Confirmée',         icon: Package,      statuses: ['confirmed', 'processing', 'shipped', 'delivered'] },
    { key: 'processing',label: 'En préparation',    icon: Package,      statuses: ['processing', 'shipped', 'delivered'] },
    { key: 'shipped',   label: 'Expédiée',          icon: Truck,        statuses: ['shipped', 'delivered'] },
    { key: 'delivered', label: 'Livrée',            icon: CheckCircle,  statuses: ['delivered'] },
  ];

  const getStepState = (step: typeof steps[0]) => {
    if (!order) return 'inactive';
    if (order.status === 'cancelled') return 'cancelled';
    return step.statuses.includes(order.status) ? 'done' : 'inactive';
  };

  const statusColors: Record<string, string> = {
    pending:    'bg-yellow-100 text-yellow-700',
    confirmed:  'bg-blue-100 text-blue-700',
    processing: 'bg-indigo-100 text-indigo-700',
    shipped:    'bg-purple-100 text-purple-700',
    delivered:  'bg-green-100 text-green-700',
    cancelled:  'bg-red-100 text-red-700',
  };

  const statusLabels: Record<string, string> = {
    pending:    'En attente',
    confirmed:  'Confirmée',
    processing: 'En préparation',
    shipped:    'Expédiée',
    delivered:  'Livrée',
    cancelled:  'Annulée',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="inline-block">
            <Logo className="h-7" />
          </button>
          <button
            onClick={() => navigate('/boutique')}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Retour à la boutique
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Titre */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="w-8 h-8 text-rose-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Suivre ma commande</h1>
          <p className="text-gray-500">Entrez votre numéro de commande et l'email utilisé lors de l'achat.</p>
        </div>

        {/* Formulaire de recherche */}
        <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de commande
              </label>
              <input
                type="text"
                required
                value={form.order_number}
                onChange={(e) => setForm(prev => ({ ...prev, order_number: e.target.value.toUpperCase() }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-transparent outline-none transition-all"
                placeholder="CMD-20250415-XXXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email de commande
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-transparent outline-none transition-all"
                placeholder="votre@email.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-black text-white py-3.5 rounded-xl font-semibold hover:bg-gray-900 disabled:opacity-50 transition-all"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              {loading ? 'Recherche...' : 'Suivre ma commande'}
            </button>
          </div>
        </form>

        {/* Erreur */}
        {searched && error && !loading && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3 mb-6">
            <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Résultat */}
        {order && (
          <div className="space-y-6">
            {/* Statut principal */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Commande</p>
                  <h2 className="text-xl font-bold text-gray-900">#{order.order_number || order.id}</h2>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                  {statusLabels[order.status] || order.status}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Commandé le {new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>

            {/* Timeline */}
            {order.status !== 'cancelled' ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-6">Progression de la livraison</h3>
                <div className="space-y-0">
                  {steps.map((step, idx) => {
                    const state = getStepState(step);
                    const isDone = state === 'done';
                    const isActive = order.status === step.key;
                    const Icon = step.icon;
                    return (
                      <div key={step.key} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                            isDone
                              ? isActive
                                ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-200'
                                : 'bg-green-500 border-green-500 text-white'
                              : 'bg-white border-gray-200 text-gray-300'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          {idx < steps.length - 1 && (
                            <div className={`w-0.5 h-8 mt-1 ${isDone && !isActive ? 'bg-green-400' : 'bg-gray-100'}`} />
                          )}
                        </div>
                        <div className="pt-2 pb-6">
                          <p className={`font-semibold text-sm ${isDone ? 'text-gray-900' : 'text-gray-400'}`}>
                            {step.label}
                          </p>
                          {isActive && (
                            <p className="text-xs text-rose-500 font-medium mt-0.5">Statut actuel</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-500" />
                <p className="text-sm text-red-700 font-medium">Cette commande a été annulée.</p>
              </div>
            )}

            {/* Adresse de livraison */}
            {order.shipping_address && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <h3 className="font-semibold text-gray-900">Adresse de livraison</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {order.shipping_address.first_name} {order.shipping_address.last_name}<br />
                  {order.shipping_address.street}<br />
                  {order.shipping_address.postal_code} {order.shipping_address.city}<br />
                  {order.shipping_address.country}
                </p>
              </div>
            )}

            {/* Lien vers détails si connecté */}
            <button
              onClick={() => navigate('/login', { state: { from: `/order-details/${order.id}` } })}
              className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-4 text-sm font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all group"
            >
              <span>Voir tous les détails de la commande</span>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* Aide */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Vous ne trouvez pas votre commande ?{' '}
          <button onClick={() => navigate('/contact')} className="text-rose-500 hover:underline font-medium">
            Contactez-nous
          </button>
        </div>
      </div>
    </div>
  );
}
