import React, { useState } from 'react';
import { Search, Filter, Eye, Truck, Package, CheckCircle } from 'lucide-react';
import { useAdminOrders } from '../../hooks/useAdminData';
import { adminService } from '../../services/adminService';
import Toast from '../ui/Toast';

interface AdminOrdersProps {
  onNavigate: (page: string) => void;
}

export default function AdminOrders({ onNavigate }: AdminOrdersProps) {
  const { orders, loading, pagination, refetch } = useAdminOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState<{type: 'success' | 'error' | 'warning', message: string} | null>(null);
  const [stats, setStats] = useState({ pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 });

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setTimeout(() => {
      refetch(1, value, statusFilter, false);
    }, 300);
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

  const fetchStats = async () => {
    try {
      const data = await adminService.getOrderStats();
      setStats(data);
    } catch (error) {
      console.error('Erreur stats:', error);
    }
  };

  React.useEffect(() => {
    fetchStats();
  }, []);

  const handleViewOrder = (orderId: number) => {
    window.location.href = `/order-details/${orderId}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Package className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Commandes</h1>
        <div className="text-sm text-gray-500">
          {orders.length} commande{orders.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-gray-900">{pagination?.total || 0}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {stats?.pending || 0}
          </div>
          <div className="text-sm text-gray-600">En attente</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">
            {stats?.confirmed || 0}
          </div>
          <div className="text-sm text-gray-600">Confirmées</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-purple-600">
            {stats?.shipped || 0}
          </div>
          <div className="text-sm text-gray-600">Expédiées</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600">
            {stats?.delivered || 0}
          </div>
          <div className="text-sm text-gray-600">Livrées</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par numéro de commande..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmées</option>
              <option value="shipped">Expédiées</option>
              <option value="delivered">Livrées</option>
              <option value="cancelled">Annulées</option>
            </select>
            <button className="border rounded-lg px-3 py-2 hover:bg-gray-50 flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filtres</span>
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commande</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Articles</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">#{order.order_number || order.id}</div>
                    <div className="text-sm text-gray-500">{order.payment_method || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {order.user ? `${order.user.first_name} ${order.user.last_name}` : 'Client supprimé'}
                    </div>
                    <div className="text-sm text-gray-500">{order.user?.email || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(order.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {order.order_items?.length || 0} article{((order.order_items?.length || 0) > 1) ? 's' : ''}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {Number(order.total_amount || 0).toFixed(2)}€
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{getStatusLabel(order.status)}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewOrder(order.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className="text-xs border rounded px-2 py-1"
                      >
                        <option value="pending">En attente</option>
                        <option value="confirmed">Confirmée</option>
                        <option value="shipped">Expédiée</option>
                        <option value="delivered">Livrée</option>
                        <option value="cancelled">Annulée</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button 
              onClick={() => refetch(pagination.current_page - 1, searchTerm, statusFilter, false)}
              disabled={pagination.current_page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Précédent
            </button>
            <button 
              onClick={() => refetch(pagination.current_page + 1, searchTerm, statusFilter, false)}
              disabled={pagination.current_page === pagination.last_page}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Affichage de <span className="font-medium">{((pagination.current_page - 1) * pagination.per_page) + 1}</span> à{' '}
                <span className="font-medium">{Math.min(pagination.current_page * pagination.per_page, pagination.total)}</span> sur{' '}
                <span className="font-medium">{pagination.total}</span> commandes
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button 
                  onClick={() => refetch(pagination.current_page - 1, searchTerm, statusFilter, false)}
                  disabled={pagination.current_page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Précédent
                </button>
                {[...Array(Math.min(pagination.last_page, 5))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => refetch(pageNum, searchTerm, statusFilter, false)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pagination.current_page === pageNum
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button 
                  onClick={() => refetch(pagination.current_page + 1, searchTerm, statusFilter, false)}
                  disabled={pagination.current_page === pagination.last_page}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Suivant
                </button>
              </nav>
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
    </div>
  );
}