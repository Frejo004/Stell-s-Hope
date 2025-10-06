import React, { useState, useEffect } from 'react';
import { BarChart3, Package, Users, ShoppingCart, TrendingUp, AlertCircle, DollarSign, Percent, Truck, CreditCard, Star, HelpCircle, TrendingDown } from 'lucide-react';
import { adminService } from '../../services/adminService';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await adminService.getDashboardStats();
        setDashboardData(data);
      } catch (error) {
        console.error('Erreur chargement dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = [
    { title: 'Chiffre d\'Affaires', value: `${dashboardData?.stats?.revenue || 0}€`, change: '+12.5%', icon: DollarSign, color: 'bg-green-500', trend: 'up' },
    { title: 'Commandes', value: dashboardData?.stats?.orders || 0, change: '+8.2%', icon: ShoppingCart, color: 'bg-blue-500', trend: 'up' },
    { title: 'Clients', value: dashboardData?.stats?.customers || 0, change: '+15.3%', icon: Users, color: 'bg-purple-500', trend: 'up' },
    { title: 'Panier Moyen', value: `${Math.round(dashboardData?.stats?.average_order || 0)}€`, change: '-2.1%', icon: Package, color: 'bg-orange-500', trend: 'down' }
  ];

  const recentOrders = dashboardData?.recent_orders?.map((order: any) => ({
    id: `CMD${order.id.toString().padStart(3, '0')}`,
    customer: `${order.user?.first_name || 'Client'} ${order.user?.last_name || ''}`,
    amount: `${order.total}€`,
    status: order.status || 'pending',
    time: new Date(order.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  })) || [];

  const quickStats = [
    { label: 'Promotions Actives', value: '3', icon: Percent, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Modes Livraison', value: '4', icon: Truck, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Moyens Paiement', value: '4', icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Avis en Attente', value: '2', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Tickets Support', value: '1', icon: HelpCircle, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Stock Faible', value: '3', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100' }
  ];

  const topProducts = dashboardData?.top_products?.map((product: any) => ({
    name: product.name,
    sales: Math.floor(Math.random() * 50) + 10,
    revenue: `${(product.price * (Math.floor(Math.random() * 50) + 10)).toFixed(0)}€`
  })) || [];

  const monthlyRevenue = [
    { month: 'Jan', revenue: 15234, orders: 89, growth: 12 },
    { month: 'Fév', revenue: 18456, orders: 102, growth: 21 },
    { month: 'Mar', revenue: 22134, orders: 125, growth: 20 },
    { month: 'Avr', revenue: 19876, orders: 115, growth: -10 },
    { month: 'Mai', revenue: 25678, orders: 145, growth: 29 },
    { month: 'Juin', revenue: 28934, orders: 167, growth: 13 }
  ];

  const categoryStats = dashboardData?.categories?.map((category: any, index: number) => {
    const colors = ['bg-blue-500', 'bg-pink-500', 'bg-purple-500', 'bg-green-500'];
    const totalProducts = dashboardData.categories.reduce((sum: number, cat: any) => sum + cat.products_count, 0);
    return {
      name: category.name,
      sales: category.products_count,
      percentage: totalProducts > 0 ? Math.round((category.products_count / totalProducts) * 100) : 0,
      color: colors[index % colors.length]
    };
  }) || [];

  const recentActivity = [
    { type: 'order', message: 'Nouvelle commande #CMD234', time: '2 min', icon: ShoppingCart, color: 'text-blue-600' },
    { type: 'customer', message: 'Nouveau client inscrit', time: '15 min', icon: Users, color: 'text-green-600' },
    { type: 'review', message: 'Nouvel avis 5 étoiles', time: '1h', icon: Star, color: 'text-yellow-600' },
    { type: 'stock', message: 'Stock faible: Jean Slim', time: '2h', icon: AlertCircle, color: 'text-red-600' },
    { type: 'payment', message: 'Paiement reçu: 156€', time: '3h', icon: DollarSign, color: 'text-purple-600' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <div className="flex items-center mt-2">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center ml-2">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>{stat.change}</span>
                  </div>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-xl`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>



      {/* Revenue Chart - Compact */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Évolution CA</h2>
            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                <span className="text-gray-600">Revenus</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                <span className="text-gray-600">Commandes</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            {monthlyRevenue.slice(-4).map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-8 text-xs font-medium text-gray-600">{data.month}</div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                      <div 
                        className="bg-blue-500 h-1.5 rounded-full" 
                        style={{ width: `${(data.revenue / Math.max(...monthlyRevenue.map(d => d.revenue))) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-green-500 h-1 rounded-full" 
                        style={{ width: `${(data.orders / Math.max(...monthlyRevenue.map(d => d.orders))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="text-right ml-3">
                  <div className="text-xs font-semibold text-gray-900">{(data.revenue/1000).toFixed(0)}k€</div>
                  <div className={`text-xs font-medium ${
                    data.growth > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {data.growth > 0 ? '+' : ''}{data.growth}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Performance - Compact */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Catégories</h2>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {categoryStats.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 ${category.color} rounded-full`}></div>
                    <span className="text-sm font-medium text-gray-900">{category.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`${category.color} h-1.5 rounded-full`}
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-right w-8">
                      <div className="text-xs font-semibold text-gray-900">{category.percentage}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity - Compact */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Activité</h2>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {recentActivity.slice(0, 4).map((activity, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <activity.icon className={`w-3 h-3 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Metrics */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Temps Réel</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-xs text-gray-600">Visiteurs en ligne</div>
                <div className="flex justify-center mt-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-600">Paniers actifs</span>
                  <span className="text-sm font-semibold text-blue-600">8</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-600">Commandes/h</span>
                  <span className="text-sm font-semibold text-purple-600">3.2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">CA aujourd'hui</span>
                  <span className="text-sm font-semibold text-green-600">1,234€</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Recent Orders - Compact */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Commandes</h2>
              <button 
                onClick={() => onNavigate('orders')}
                className="text-blue-600 hover:text-blue-800 text-xs font-medium"
              >
                Tout
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {recentOrders.slice(0, 3).map((order) => (
                <div key={order.id} className="flex items-center justify-between py-1">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{order.id}</p>
                    <p className="text-xs text-gray-500">{order.customer.split(' ')[0]}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 text-sm">{order.amount}</p>
                    <span className={`text-xs px-1 py-0.5 rounded font-medium ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status === 'delivered' ? 'OK' :
                       order.status === 'shipped' ? 'EXP' : 'ATT'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products - Compact */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Top Produits</h2>
              <button 
                onClick={() => onNavigate('products')}
                className="text-blue-600 hover:text-blue-800 text-xs font-medium"
              >
                Tout
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              {topProducts.slice(0, 3).map((product, index) => (
                <div key={index} className="flex items-center justify-between py-1">
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs font-bold text-white ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-xs truncate">{product.name.split(' ').slice(0, 2).join(' ')}</p>
                      <p className="text-xs text-gray-500">{product.sales} ventes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 text-xs">{product.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics - Ultra Compact */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Performance</h2>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              <div className="text-center">
                <div className="relative w-12 h-12 mx-auto mb-1">
                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-gray-200" stroke="currentColor" strokeWidth="2" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-green-500" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="75, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-900">75%</span>
                  </div>
                </div>
                <p className="text-xs font-medium text-gray-900">Conversion</p>
              </div>
              
              <div className="text-center">
                <div className="relative w-12 h-12 mx-auto mb-1">
                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-gray-200" stroke="currentColor" strokeWidth="2" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-blue-500" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="88, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-900">88%</span>
                  </div>
                </div>
                <p className="text-xs font-medium text-gray-900">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Actions</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => onNavigate('products')}
                className="p-2 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group text-center"
              >
                <Package className="w-4 h-4 mx-auto mb-1 text-gray-400 group-hover:text-blue-600" />
                <p className="text-xs font-medium text-gray-700 group-hover:text-blue-700">Produits</p>
              </button>
              <button 
                onClick={() => onNavigate('orders')}
                className="p-2 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all group text-center"
              >
                <ShoppingCart className="w-4 h-4 mx-auto mb-1 text-gray-400 group-hover:text-green-600" />
                <p className="text-xs font-medium text-gray-700 group-hover:text-green-700">Commandes</p>
              </button>
              <button 
                onClick={() => onNavigate('promotions')}
                className="p-2 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all group text-center"
              >
                <Percent className="w-4 h-4 mx-auto mb-1 text-gray-400 group-hover:text-purple-600" />
                <p className="text-xs font-medium text-gray-700 group-hover:text-purple-700">Promos</p>
              </button>
              <button 
                onClick={() => onNavigate('analytics')}
                className="p-2 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all group text-center"
              >
                <BarChart3 className="w-4 h-4 mx-auto mb-1 text-gray-400 group-hover:text-orange-600" />
                <p className="text-xs font-medium text-gray-700 group-hover:text-orange-700">Analytics</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Funnel */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Entonnoir de Vente</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm font-medium">Visiteurs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12">2,456</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm font-medium">Ajouts Panier</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12">1,596</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm font-medium">Commandes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12">1,105</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span className="text-sm font-medium">Paiements</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '38%' }}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12">934</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taux de conversion global</span>
                <span className="font-semibold text-green-600">38.0%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods Performance */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Moyens de Paiement</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium">Carte Bancaire</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">67%</div>
                  <div className="text-xs text-gray-500">1,245 trans.</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium">PayPal</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">23%</div>
                  <div className="text-xs text-gray-500">567 trans.</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium">Virement</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">8%</div>
                  <div className="text-xs text-gray-500">89 trans.</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Percent className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium">Autres</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">2%</div>
                  <div className="text-xs text-gray-500">23 trans.</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taux de succès moyen</span>
                <span className="font-semibold text-green-600">94.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts & Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-yellow-800">Stock Critique</h3>
              <p className="text-sm text-yellow-700 mt-1">
                3 produits en rupture imminente
              </p>
              <button onClick={() => onNavigate('inventory')} className="text-xs text-yellow-800 underline font-medium hover:no-underline mt-2">
                Gérer les stocks →
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
          <div className="flex">
            <HelpCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-blue-800">Support Urgent</h3>
              <p className="text-sm text-blue-700 mt-1">
                1 ticket priorité haute
              </p>
              <button onClick={() => onNavigate('support')} className="text-xs text-blue-800 underline font-medium hover:no-underline mt-2">
                Répondre maintenant →
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
          <div className="flex">
            <Star className="w-5 h-5 text-green-500 flex-shrink-0" />
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-green-800">Nouveaux Avis</h3>
              <p className="text-sm text-green-700 mt-1">
                2 avis 5★ à modérer
              </p>
              <button onClick={() => onNavigate('reviews')} className="text-xs text-green-800 underline font-medium hover:no-underline mt-2">
                Modérer les avis →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Aperçu Rapide</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Percent className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">3</div>
              <div className="text-xs text-gray-600">Promotions</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Truck className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">4</div>
              <div className="text-xs text-gray-600">Livraisons</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <CreditCard className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">4</div>
              <div className="text-xs text-gray-600">Paiements</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">2</div>
              <div className="text-xs text-gray-600">Avis</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <HelpCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">1</div>
              <div className="text-xs text-gray-600">Support</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900">3</div>
              <div className="text-xs text-gray-600">Alertes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}