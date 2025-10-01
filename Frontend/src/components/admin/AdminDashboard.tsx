import React from 'react';
import { BarChart3, Package, Users, ShoppingCart, TrendingUp, AlertCircle } from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const stats = [
    { title: 'Commandes', value: '156', change: '+12%', icon: ShoppingCart, color: 'bg-blue-500' },
    { title: 'Produits', value: '6', change: '+2', icon: Package, color: 'bg-green-500' },
    { title: 'Clients', value: '89', change: '+8%', icon: Users, color: 'bg-purple-500' },
    { title: 'Revenus', value: '12,450€', change: '+15%', icon: TrendingUp, color: 'bg-orange-500' }
  ];

  const recentOrders = [
    { id: 'CMD001', customer: 'Sophie Martin', amount: '89.90€', status: 'shipped' },
    { id: 'CMD002', customer: 'Marc Dubois', amount: '156.80€', status: 'pending' },
    { id: 'CMD003', customer: 'Emma Rousseau', amount: '234.50€', status: 'delivered' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <div className="flex items-center">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <span className="ml-2 text-sm text-green-600">{stat.change}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Commandes Récentes</h2>
              <button 
                onClick={() => onNavigate('orders')}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Voir tout
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status === 'delivered' ? 'Livrée' :
                       order.status === 'shipped' ? 'Expédiée' : 'En attente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Actions Rapides</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => onNavigate('products')}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <Package className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm font-medium">Ajouter Produit</p>
              </button>
              <button 
                onClick={() => onNavigate('orders')}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm font-medium">Gérer Commandes</p>
              </button>
              <button 
                onClick={() => onNavigate('customers')}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm font-medium">Voir Clients</p>
              </button>
              <button 
                onClick={() => onNavigate('analytics')}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <BarChart3 className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm font-medium">Analytics</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <AlertCircle className="w-5 h-5 text-yellow-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Attention</h3>
            <p className="text-sm text-yellow-700 mt-1">
              3 produits ont un stock faible. <button className="underline">Voir les détails</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}