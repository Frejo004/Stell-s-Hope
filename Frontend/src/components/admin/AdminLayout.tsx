import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, Package, ShoppingCart, Users, Settings, LogOut,
  Menu, X, Search, Bell, MessageSquare, Tag, Star,
  FileText, HelpCircle, Archive, Percent, Truck, CreditCard,
  ChevronLeft, LayoutDashboard, ExternalLink, Sparkles
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
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'orders', label: 'Commandes', icon: ShoppingCart, badge: stats?.orders, category: 'Commerce' },
    { id: 'products', label: 'Produits', icon: Package, category: 'Commerce' },
    { id: 'inventory', label: 'Inventaire & Stocks', icon: Archive, badge: stats?.low_stock, category: 'Commerce' },
    { id: 'categories', label: 'Catégories', icon: Tag, category: 'Commerce' },
    { id: 'promotions', label: 'Offres & Codes', icon: Percent, category: 'Marketing' },
    { id: 'customers', label: 'Clients & Privilèges', icon: Users, category: 'Gestion' },
    { id: 'reviews', label: 'Avis Clients', icon: Star, badge: stats?.pending_reviews, category: 'Gestion' },
    { id: 'support', label: 'Conciergerie & Support', icon: HelpCircle, badge: stats?.support_tickets, category: 'Gestion' },
    { id: 'content', label: 'Éditorial & Pages', icon: FileText, category: 'Site' },
    { id: 'shipping', label: 'Expéditions', icon: Truck, category: 'Paramètres' },
    { id: 'payments', label: 'Paiements & Flux', icon: CreditCard, category: 'Paramètres' },
    { id: 'analytics', label: 'Rapports & Ventes', icon: BarChart3, category: 'Paramètres' },
    { id: 'settings', label: 'Configuration', icon: Settings, category: 'Paramètres' }
  ];

  const groupedMenuItems = menuItems.reduce((acc: Record<string, typeof menuItems>, item) => {
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

  const currentItem = menuItems.find(item => item.id === currentPage);

  const handleLogout = async () => {
    try {
      if (logout) await logout();
      navigate('/');
    } catch {
      navigate('/');
    }
  };

  return (
    <div className="flex h-screen bg-[#FAF9F6] text-stone-900 font-sans antialiased overflow-hidden selection:bg-rose-100 selection:text-stone-900">
      {/* ─── Sidebar Haute Couture ─── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        } bg-[#111110] border-r border-stone-800/80 shadow-2xl transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Brand Area */}
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} h-20 px-6 border-b border-stone-800/70`}>
            {!sidebarCollapsed ? (
              <div
                onClick={() => setCurrentPage('dashboard')}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-2xl bg-stone-900 border border-stone-700/80 flex items-center justify-center text-white shadow-inner group-hover:border-terracotta-400/60 transition-colors">
                  <Sparkles className="w-5 h-5 text-terracotta-400 group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-lg tracking-wider text-white font-normal leading-none">
                    STELL'S HOPE
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400 mt-1 font-medium">
                    Atelier Privé
                  </span>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setSidebarCollapsed(false)}
                className="w-10 h-10 rounded-2xl bg-stone-900 border border-stone-700/80 flex items-center justify-center text-white cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-terracotta-400" />
              </div>
            )}

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Section */}
          <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6 scrollbar-thin scrollbar-thumb-stone-800">
            {Object.entries(groupedMenuItems).map(([category, items]) => (
              <div key={category} className="space-y-1">
                {!sidebarCollapsed && (
                  <h3 className="px-3 text-[10px] font-semibold text-stone-500 uppercase tracking-[0.25em] mb-2">
                    {category}
                  </h3>
                )}
                <div className="space-y-1">
                  {items.map((item) => {
                    const isActive = currentPage === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setCurrentPage(item.id);
                          if (window.innerWidth < 1024) setSidebarOpen(false);
                        }}
                        title={sidebarCollapsed ? item.label : undefined}
                        className={`w-full group flex items-center ${
                          sidebarCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'
                        } py-2.5 rounded-2xl text-xs font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-stone-900 text-white shadow-sm border border-stone-700/60'
                            : 'text-stone-400 hover:bg-stone-900/60 hover:text-stone-200'
                        }`}
                      >
                        <div className="flex items-center min-w-0 gap-3">
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                              isActive ? 'text-terracotta-400' : 'text-stone-400 group-hover:text-stone-200'
                            }`}
                          />
                          {!sidebarCollapsed && (
                            <span className="truncate tracking-wide">{item.label}</span>
                          )}
                        </div>

                        {!sidebarCollapsed && Boolean(item.badge && item.badge > 0) && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              isActive
                                ? 'bg-terracotta-500 text-white'
                                : 'bg-stone-800 text-stone-300'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer Sidebar */}
          <div className="p-3 border-t border-stone-800/70 space-y-1 bg-[#0d0d0c]">
            <button
              onClick={() => window.open('/', '_blank')}
              className={`w-full flex items-center ${
                sidebarCollapsed ? 'justify-center' : 'px-3.5'
              } py-2.5 text-xs text-stone-400 hover:text-stone-200 hover:bg-stone-900 rounded-2xl transition-all`}
              title="Voir la Boutique"
            >
              <ExternalLink className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span className="ml-3 font-medium">Boutique en direct</span>}
            </button>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center ${
                sidebarCollapsed ? 'justify-center' : 'px-3.5'
              } py-2.5 text-xs text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all`}
              title="Se déconnecter"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span className="ml-3 font-medium">Déconnexion</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Main Content Shell ─── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FAF9F6]">
        {/* Top Header Glassmorphism */}
        <header className="h-20 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-40 px-6 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-stone-600 hover:bg-stone-200/60 rounded-xl lg:hidden transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-2 text-stone-600 hover:bg-stone-200/60 rounded-xl transition-colors"
              title={sidebarCollapsed ? 'Développer le menu' : 'Réduire le menu'}
            >
              {sidebarCollapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Breadcrumb éditorial */}
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="font-serif italic text-stone-400">Atelier Privé</span>
              <span className="text-stone-300">/</span>
              <span className="font-serif text-stone-900 font-medium">
                {currentItem?.label || currentPage}
              </span>
            </div>
          </div>

          {/* Barre de Recherche Moderne */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-stone-900 transition-colors" />
              <input
                type="text"
                placeholder="Rechercher une commande, client, référence..."
                className="w-full pl-10 pr-4 py-2 bg-white/80 border border-stone-200 rounded-full text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-950/10 focus:border-stone-400 focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Profil & Actions rapides */}
          <div className="flex items-center gap-3">
            {/* Cloche Notifications */}
            <button
              onClick={() => setCurrentPage('orders')}
              className="relative p-2.5 text-stone-600 hover:text-stone-950 hover:bg-stone-200/60 rounded-full transition-colors"
              title="Notifications commandes"
            >
              <Bell className="w-4 h-4" />
              {Boolean(stats?.orders && stats.orders > 0) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {/* Support / Conciergerie */}
            <button
              onClick={() => setCurrentPage('support')}
              className="relative p-2.5 text-stone-600 hover:text-stone-950 hover:bg-stone-200/60 rounded-full transition-colors hidden sm:flex"
              title="Conciergerie & Messages"
            >
              <MessageSquare className="w-4 h-4" />
              {Boolean(stats?.support_tickets && stats.support_tickets > 0) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-terracotta-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            <div className="h-6 w-[1px] bg-stone-200 hidden sm:block mx-1"></div>

            {/* Profile Avatar Card */}
            <div className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-stone-100 transition-all cursor-pointer">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-serif font-medium text-stone-900 leading-tight">
                  {user?.first_name || 'Direction'} {user?.last_name || ''}
                </span>
                <span className="text-[10px] tracking-wider text-stone-500 uppercase font-medium">
                  Atelier Concierge
                </span>
              </div>
              <div className="w-9 h-9 rounded-full bg-stone-950 text-white flex items-center justify-center font-serif text-xs font-semibold shadow-sm">
                {(user?.first_name?.[0] || 'S').toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 scroll-smooth">
          <div className="max-w-[1600px] mx-auto animate-in fade-in duration-300">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
