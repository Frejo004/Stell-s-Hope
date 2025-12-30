import { useState, useEffect } from 'react';
import {
  BarChart3, Users, ShoppingCart, TrendingUp, AlertCircle,
  DollarSign, CreditCard, Star, HelpCircle,
  TrendingDown, ArrowRight, Activity, Calendar, Clock, Tag
} from 'lucide-react';
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin"></div>
          <Activity className="absolute inset-0 m-auto w-6 h-6 text-rose-500 animate-pulse" />
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Chiffre d\'Affaires',
      value: `${dashboardData?.stats?.revenue || 0} €`,
      change: dashboardData?.stats?.revenue_change || '+0%',
      icon: DollarSign,
      color: 'bg-emerald-500',
      trend: (dashboardData?.stats?.revenue_change || '').startsWith('-') ? 'down' : 'up'
    },
    {
      title: 'Commandes',
      value: dashboardData?.stats?.orders || 0,
      change: dashboardData?.stats?.orders_change || '+0%',
      icon: ShoppingCart,
      color: 'bg-rose-500',
      trend: (dashboardData?.stats?.orders_change || '').startsWith('-') ? 'down' : 'up'
    },
    {
      title: 'Clients Actifs',
      value: dashboardData?.stats?.customers || 0,
      change: dashboardData?.stats?.customers_change || '+0%',
      icon: Users,
      color: 'bg-indigo-500',
      trend: (dashboardData?.stats?.customers_change || '').startsWith('-') ? 'down' : 'up'
    },
    {
      title: 'Panier Moyen',
      value: `${Math.round(dashboardData?.stats?.average_order || 0)} €`,
      change: dashboardData?.stats?.average_order_change || '+0%',
      icon: CreditCard,
      color: 'bg-amber-500',
      trend: (dashboardData?.stats?.average_order_change || '').startsWith('-') ? 'down' : 'up'
    }
  ];

  const recentOrders = dashboardData?.recent_orders?.map((order: any) => ({
    id: `CMD${order.id.toString().padStart(3, '0')} `,
    customer: `${order.user?.first_name || 'Client'} ${order.user?.last_name || ''} `,
    amount: `${order.total} €`,
    status: order.status || 'pending',
    date: new Date(order.created_at).toLocaleDateString('fr-FR')
  })) || [];

  const topProducts = dashboardData?.top_products || [];
  const monthlyRevenue = dashboardData?.monthly_revenue || [];
  const categoryStats = dashboardData?.category_stats || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Vue d'ensemble</h1>
          <p className="text-slate-500 mt-1 font-medium">Bienvenue sur votre centre de contrôle Stell's Hope.</p>
        </div>
        <div className="flex items-center space-x-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <div className="bg-rose-50 p-2 rounded-xl">
            <Calendar className="w-5 h-5 text-rose-500" />
          </div>
          <div className="pr-4 border-r border-slate-200">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-0.5">Date</p>
            <p className="text-xs font-bold text-slate-700">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
          <div className="bg-indigo-50 p-2 rounded-xl ml-2">
            <Clock className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="pr-2">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-0.5">Mise à jour</p>
            <p className="text-xs font-bold text-slate-700">Il y a quelques secondes</p>
          </div>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-start justify-between">
              <div className={`${stat.color} p - 4 rounded - 2xl shadow - lg shadow - ${stat.color.split('-')[1]} -500 / 20 group - hover: scale - 110 transition - transform`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items - center space - x - 1 px - 2.5 py - 1 rounded - full text - xs font - bold ${stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                } `}>
                {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{stat.change}</span>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.title}</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{stat.value}</h3>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium italic">Vs mois dernier</span>
              <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h - full ${stat.color} rounded - full`} style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Revenue Chart & Activity */}
        <div className="lg:col-span-2 space-y-8">
          {/* Revenue Evolution - Premium Card */}
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Analyse de Performance</h2>
                <p className="text-sm text-slate-500 font-medium">Suivez l'évolution de vos revenus mensuels</p>
              </div>
              <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
                <BarChart3 className="w-4 h-4 text-rose-500" />
                <span>Rapport complet</span>
              </div>
            </div>
            <div className="p-8">
              <div className="relative h-[280px] flex items-end justify-between space-x-4">
                {monthlyRevenue.map((data: any, idx: number) => {
                  const maxRevenue = Math.max(...monthlyRevenue.map((d: any) => d.revenue));
                  const height = maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center group">
                      <div className="relative w-full flex flex-col items-center">
                        {/* Tooltip on hover */}
                        <div className="absolute -top-12 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {data.revenue} €
                        </div>
                        {/* Gradient Bar */}
                        <div
                          className="w-full max-w-[40px] bg-gradient-to-t from-rose-500 to-rose-400 rounded-t-xl group-hover:from-indigo-600 group-hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-rose-500/10 group-hover:shadow-indigo-500/20"
                          style={{ height: `${Math.max(height, 5)}% ` }}
                        ></div>
                      </div>
                      <span className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-tighter group-hover:text-slate-900 transition-colors">{data.month}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="text-center p-4 rounded-2xl bg-rose-50/50">
                  <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest mb-1">Croissance</p>
                  <p className="text-lg font-black text-rose-600">+12.5%</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-indigo-50/50">
                  <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-1">Taux Reconversion</p>
                  <p className="text-lg font-black text-indigo-600">42%</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-emerald-50/50">
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-1">Satisfaction</p>
                  <p className="text-lg font-black text-emerald-600">4.8/5</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-amber-50/50">
                  <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest mb-1">Paniers Abandonnés</p>
                  <p className="text-lg font-black text-amber-600">18.2%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Dernières Commandes</h2>
              <button
                onClick={() => onNavigate('orders')}
                className="text-indigo-600 hover:text-indigo-700 text-sm font-bold flex items-center"
              >
                Tout voir <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Montant</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Statut</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((order: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600 border border-slate-200">
                            {order.customer[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{order.customer}</p>
                            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-tighter">{order.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-black text-slate-900">{order.amount}</td>
                      <td className="px-8 py-5">
                        <span className={`px - 3 py - 1 rounded - full text - [10px] font - bold uppercase tracking - widest ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-600' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-600' :
                              'bg-amber-100 text-amber-600'
                          } `}>
                          {order.status === 'delivered' ? 'Livré' :
                            order.status === 'shipped' ? 'Expédié' : 'En attente'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-slate-500">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Live, Categories, Top Prods */}
        <div className="space-y-8">
          {/* Live Metrics Premium Widget */}
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl shadow-indigo-500/10 relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-500/20 rounded-full blur-[60px] group-hover:bg-rose-500/30 transition-all"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
                  <h2 className="text-lg font-bold">En Direct</h2>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dernière heure</span>
              </div>

              <div className="text-center mb-8">
                <p className="text-5xl font-black text-white">{dashboardData?.live_metrics?.online_visitors || 0}</p>
                <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mt-2 flex items-center justify-center">
                  <Activity className="w-3 h-3 mr-1" /> Visiteurs actifs
                </p>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Paniers en cours</span>
                  <span className="text-sm font-black text-indigo-400">{dashboardData?.live_metrics?.active_carts || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Commandes /h</span>
                  <span className="text-sm font-black text-rose-400">{dashboardData?.live_metrics?.orders_per_hour || 0}</span>
                </div>
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-200 font-bold uppercase tracking-wider">Objectif journalier</span>
                    <span className="text-xs font-bold text-emerald-400">75%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Categories - Modern Progress bars */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-900">Catégories</h2>
              <Tag className="w-5 h-5 text-rose-500" />
            </div>
            <div className="space-y-6">
              {categoryStats.map((cat: any, idx: number) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{cat.name}</span>
                    <span className="text-xs font-black text-slate-900">{cat.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h - full ${cat.color} rounded - full transition - all duration - 1000`}
                      style={{ width: `${cat.percentage}% ` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-900">Top Ventes</h2>
              <button onClick={() => onNavigate('products')} className="p-2 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {topProducts.slice(0, 3).map((product: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className={`w - 8 h - 8 rounded - lg flex items - center justify - center font - bold text - xs text - white ${idx === 0 ? 'bg-amber-400' : idx === 1 ? 'bg-slate-300' : 'bg-rose-400'
                      } `}>
                      #{idx + 1}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-none mb-0.5 truncate max-w-[120px]">{product.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{product.sales || 0} ventes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-900">{product.revenue || '0 €'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border-l-4 border-l-rose-500 rounded-2xl p-6 shadow-sm flex items-start space-x-4">
          <div className="bg-rose-50 p-3 rounded-xl">
            <AlertCircle className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Stock Faible</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">3 produits nécessitent réapprovisionnement.</p>
            <button onClick={() => onNavigate('inventory')} className="text-xs font-bold text-rose-500 hover:text-rose-600 mt-3 inline-block uppercase tracking-wider">Gérer stock →</button>
          </div>
        </div>

        <div className="bg-white border-l-4 border-l-indigo-500 rounded-2xl p-6 shadow-sm flex items-start space-x-4">
          <div className="bg-indigo-50 p-3 rounded-xl">
            <HelpCircle className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Support Client</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">1 nouveau ticket priorité haute.</p>
            <button onClick={() => onNavigate('support')} className="text-xs font-bold text-indigo-500 hover:text-indigo-600 mt-3 inline-block uppercase tracking-wider">Répondre →</button>
          </div>
        </div>

        <div className="bg-white border-l-4 border-l-amber-500 rounded-2xl p-6 shadow-sm flex items-start space-x-4">
          <div className="bg-amber-50 p-3 rounded-xl">
            <Star className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Nouveaux Avis</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">2 témoignages clients à valider.</p>
            <button onClick={() => onNavigate('reviews')} className="text-xs font-bold text-amber-500 hover:text-amber-600 mt-3 inline-block uppercase tracking-wider">Valider →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
