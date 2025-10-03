import React from 'react';
import { useAdminOrderFilters } from '../../hooks/useAdminFilters';
import { adminService } from '../../services/adminService';
import Pagination from '../Pagination';

const AdminOrderList: React.FC = () => {
  const { 
    page, setPage, 
    search, setSearch, 
    status, setStatus,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    getFilters 
  } = useAdminOrderFilters();

  const [orders, setOrders] = React.useState<any>({ data: [], meta: {} });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await adminService.getAdminOrders(getFilters());
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, search, status, dateFrom, dateTo]);

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      const data = await adminService.getAdminOrders(getFilters());
      setOrders(data);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div className="text-center py-8">Chargement...</div>;

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Rechercher une commande..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          
          <select
            value={status || ''}
            onChange={(e) => {
              setStatus(e.target.value || null);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmée</option>
            <option value="processing">En traitement</option>
            <option value="shipped">Expédiée</option>
            <option value="delivered">Livrée</option>
            <option value="cancelled">Annulée</option>
          </select>

          <input
            type="date"
            value={dateFrom || ''}
            onChange={(e) => {
              setDateFrom(e.target.value || null);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Date début"
          />

          <input
            type="date"
            value={dateTo || ''}
            onChange={(e) => {
              setDateTo(e.target.value || null);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Date fin"
          />

          <button
            onClick={() => {
              setSearch('');
              setStatus(null);
              setDateFrom(null);
              setDateTo(null);
              setPage(1);
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Liste des commandes */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Commande
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Montant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.data.map((order: any) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    #{order.order_number}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.items?.length || 0} article(s)
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.user?.first_name} {order.user?.last_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.user?.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.total_amount}€
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className={`text-xs font-semibold rounded-full px-2 py-1 ${getStatusColor(order.status)}`}
                  >
                    <option value="pending">En attente</option>
                    <option value="confirmed">Confirmée</option>
                    <option value="processing">En traitement</option>
                    <option value="shipped">Expédiée</option>
                    <option value="delivered">Livrée</option>
                    <option value="cancelled">Annulée</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900">
                    Voir détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          currentPage={page}
          totalPages={orders.meta.last_page || 1}
          onPageChange={setPage}
          totalItems={orders.meta.total || 0}
          itemsPerPage={orders.meta.per_page || 15}
        />
      </div>
    </div>
  );
};

export default AdminOrderList;