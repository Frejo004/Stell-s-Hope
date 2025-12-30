import { useState } from 'react';
import {
  BarChart3, Package, ShoppingCart, Users, Settings, LogOut,
  Menu, X, Search, Bell, MessageSquare, Tag, Star,
  FileText, HelpCircle, Archive, Percent, Truck, CreditCard,
  ChevronLeft, LayoutDashboard, ExternalLink
} from 'lucide-react';
import { useSidebarData } from '../../hooks/useSidebarData';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminCustomers from './AdminCustomers';
import AdminAnalytics from './AdminAnalytics';
import AdminSettings from './AdminSettings';
import AdminCategories from './AdminCategories';
import AdminReviews from './AdminReviews';
import AdminContent from './AdminContent';
import AdminSupport from './AdminSupport';
import AdminInventory from './AdminInventory';
import AdminPromotions from './AdminPromotions';
import AdminShipping from './AdminShipping';
import AdminPayments from './AdminPayments';
import { useAuth } from '../../hooks/useAuth';

export default function AdminLayout() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { stats } = useSidebarData();
  const { user } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'orders', label: 'Commandes', icon: ShoppingCart, badge: stats.orders, category: 'Commerce' },
    { id: 'products', label: 'Produits', icon: Package, category: 'Commerce' },
    { id: 'inventory', label: 'Stocks', icon: Archive, badge: stats.low_stock, category: 'Commerce' },
    { id: 'categories', label: 'Catégories', icon: Tag, category: 'Commerce' },
    { id: 'promotions', label: 'Reductions', icon: Percent, category: 'Marketing' },
    { id: 'customers', label: 'Clients', icon: Users, category: 'Gestion' },
    { id: 'reviews', label: 'Avis', icon: Star, badge: stats.pending_reviews, category: 'Gestion' },
    { id: 'support', label: 'Support', icon: HelpCircle, badge: stats.support_tickets, category: 'Gestion' },
    { id: 'content', label: 'Pages & Blog', icon: FileText, category: 'Site' },
    { id: 'shipping', label: 'Livraison', icon: Truck, category: 'Paramètres' },
    { id: 'payments', label: 'Paiements', icon: CreditCard, category: 'Paramètres' },
    { id: 'analytics', label: 'Rapports', icon: BarChart3, category: 'Paramètres' },
    { id: 'settings', label: 'Réglages', icon: Settings, category: 'Paramètres' }
  ];

  const groupedMenuItems = menuItems.reduce((acc: any, item) => {
    const category = item.category || 'Général';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard': return <AdminDashboard onNavigate={setCurrentPage} />;
      case 'products': return <AdminProducts onNavigate={setCurrentPage} />;
      case 'orders': return <AdminOrders onNavigate={setCurrentPage} />;
      case 'customers': return <AdminCustomers onNavigate={setCurrentPage} />;
      case 'categories': return <AdminCategories onNavigate={setCurrentPage} />;
      case 'reviews': return <AdminReviews onNavigate={setCurrentPage} />;
      case 'inventory': return <AdminInventory onNavigate={setCurrentPage} />;
      case 'support': return <AdminSupport onNavigate={setCurrentPage} />;
      case 'content': return <AdminContent onNavigate={setCurrentPage} />;
      case 'analytics': return <AdminAnalytics onNavigate={setCurrentPage} />;
      case 'promotions': return <AdminPromotions onNavigate={setCurrentPage} />;
      case 'shipping': return <AdminShipping onNavigate={setCurrentPage} />;
      case 'payments': return <AdminPayments onNavigate={setCurrentPage} />;
      case 'settings': return <AdminSettings onNavigate={setCurrentPage} />;
      default: return <AdminDashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 ${sidebarCollapsed ? 'w-20' : 'w-72'
          } bg-slate-900 shadow-2xl transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} h-20 px-6 border-b border-slate-800`}>
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3 group cursor-pointer">
                <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-lg leading-tight">STELL'S</span>
                  <span className="text-rose-400 font-medium text-xs tracking-widest uppercase">Admin Hub</span>
                </div>
              </div>
            )}
            {sidebarCollapsed && (
              <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-thin scrollbar-thumb-slate-700">
            {Object.entries(groupedMenuItems).map(([category, items]: [string, any]) => (
              <div key={category} className="space-y-2">
                {!sidebarCollapsed && (
                  <h3 className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[2px] mb-4">
                    {category}
                  </h3>
                )}
                <div className="space-y-1">
                  {items.map((item: any) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentPage(item.id);
                        if (window.innerWidth < 1024) setSidebarOpen(false);
                      }}
                      className={`w-full group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${currentPage === item.id
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                        }`}
                    >
                      <div className="flex items-center min-w-0">
                        <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${currentPage === item.id ? 'text-white' : 'text-slate-500 group-hover:text-rose-400'
                          }`} />
                        {!sidebarCollapsed && (
                          <span className="ml-3 font-medium truncate">{item.label}</span>
                        )}
                      </div>
                      {!sidebarCollapsed && item.badge && item.badge > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${currentPage === item.id ? 'bg-white text-rose-500' : 'bg-rose-500/10 text-rose-500'
                          }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer Sidebar */}
          <div className="p-4 mt-auto border-t border-slate-800">
            <button
              onClick={() => window.open('/', '_blank')}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'px-4'} py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all`}
            >
              <ExternalLink className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="ml-3 font-medium">Boutique</span>}
            </button>
            <button
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'px-4'} py-3 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all mt-1`}
              onClick={() => {/* logout logic here */ }}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="ml-3 font-medium">Déconnexion</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>

            {/* Breadcrumb breading - can be improved */}
            <div className="hidden sm:flex items-center space-x-2 text-sm">
              <span className="text-slate-400">Admin</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-900 font-semibold capitalize">{currentPage}</span>
            </div>
          </div>

          {/* Search box premium */}
          <div className="flex-1 max-w-xl mx-8 hidden md:block">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
              <input
                type="text"
                placeholder="Rechercher une commande, un client..."
                className="w-full pl-12 pr-4 py-2.5 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-rose-500/20 focus:bg-white transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white shadow-sm ring-2 ring-rose-500/20 animate-pulse"></span>
              </button>
            </div>

            <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-all hidden sm:flex">
              <MessageSquare className="w-5 h-5" />
            </button>

            {/* Profile Dropdown Simulation */}
            <div className="h-10 w-[1px] bg-slate-200 mx-2 hidden sm:block"></div>

            <button className="flex items-center space-x-3 pl-2 pr-1 py-1 hover:bg-slate-100 rounded-2xl transition-all group">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-bold text-slate-900 leading-none">
                  {user?.first_name || 'Admin'}
                </span>
                <span className="text-[10px] font-medium text-slate-500 mt-1 uppercase tracking-wider">
                  Administrateur
                </span>
              </div>
              <div className="w-10 h-10 bg-rose-100 border-2 border-rose-200 rounded-xl flex items-center justify-center text-rose-600 font-bold group-hover:scale-105 transition-transform">
                {(user?.first_name?.[0] || 'A').toUpperCase()}
              </div>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 scroll-smooth">
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
