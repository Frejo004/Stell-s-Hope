import { useState, useEffect } from 'react';
import { Search, Eye, Truck, Package, CheckCircle, Clock, AlertCircle, Calendar, ChevronRight } from 'lucide-react';
import { useAdminOrders } from '../../hooks/useAdminData';
import { adminService } from '../../services/adminService';
import Toast from '../ui/Toast';
import OrderDetailsModal from './OrderDetailsModal';
import { formatPrice } from '../../utils';

interface AdminOrdersProps {
  onNavigate: (page: string) => void;
}

export default function AdminOrders({ onNavigate: _onNavigate }: AdminOrdersProps) {
  const { orders = [], loading, pagination, refetch } = useAdminOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning', message: string } | null>(null);
  const [orderDetailsModal, setOrderDetailsModal] = useState<{ isOpen: boolean, orderId: number | null }>({ isOpen: false, orderId: null });
  const [stats, setStats] = useState({ pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 });

  const fetchStats = async () => {
    try {
      const data = await adminService.getOrderStats();
      setStats(data);
    } catch (error) {
      console.error('Erreur stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    const timeoutId = setTimeout(() => {
      refetch(1, value, statusFilter, false);
    }, 300);
    return () => clearTimeout(timeoutId);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    refetch(1, searchTerm, status, false);
  };

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      setToast({ type: 'success', message: 'Statut de commande actualisé' });
      refetch(pagination?.current_page || 1, searchTerm, statusFilter, false);
      fetchStats();
    } catch {
      setToast({ type: 'error', message: 'Impossible d\'actualiser le statut' });
    }
  };

  const handleViewOrder = (orderId: number) => {
    setOrderDetailsModal({ isOpen: true, orderId });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending': return { icon: Clock, color: 'bg-amber-50 text-amber-800 border-amber-200', label: 'En attente' };
      case 'confirmed': return { icon: Package, color: 'bg-stone-100 text-stone-800 border-stone-300', label: 'Confirmée' };
      case 'shipped': return { icon: Truck, color: 'bg-sky-50 text-sky-800 border-sky-200', label: 'Expédiée' };
      case 'delivered': return { icon: CheckCircle, color: 'bg-emerald-50 text-emerald-800 border-emerald-200', label: 'Livrée' };
      case 'cancelled': return { icon: AlertCircle, color: 'bg-rose-50 text-rose-800 border-rose-200', label: 'Annulée' };
      default: return { icon: Package, color: 'bg-stone-50 text-stone-700 border-stone-200', label: status };
    }
  };

  if (loading && !orders.length) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-stone-300 border-t-stone-950 rounded-full animate-spin"></div>
          <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">Chargement des commandes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/60">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-terracotta-600">Registre Atelier</span>
          <h1 className="font-serif text-3xl font-normal text-stone-950 mt-1">
            Gestion des Commandes
          </h1>
          <p className="text-xs text-stone-500 font-light mt-1">
            Suivi des flux d'expéditions, historique des factures et gestion des statuts.
          </p>
        </div>
        <div className="px-4 py-2 bg-white rounded-2xl border border-stone-200/80 shadow-sm flex items-center gap-2 self-start sm:self-auto">
          <span className="w-2 h-2 bg-terracotta-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-semibold text-stone-700 uppercase tracking-widest">
            {pagination?.total || 0} commandes enregistrées
          </span>
        </div>
      </div>

      {/* ─── Cartes de Synthèse par Statut ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { key: 'all', label: 'Toutes', value: pagination?.total || 0, icon: Package, color: 'text-stone-900', bg: 'bg-stone-100' },
          { key: 'pending', label: 'En attente', value: stats.pending, icon: Clock, color: 'text-amber-700', bg: 'bg-amber-50' },
          { key: 'confirmed', label: 'Confirmées', value: stats.confirmed, icon: Package, color: 'text-stone-800', bg: 'bg-stone-100' },
          { key: 'shipped', label: 'Expédiées', value: stats.shipped, icon: Truck, color: 'text-sky-700', bg: 'bg-sky-50' },
          { key: 'delivered', label: 'Livrées', value: stats.delivered, icon: CheckCircle, color: 'text-emerald-700', bg: 'bg-emerald-50' }
        ].map((stat) => (
          <button
            key={stat.key}
            onClick={() => handleStatusFilter(stat.key)}
            className={`text-left rounded-3xl p-5 border transition-all duration-200 ${
              statusFilter === stat.key
                ? 'bg-white border-stone-950 ring-2 ring-stone-950/10 shadow-sm'
                : 'bg-white border-stone-200/70 hover:border-stone-300 shadow-sm'
            }`}
          >
            <div className={`w-9 h-9 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-3`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <div className="font-serif text-2xl font-normal text-stone-950">{stat.value}</div>
            <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mt-1.5">{stat.label}</div>
          </button>
        ))}
      </div>

      {/* ─── Barre de Recherche et Filtres ─── */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200/80 p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Rechercher par référence, nom client, e-mail..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200/80 rounded-2xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-950/10 focus:bg-white focus:border-stone-400 transition-all font-light"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="bg-stone-50 border border-stone-200/80 text-xs font-medium text-stone-700 rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-stone-950/10 cursor-pointer"
            >
              <option value="all">Tous les Statuts</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmée</option>
              <option value="shipped">Expédiée</option>
              <option value="delivered">Livrée</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── Table des Commandes ─── */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-100">
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-stone-400 text-[10px]">Réf. Commande</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-stone-400 text-[10px]">Client</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-stone-400 text-[10px]">Date & Paiement</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-stone-400 text-[10px]">Montant</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-stone-400 text-[10px]">Statut</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-stone-400 text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.length > 0 ? (
                orders.map((order) => {
                  const config = getStatusConfig(order.status);
                  const itemsCount = order.order_items?.length || order.items?.length || 0;
                  return (
                    <tr key={order.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-2xl bg-stone-100 border border-stone-200 text-stone-800 flex items-center justify-center font-serif text-xs font-semibold">
                            {order.id.toString().slice(-2)}
                          </div>
                          <div>
                            <p className="font-semibold text-stone-900 tracking-tight">#{order.order_number || order.id}</p>
                            <p className="text-[10px] text-stone-400">
                              {itemsCount} article{itemsCount > 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-stone-900">
                            {order.user ? `${order.user.first_name} ${order.user.last_name}` : 'Client invité'}
                          </p>
                          <p className="text-[11px] text-stone-400 font-light">{order.user?.email || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1.5 text-stone-600">
                            <Calendar className="w-3.5 h-3.5 text-stone-400" />
                            {new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="text-[10px] font-medium uppercase tracking-wider text-terracotta-600 mt-0.5">
                            {order.payment_method?.replace('_', ' ') || 'Moneroo'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-serif font-medium text-sm text-stone-950">
                        {formatPrice(order.total || 0)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${config.color}`}>
                          <config.icon className="w-3 h-3" />
                          <span>{config.label}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleViewOrder(order.id)}
                            className="p-2 text-stone-500 hover:text-stone-950 hover:bg-stone-100 rounded-xl transition-colors"
                            title="Voir les détails"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <div className="relative">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                              className="bg-stone-50 border border-stone-200/80 text-[10px] font-semibold uppercase tracking-wider rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-stone-950 text-stone-700 cursor-pointer appearance-none pr-6"
                            >
                              <option value="pending">Attente</option>
                              <option value="confirmed">Confirmée</option>
                              <option value="shipped">Expédiée</option>
                              <option value="delivered">Livrée</option>
                              <option value="cancelled">Annulée</option>
                            </select>
                            <ChevronRight className="w-3 h-3 text-stone-400 absolute right-1.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-stone-400 italic">
                    Aucune commande trouvée selon ces critères.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ─── Pagination Élégante ─── */}
        <div className="bg-stone-50/60 px-6 py-4 border-t border-stone-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <p className="text-stone-400 font-light">
              Affichage de <span className="font-medium text-stone-800">{((pagination?.current_page || 1) - 1) * (pagination?.per_page || 10) + 1}</span> à{' '}
              <span className="font-medium text-stone-800">{Math.min((pagination?.current_page || 1) * (pagination?.per_page || 10), pagination?.total || 0)}</span> sur{' '}
              <span className="font-medium text-stone-800">{pagination?.total || 0}</span> commandes
            </p>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => refetch((pagination?.current_page || 1) - 1, searchTerm, statusFilter, false)}
                disabled={pagination?.current_page === 1}
                className="px-3.5 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 disabled:opacity-40 transition-colors shadow-2xs"
              >
                Précédent
              </button>

              <div className="flex gap-1">
                {[...Array(Math.min(5, pagination?.last_page || 1))].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => refetch(i + 1, searchTerm, statusFilter, false)}
                    className={`w-8 h-8 flex items-center justify-center text-xs rounded-xl font-medium transition-all ${
                      pagination?.current_page === i + 1
                        ? 'bg-stone-950 text-white shadow-sm'
                        : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => refetch((pagination?.current_page || 1) + 1, searchTerm, statusFilter, false)}
                disabled={pagination?.current_page === pagination?.last_page}
                className="px-3.5 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 disabled:opacity-40 transition-colors shadow-2xs"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <OrderDetailsModal
        isOpen={orderDetailsModal.isOpen}
        orderId={orderDetailsModal.orderId}
        onClose={() => setOrderDetailsModal({ isOpen: false, orderId: null })}
      />
    </div>
  );
}
