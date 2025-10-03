import React from 'react';
import { useOrders } from '../hooks/useOrders';
import { useQueryState, parseAsInteger } from 'nuqs';
import Pagination from './Pagination';

const OrderList: React.FC = () => {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const { orders, loading, error } = useOrders();

  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Erreur: {error}</div>;

  const ordersData = orders?.data || orders || [];
  const pagination = orders?.meta || orders?.pagination;

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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Mes Commandes</h2>
      
      {ordersData.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Vous n'avez pas encore passé de commande
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {ordersData.map((order: any) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Commande #{order.order_number}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status_label || order.status}
                    </span>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      {order.total_amount}€
                    </p>
                  </div>
                </div>

                {order.items && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Articles:</h4>
                    <div className="space-y-2">
                      {order.items.slice(0, 3).map((item: any) => (
                        <div key={item.id} className="flex items-center space-x-3">
                          <img
                            src={item.product?.images?.[0] || '/placeholder.jpg'}
                            alt={item.product?.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {item.product?.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Quantité: {item.quantity} × {item.price}€
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-sm text-gray-500">
                          +{order.items.length - 3} autre(s) article(s)
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    Méthode de paiement: {order.payment_method}
                  </div>
                  <div className="space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Voir détails
                    </button>
                    {order.status === 'shipped' && (
                      <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                        Suivre
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination && (
            <Pagination
              currentPage={page}
              totalPages={pagination.last_page || Math.ceil(pagination.total / pagination.per_page)}
              onPageChange={setPage}
              totalItems={pagination.total}
              itemsPerPage={pagination.per_page}
            />
          )}
        </>
      )}
    </div>
  );
};

export default OrderList;