import { useState } from 'react';
import { User, Package, MapPin, Heart, Settings, LogOut, Edit2, Mail, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';
import { useWishlist } from '../hooks/useWishlist';

interface AccountPageProps {
  onClose: () => void;
}

export default function AccountPage({ onClose }: AccountPageProps) {
  const { user, logout } = useAuth();
  const { orders } = useOrders();
  const { wishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'orders', label: 'Commandes', icon: Package },
    { id: 'addresses', label: 'Adresses', icon: MapPin },
    { id: 'wishlist', label: 'Favoris', icon: Heart },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar avec design moderne */}
          <div className="lg:col-span-1">
            {/* Carte profil avec gradient et glassmorphisme */}
            <div className="relative bg-gradient-to-br from-rose-400 via-pink-400 to-rose-500 p-6 rounded-2xl mb-6 shadow-xl overflow-hidden">
              {/* Effet de brillance */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>

              <div className="relative text-center">
                {/* Avatar avec bordure animée */}
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
                  <div className="relative w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full mx-auto flex items-center justify-center shadow-lg">
                    <User className="w-10 h-10 text-rose-500" />
                  </div>
                </div>

                <h3 className="font-bold text-white text-lg mb-1">
                  {user?.first_name} {user?.last_name}
                </h3>
                <p className="text-white/90 text-sm flex items-center justify-center gap-1">
                  <Mail className="w-3 h-3" />
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Navigation avec animations */}
            <nav className="space-y-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${activeTab === tab.id
                        ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-200 scale-105'
                        : 'bg-white/60 backdrop-blur-sm hover:bg-white hover:shadow-md text-gray-700 hover:scale-102'
                      }`}
                  >
                    <Icon className={`w-5 h-5 transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'
                      }`} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}

              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left bg-white/60 backdrop-blur-sm hover:bg-red-50 text-red-600 transition-all duration-300 hover:shadow-md hover:scale-102"
              >
                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Déconnexion</span>
              </button>
            </nav>
          </div>

          {/* Contenu principal avec design moderne */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8">
              {activeTab === 'profile' && (
                <div className="animate-fadeIn">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                      Mon Profil
                    </h2>
                    <button className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300">
                      <Edit2 className="w-4 h-4" />
                      <span>Modifier</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Prénom</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={user?.first_name || ''}
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all duration-300 bg-white"
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nom</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={user?.last_name || ''}
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all duration-300 bg-white"
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2 group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <div className="relative">
                        <input
                          type="email"
                          value={user?.email || ''}
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all duration-300 bg-white"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="animate-fadeIn">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent mb-8">
                    Mes Commandes
                  </h2>

                  <div className="space-y-4">
                    {orders.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="relative inline-block mb-6">
                          <div className="absolute inset-0 bg-rose-100 rounded-full blur-xl opacity-50"></div>
                          <div className="relative bg-gradient-to-br from-rose-100 to-pink-100 p-6 rounded-full">
                            <Package className="w-16 h-16 text-rose-400" />
                          </div>
                        </div>
                        <p className="text-gray-600 text-lg mb-6">Aucune commande pour le moment</p>
                        <button
                          onClick={onClose}
                          className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium"
                        >
                          Découvrir nos produits
                        </button>
                      </div>
                    ) : (
                      orders.map(order => (
                        <div key={order.id} className="group bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 rounded-xl p-6 hover:shadow-lg hover:border-rose-200 transition-all duration-300">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg text-gray-800">Commande #{order.id}</h3>
                            <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${order.status === 'delivered'
                                ? 'bg-green-100 text-green-700'
                                : order.status === 'shipped'
                                  ? 'bg-blue-100 text-blue-700'
                                  : order.status === 'confirmed'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-gray-100 text-gray-700'
                              }`}>
                              {getStatusLabel(order.status)}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Package className="w-4 h-4" />
                              <span>{(order.items || order.order_items || []).length} article{(order.items || order.order_items || []).length > 1 ? 's' : ''}</span>
                            </div>
                            <div className="font-semibold text-rose-600">
                              {order.total.toFixed(2)}€
                            </div>
                          </div>

                          <button
                            onClick={() => window.location.href = `/order-details/${order.id}`}
                            className="text-rose-500 hover:text-rose-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all"
                          >
                            Voir les détails
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="animate-fadeIn">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent mb-8">
                    Mes Adresses
                  </h2>

                  <div className="border-2 border-dashed border-rose-200 rounded-2xl p-12 text-center bg-gradient-to-br from-rose-50/50 to-pink-50/50">
                    <div className="relative inline-block mb-6">
                      <div className="absolute inset-0 bg-rose-100 rounded-full blur-xl opacity-50"></div>
                      <div className="relative bg-gradient-to-br from-rose-100 to-pink-100 p-6 rounded-full">
                        <MapPin className="w-16 h-16 text-rose-400" />
                      </div>
                    </div>
                    <p className="text-gray-600 text-lg mb-6">Aucune adresse enregistrée</p>
                    <button className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium">
                      Ajouter une adresse
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div className="animate-fadeIn">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent mb-8">
                    Mes Favoris
                  </h2>

                  {wishlist.length === 0 ? (
                    <div className="border-2 border-dashed border-rose-200 rounded-2xl p-12 text-center bg-gradient-to-br from-rose-50/50 to-pink-50/50">
                      <div className="relative inline-block mb-6">
                        <div className="absolute inset-0 bg-rose-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
                        <div className="relative bg-gradient-to-br from-rose-100 to-pink-100 p-6 rounded-full">
                          <Heart className="w-16 h-16 text-rose-400" />
                        </div>
                      </div>
                      <p className="text-gray-600 text-lg mb-6">Aucun favori pour le moment</p>
                      <button
                        onClick={onClose}
                        className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium"
                      >
                        Découvrir nos produits
                      </button>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6">
                      <p className="text-gray-700 text-lg mb-6 font-medium">
                        {wishlist.length} produit{wishlist.length > 1 ? 's' : ''} en favoris
                      </p>
                      <button
                        onClick={() => window.location.href = '/wishlist'}
                        className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium"
                      >
                        Voir tous mes favoris
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="animate-fadeIn">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent mb-8">
                    Paramètres
                  </h2>

                  <div className="space-y-8">
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border-2 border-gray-100">
                      <h3 className="font-bold text-lg text-gray-800 mb-4">Notifications</h3>
                      <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input type="checkbox" className="w-5 h-5 text-rose-500 rounded focus:ring-rose-400 cursor-pointer" defaultChecked />
                          <span className="text-gray-700 group-hover:text-gray-900 transition-colors">Recevoir les newsletters</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input type="checkbox" className="w-5 h-5 text-rose-500 rounded focus:ring-rose-400 cursor-pointer" defaultChecked />
                          <span className="text-gray-700 group-hover:text-gray-900 transition-colors">Notifications de commande</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input type="checkbox" className="w-5 h-5 text-rose-500 rounded focus:ring-rose-400 cursor-pointer" />
                          <span className="text-gray-700 group-hover:text-gray-900 transition-colors">Offres promotionnelles</span>
                        </label>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border-2 border-red-100">
                      <h3 className="font-bold text-lg text-gray-800 mb-4">Confidentialité</h3>
                      <button className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2 hover:gap-3 transition-all">
                        <span>Supprimer mon compte</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}