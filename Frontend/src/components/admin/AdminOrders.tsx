import { useState, useEffect } from 'react';
import { Search, Eye, Truck, Package, CheckCircle, Clock, AlertCircle, Calendar, ChevronRight } from 'lucide-react';
import { useAdminOrders } from '../../hooks/useAdminData';
import { adminService } from '../../services/adminService';
import Toast from '../ui/Toast';
import OrderDetailsModal from './OrderDetailsModal';

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
      setToast({ type: 'success', message: 'Statut mis à jour avec succès' });
      refetch(pagination?.current_page || 1, searchTerm, statusFilter, false);
      fetchStats();
    } catch (error) {
      setToast({ type: 'error', message: 'Erreur lors de la mise à jour' });
    }
  };

  const handleViewOrder = (orderId: number) => {
    setOrderDetailsModal({ isOpen: true, orderId });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending': return { icon: Clock, color: 'bg-amber-50 text-amber-600 border-amber-100', label: 'En attente' };
      case 'confirmed': return { icon: Package, color: 'bg-indigo-50 text-indigo-600 border-indigo-100', label: 'Confirmée' };
      case 'shipped': return { icon: Truck, color: 'bg-blue-50 text-blue-600 border-blue-100', label: 'Expédiée' };
      case 'delivered': return { icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600 border-emerald-100', label: 'Livrée' };
      case 'cancelled': return { icon: AlertCircle, color: 'bg-rose-50 text-rose-600 border-rose-100', label: 'Annulée' };
      default: return { icon: Package, color: 'bg-slate-50 text-slate-600 border-slate-100', label: status };
    }
  };

  if (loading && !orders.length) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Gestion des Commandes</h1>
          <p className="text-slate-500 mt-1 font-medium">Suivez et gérez les commandes clients en temps réel.</p>
        </div>
        <div className="px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-2">
          <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">{pagination?.total || 0} Commandes au total</span>
        </div>
      </div>

      {/* Stats Grid Premium */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'En attente', value: stats.pending, color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
          { label: 'Confirmées', value: stats.confirmed, color: 'text-indigo-600', bg: 'bg-indigo-50', icon: Package },
          { label: 'Expédiées', value: stats.shipped, color: 'text-blue-600', bg: 'bg-blue-50', icon: Truck },
          { label: 'Livrées', value: stats.delivered, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle },
          { label: 'Annulées', value: stats.cancelled, color: 'text-rose-600', bg: 'bg-rose-50', icon: AlertCircle }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-[1.5rem] p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-black text-slate-900 leading-none">{stat.value}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
              <input
                type="text"
                placeholder="Rechercher par n° de commande, client..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500/20 focus:bg-white transition-all font-medium text-slate-700"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-slate-50 rounded-2xl p-1 border border-slate-100">
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="bg-transparent border-none text-sm font-bold text-slate-600 focus:ring-0 px-4 py-2 cursor-pointer"
              >
                <option value="all">Tous les Statuts</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmées</option>
                <option value="shipped">Expédiées</option>
                <option value="delivered">Livrées</option>
                <option value="cancelled">Annulées</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table Premium */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Commande</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Client</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Date & Méthode</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Total</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Statut</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => {
                const config = getStatusConfig(order.status);
                return (
                  <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-rose-500 border border-slate-200">
                          {order.id.toString().slice(-2)}
                        </div>
                        <div>
                          <div className="text-sm font-black text-slate-900 tracking-tight">#{order.order_number || order.id}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                            {order.order_items?.length || 0} article{((order.order_items?.length || 0) > 1) ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div>
                        <div className="text-sm font-bold text-slate-900 leading-tight">
                          {order.user ? `${order.user.first_name} ${order.user.last_name}` : 'Client supprimé'}
                        </div>
                        <div className="text-[11px] font-medium text-slate-500 mt-0.5">{order.user?.email || 'No email'}</div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <div className="flex items-center text-sm font-bold text-slate-700">
                          <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                          {new Date(order.created_at).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-1">
                          {order.payment_method?.replace('_', ' ') || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-black text-slate-900 border-l-2 border-rose-500 pl-3">
                        {Number(order.total_amount || 0).toFixed(2)}€
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${config.color}`}>
                        <config.icon className="w-3 h-3 mr-1.5" />
                        {config.label}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleViewOrder(order.id)}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                          title="Détails"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-[10px] font-bold uppercase tracking-wider rounded-xl px-3 py-1.5 focus:ring-rose-500/20 focus:border-rose-500 transition-all cursor-pointer appearance-none pr-8"
                          >
                            <option value="pending">Attente</option>
                            <option value="confirmed">Confirmée</option>
                            <option value="shipped">Expédiée</option>
                            <option value="delivered">Livrée</option>
                            <option value="cancelled">Annulée</option>
                          </select>
                          <ChevronRight className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Premium */}
        <div className="bg-slate-50/50 px-8 py-5 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Affichage de <span className="text-slate-900">{((pagination?.current_page || 1) - 1) * (pagination?.per_page || 10) + 1}</span> à{' '}
              <span className="text-slate-900">{Math.min((pagination?.current_page || 1) * (pagination?.per_page || 10), pagination?.total || 0)}</span> sur{' '}
              <span className="text-slate-900">{pagination?.total || 0}</span> commandes
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => refetch((pagination?.current_page || 1) - 1, searchTerm, statusFilter, false)}
                disabled={pagination?.current_page === 1}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                Précédent
              </button>
              <div className="flex space-x-1">
                {[...Array(Math.min(5, pagination?.last_page || 1))].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => refetch(i + 1, searchTerm, statusFilter, false)}
                    className={`w-9 h-9 flex items-center justify-center text-xs font-bold rounded-xl transition-all ${pagination?.current_page === i + 1
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => refetch((pagination?.current_page || 1) + 1, searchTerm, statusFilter, false)}
                disabled={pagination?.current_page === pagination?.last_page}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors"
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
