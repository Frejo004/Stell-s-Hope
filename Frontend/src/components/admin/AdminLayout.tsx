import React, { useState } from 'react';
import { BarChart3, Package, ShoppingCart, Users, Settings, LogOut, Menu, X, Search, Bell, MessageSquare, Tag, Star, FileText, HelpCircle, Archive, Percent, Truck, CreditCard } from 'lucide-react';
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

export default function AdminLayout() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Produits', icon: Package },
    { id: 'orders', label: 'Commandes', icon: ShoppingCart },
    { id: 'customers', label: 'Clients', icon: Users },
    { id: 'categories', label: 'Catégories', icon: Tag },
    { id: 'inventory', label: 'Stocks', icon: Archive },
    { id: 'reviews', label: 'Avis', icon: Star },
    { id: 'support', label: 'Support', icon: HelpCircle },
    { id: 'content', label: 'Contenu', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'promotions', label: 'Promotions', icon: Percent },
    { id: 'shipping', label: 'Expéditions', icon: Truck },
    { id: 'payments', label: 'Paiements', icon: CreditCard },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboard onNavigate={setCurrentPage} />;
      case 'products':
        return <AdminProducts onNavigate={setCurrentPage} />;
      case 'orders':
        return <AdminOrders onNavigate={setCurrentPage} />;
      case 'customers':
        return <AdminCustomers onNavigate={setCurrentPage} />;
      case 'categories':
        return <AdminCategories onNavigate={setCurrentPage} />;
      case 'reviews':
        return <AdminReviews onNavigate={setCurrentPage} />;
      case 'inventory':
        return <AdminInventory onNavigate={setCurrentPage} />;
      case 'support':
        return <AdminSupport onNavigate={setCurrentPage} />;
      case 'content':
        return <AdminContent onNavigate={setCurrentPage} />;
      case 'analytics':
        return <AdminAnalytics onNavigate={setCurrentPage} />;
      case 'promotions':
        return <AdminPromotions onNavigate={setCurrentPage} />;
      case 'shipping':
        return <AdminShipping onNavigate={setCurrentPage} />;
      case 'payments':
        return <AdminPayments onNavigate={setCurrentPage} />;
      case 'settings':
        return <AdminSettings onNavigate={setCurrentPage} />;
      default:
        return <AdminDashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 ${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className={`text-xl font-bold text-gray-900 transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>
            Admin Panel
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                currentPage === item.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className={`transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t">
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className={`transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>
              Retour au site
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:block p-2 text-gray-400 hover:text-gray-600"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-semibold text-gray-900">Stell's Hope</span>
            </div>
          </div>
          
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
              <div className="absolute left-3 top-2.5">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Settings className="w-5 h-5" />
            </button>
            <div className="relative">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
              </button>
            </div>
            <div className="relative">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <MessageSquare className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">2</span>
              </button>
            </div>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <Menu className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">A</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}