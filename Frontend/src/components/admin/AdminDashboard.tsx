import { useState, useEffect } from 'react';
import {
  BarChart3, Users, ShoppingCart, TrendingUp, AlertCircle,
  CreditCard, Star, HelpCircle,
  TrendingDown, ArrowRight, Activity, Calendar, Clock, Tag, Sparkles
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatPrice } from '../../utils';

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
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-stone-300 border-t-stone-950 rounded-full animate-spin"></div>
          <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">
            Chargement de l'Atelier...
          </span>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Chiffre d\'Affaires',
      value: `${formatPrice(dashboardData?.stats?.revenue || 0)}`,
      change: dashboardData?.stats?.revenue_change || '+0%',
      icon: CreditCard,
      color: 'bg-stone-950 text-white',
      badgeColor: 'text-stone-900 bg-stone-100',
      trend: (dashboardData?.stats?.revenue_change || '').startsWith('-') ? 'down' : 'up'
    },
    {
      title: 'Commandes Effectuées',
      value: dashboardData?.stats?.orders || 0,
      change: dashboardData?.stats?.orders_change || '+0%',
      icon: ShoppingCart,
      color: 'bg-terracotta-500 text-white',
      badgeColor: 'text-terracotta-600 bg-rose-50',
      trend: (dashboardData?.stats?.orders_change || '').startsWith('-') ? 'down' : 'up'
    },
    {
      title: 'Clients & Membres',
      value: dashboardData?.stats?.customers || 0,
      change: dashboardData?.stats?.customers_change || '+0%',
      icon: Users,
      color: 'bg-stone-800 text-white',
      badgeColor: 'text-stone-700 bg-stone-100',
      trend: (dashboardData?.stats?.customers_change || '').startsWith('-') ? 'down' : 'up'
    },
    {
      title: 'Panier Moyen',
      value: `${formatPrice(Math.round(dashboardData?.stats?.average_order || 0))}`,
      change: dashboardData?.stats?.average_order_change || '+0%',
      icon: Sparkles,
      color: 'bg-amber-600 text-white',
      badgeColor: 'text-amber-700 bg-amber-50',
      trend: (dashboardData?.stats?.average_order_change || '').startsWith('-') ? 'down' : 'up'
    }
  ];

  const recentOrders = dashboardData?.recent_orders?.map((order: any) => ({
    id: `CMD${order.id.toString().padStart(3, '0')}`,
    customer: `${order.user?.first_name || 'Client'} ${order.user?.last_name || ''}`,
    amount: `${formatPrice(order.total)}`,
    status: order.status || 'pending',
    date: new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  })) || [];

  const topProducts = dashboardData?.top_products || [];
  const monthlyRevenue = dashboardData?.monthly_revenue || [];
  const categoryStats = dashboardData?.category_stats || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ─── En-tête de Bienvenue ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/60">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-terracotta-600">
            Console de Pilotage
          </span>
          <h1 className="font-serif text-3xl font-normal text-stone-950 mt-1">
            Vue d'ensemble de l'Atelier
          </h1>
          <p className="text-xs text-stone-500 font-light mt-1">
            Performances financières, flux de commandes et état des collections en temps réel.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-stone-200/80 shadow-sm self-start sm:self-auto">
          <div className="flex items-center gap-2 pr-3 border-r border-stone-200 text-xs">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-medium text-stone-800 capitalize">
              {new Date().toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-light">Direct</span>
          </div>
        </div>
      </div>

      {/* ─── Cartes KPI Principales ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm hover:shadow-md hover:border-stone-300 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div className={`w-11 h-11 rounded-2xl ${stat.color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                stat.trend === 'up' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}>
                {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{stat.change}</span>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">{stat.title}</p>
              <h3 className="font-serif text-2xl font-normal text-stone-950 mt-1 tracking-tight">
                {stat.value}
              </h3>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-light">
              <span>Évolution mensuelle</span>
              <span className="text-stone-600 font-medium">Actif</span>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Grille Centrale : Graphique + En direct ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne gauche (2 tiers) : Graphique & Dernières Commandes */}
        <div className="lg:col-span-2 space-y-8">
          {/* Graphique d'évolution des ventes */}
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-stone-100">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">Analyse de Performance</span>
                <h2 className="font-serif text-xl font-normal text-stone-950 mt-0.5">Évolution des Recettes</h2>
              </div>
              <div className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-200 text-xs text-stone-600">
                <BarChart3 className="w-3.5 h-3.5 text-stone-700" />
                <span className="font-medium">Historique mensuel</span>
              </div>
            </div>

            {/* Visualisation en barres élégantes */}
            <div className="pt-8 pb-4">
              <div className="h-[220px] flex items-end justify-between gap-3 sm:gap-6">
                {monthlyRevenue.length > 0 ? (
                  monthlyRevenue.map((data: any, idx: number) => {
                    const maxRevenue = Math.max(...monthlyRevenue.map((d: any) => d.revenue || 0));
                    const height = maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center group h-full justify-end">
                        <div className="relative w-full flex flex-col items-center">
                          {/* Tooltip soyeux */}
                          <div className="absolute -top-9 bg-stone-950 text-white text-[10px] px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none z-10">
                            {formatPrice(data.revenue)}
                          </div>
                          {/* Barre avec dégradé subtil */}
                          <div
                            className="w-full max-w-[36px] bg-stone-900 group-hover:bg-terracotta-500 rounded-t-xl transition-all duration-300 shadow-sm"
                            style={{ height: `${Math.max(height, 8)}%` }}
                          />
                        </div>
                        <span className="mt-3 text-[10px] uppercase font-semibold text-stone-400 group-hover:text-stone-950 transition-colors">
                          {data.month}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-stone-400 italic">
                    Aucune donnée de vente pour cette période
                  </div>
                )}
              </div>

              {/* Métriques d'atelier */}
              <div className="mt-8 pt-6 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/60 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Croissance</p>
                  <p className="font-serif text-lg text-emerald-700 font-medium mt-0.5">+12.5%</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/60 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Conversion</p>
                  <p className="font-serif text-lg text-stone-900 font-medium mt-0.5">4.2%</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/60 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Satisfaction</p>
                  <p className="font-serif text-lg text-amber-700 font-medium mt-0.5">4.9 / 5</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/60 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Réassort</p>
                  <p className="font-serif text-lg text-stone-900 font-medium mt-0.5">98%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Table des Dernières Commandes */}
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
            <div className="p-6 sm:p-7 border-b border-stone-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">Flux d'achats</span>
                <h2 className="font-serif text-xl font-normal text-stone-950 mt-0.5">Commandes Récentes</h2>
              </div>
              <button
                onClick={() => onNavigate('orders')}
                className="inline-flex items-center gap-1.5 text-xs text-stone-950 hover:text-terracotta-600 font-medium uppercase tracking-wider transition-colors"
              >
                <span>Toutes les commandes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50/80 border-b border-stone-100">
                  <tr>
                    <th className="px-6 py-3.5 font-semibold uppercase tracking-wider text-stone-400 text-[10px]">Client</th>
                    <th className="px-6 py-3.5 font-semibold uppercase tracking-wider text-stone-400 text-[10px]">Montant</th>
                    <th className="px-6 py-3.5 font-semibold uppercase tracking-wider text-stone-400 text-[10px]">Statut</th>
                    <th className="px-6 py-3.5 font-semibold uppercase tracking-wider text-stone-400 text-[10px]">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {recentOrders.length > 0 ? (
                    recentOrders.slice(0, 5).map((order: any, idx: number) => {
                      const statusStyles: Record<string, string> = {
                        delivered: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                        shipped: 'bg-sky-50 text-sky-800 border-sky-200',
                        confirmed: 'bg-stone-100 text-stone-800 border-stone-200',
                        pending: 'bg-amber-50 text-amber-800 border-amber-200',
                        cancelled: 'bg-rose-50 text-rose-800 border-rose-200'
                      };
                      const statusLabels: Record<string, string> = {
                        delivered: 'Livrée',
                        shipped: 'Expédiée',
                        confirmed: 'Confirmée',
                        pending: 'En attente',
                        cancelled: 'Annulée'
                      };

                      return (
                        <tr key={idx} className="hover:bg-stone-50/60 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 text-stone-800 flex items-center justify-center font-serif font-medium text-xs">
                                {order.customer[0]}
                              </div>
                              <div>
                                <p className="font-medium text-stone-900">{order.customer}</p>
                                <p className="text-[10px] text-terracotta-600 font-mono">{order.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-serif font-medium text-stone-950">
                            {order.amount}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                              statusStyles[order.status] || 'bg-stone-100 text-stone-700 border-stone-200'
                            }`}>
                              {statusLabels[order.status] || order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-stone-400 text-[11px]">
                            {order.date}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-stone-400 italic">
                        Aucune commande enregistrée pour le moment.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Colonne droite (1 tiers) : En Direct, Catégories & Top Ventes */}
        <div className="space-y-8">
          {/* Widget Haute Couture "En Direct" */}
          <div className="bg-[#121212] rounded-3xl p-7 text-white shadow-xl border border-stone-800 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></span>
                <span className="text-xs font-serif tracking-wider uppercase text-stone-300">En Direct</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-stone-500 font-mono">Temps Réel</span>
            </div>

            <div className="text-center py-4">
              <p className="font-serif text-5xl font-normal text-white tracking-tight">
                {dashboardData?.live_metrics?.online_visitors || 12}
              </p>
              <p className="text-[11px] text-emerald-400 font-medium uppercase tracking-widest mt-2 flex items-center justify-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>Visiteurs dans la boutique</span>
              </p>
            </div>

            <div className="space-y-3 pt-6 border-t border-stone-800/80 text-xs">
              <div className="flex justify-between items-center text-stone-400">
                <span className="font-light">Paniers en composition</span>
                <span className="font-serif text-white font-medium">{dashboardData?.live_metrics?.active_carts || 3}</span>
              </div>
              <div className="flex justify-between items-center text-stone-400">
                <span className="font-light">Commandes / heure</span>
                <span className="font-serif text-white font-medium">{dashboardData?.live_metrics?.orders_per_hour || 2}</span>
              </div>
              <div className="pt-2">
                <div className="flex justify-between text-[11px] mb-1.5">
                  <span className="text-stone-400">Objectif du jour</span>
                  <span className="text-emerald-400 font-medium">85%</span>
                </div>
                <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-terracotta-500 to-rose-300 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Répartition par Catégories */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="font-serif text-base font-normal text-stone-950">Ventes par Univers</h2>
              <Tag className="w-4 h-4 text-stone-400" />
            </div>

            <div className="space-y-4">
              {(categoryStats.length > 0 ? categoryStats : [
                { name: 'Femme', percentage: 55, color: 'bg-stone-950' },
                { name: 'Homme', percentage: 25, color: 'bg-stone-700' },
                { name: 'Accessoires', percentage: 15, color: 'bg-terracotta-500' },
                { name: 'Enfant', percentage: 5, color: 'bg-stone-400' }
              ]).map((cat: any, idx: number) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-stone-700">{cat.name}</span>
                    <span className="font-serif text-stone-900 font-medium">{cat.percentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cat.color || 'bg-stone-900'} rounded-full transition-all duration-700`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Ventes de l'Atelier */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="font-serif text-base font-normal text-stone-950">Pièces Vedettes</h2>
              <button
                onClick={() => onNavigate('products')}
                className="text-stone-400 hover:text-stone-900 transition-colors"
                title="Voir le catalogue"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {topProducts.length > 0 ? (
                topProducts.slice(0, 4).map((product: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-2xl hover:bg-stone-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-stone-100 border border-stone-200 text-stone-700 flex items-center justify-center font-serif text-[11px] font-semibold">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-stone-900 truncate">{product.name}</p>
                        <p className="text-[10px] text-stone-400">{product.sales || 0} ventes</p>
                      </div>
                    </div>
                    <span className="font-serif text-xs font-medium text-stone-950 whitespace-nowrap">
                      {formatPrice(product.revenue || 0)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-400 italic text-center py-2">
                  Aucune vente enregistrée
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Cartes d'Alertes Atelier ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
        <div className="bg-white border-l-2 border-l-rose-500 rounded-3xl p-5 shadow-sm flex items-start gap-3.5 border border-stone-200/60">
          <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900">Seuil de Stock</h3>
            <p className="text-xs text-stone-500 mt-0.5 font-light">Certaines références sont en quantité limitée.</p>
            <button
              onClick={() => onNavigate('inventory')}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 mt-2.5 inline-flex items-center gap-1 uppercase tracking-wider"
            >
              <span>Vérifier les stocks</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="bg-white border-l-2 border-l-stone-900 rounded-3xl p-5 shadow-sm flex items-start gap-3.5 border border-stone-200/60">
          <div className="w-9 h-9 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center shrink-0">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900">Conciergerie</h3>
            <p className="text-xs text-stone-500 mt-0.5 font-light">Les requêtes de clients privilège attendent une réponse.</p>
            <button
              onClick={() => onNavigate('support')}
              className="text-[11px] font-semibold text-stone-900 hover:text-stone-700 mt-2.5 inline-flex items-center gap-1 uppercase tracking-wider"
            >
              <span>Accéder aux messages</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="bg-white border-l-2 border-l-amber-500 rounded-3xl p-5 shadow-sm flex items-start gap-3.5 border border-stone-200/60">
          <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Star className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900">Avis d'Atelier</h3>
            <p className="text-xs text-stone-500 mt-0.5 font-light">Nouveaux retours clients à modérer et publier.</p>
            <button
              onClick={() => onNavigate('reviews')}
              className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 mt-2.5 inline-flex items-center gap-1 uppercase tracking-wider"
            >
              <span>Consulter les avis</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
