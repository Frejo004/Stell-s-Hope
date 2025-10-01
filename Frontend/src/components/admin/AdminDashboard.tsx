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
          <div key={stat.title} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-xl`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <span className="ml-2 text-sm font-medium text-green-600">{stat.change}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Commandes Récentes</h2>
              <button 
                onClick={() => onNavigate('orders')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Voir tout
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-semibold text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-500">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{order.amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
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
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Actions Rapides</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => onNavigate('products')}
                className="p-6 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <Package className="w-8 h-8 mx-auto mb-3 text-gray-400 group-hover:text-blue-600" />
                <p className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Ajouter Produit</p>
              </button>
              <button 
                onClick={() => onNavigate('orders')}
                className="p-6 border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all group"
              >
                <ShoppingCart className="w-8 h-8 mx-auto mb-3 text-gray-400 group-hover:text-green-600" />
                <p className="text-sm font-medium text-gray-700 group-hover:text-green-700">Gérer Commandes</p>
              </button>
              <button 
                onClick={() => onNavigate('customers')}
                className="p-6 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all group"
              >
                <Users className="w-8 h-8 mx-auto mb-3 text-gray-400 group-hover:text-purple-600" />
                <p className="text-sm font-medium text-gray-700 group-hover:text-purple-700">Voir Clients</p>
              </button>
              <button 
                onClick={() => onNavigate('analytics')}
                className="p-6 border border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all group"
              >
                <BarChart3 className="w-8 h-8 mx-auto mb-3 text-gray-400 group-hover:text-orange-600" />
                <p className="text-sm font-medium text-gray-700 group-hover:text-orange-700">Analytics</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
          <div className="ml-3">
            <h3 className="text-sm font-semibold text-yellow-800">Attention</h3>
            <p className="text-sm text-yellow-700 mt-1">
              3 produits ont un stock faible. <button className="underline font-medium hover:no-underline">Voir les détails</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}