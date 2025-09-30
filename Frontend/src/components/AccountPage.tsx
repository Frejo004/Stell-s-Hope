import React, { useState } from 'react';
import { User, Package, MapPin, Heart, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';

interface AccountPageProps {
  onClose: () => void;
}

export default function AccountPage({ onClose }: AccountPageProps) {
  const { user, logout } = useAuth();
  const { orders } = useOrders();
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
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6">
        <button onClick={onClose} className="mb-6 text-gray-600 hover:text-black">
          ← Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="font-semibold">{user?.firstName} {user?.lastName}</h3>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id 
                        ? 'bg-black text-white' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
              
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left hover:bg-red-50 text-red-600"
              >
                <LogOut className="w-5 h-5" />
                <span>Déconnexion</span>
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Mon Profil</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Prénom</label>
                    <input
                      type="text"
                      value={user?.firstName || ''}
                      className="w-full border rounded px-3 py-2"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom</label>
                    <input
                      type="text"
                      value={user?.lastName || ''}
                      className="w-full border rounded px-3 py-2"
                      readOnly
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      className="w-full border rounded px-3 py-2"
                      readOnly
                    />
                  </div>
                </div>
                <button className="mt-6 bg-black text-white px-6 py-2 rounded hover:bg-gray-900">
                  Modifier
                </button>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Mes Commandes</h2>
                <div className="space-y-4">
                  {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Aucune commande pour le moment</p>
                    <button 
                      onClick={onClose}
                      className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900"
                    >
                      Découvrir nos produits
                    </button>
                  </div>
                ) : (
                  orders.map(order => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">Commande #{order.id}</h3>
                        <span className={`px-2 py-1 rounded text-sm ${
                          order.status === 'delivered' 
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'confirmed'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Date: {new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
                        <p>{order.items.length} article{order.items.length > 1 ? 's' : ''} • {order.total.toFixed(2)}€</p>
                      </div>
                      <button className="mt-3 text-rose-300 hover:underline text-sm">
                        Voir les détails
                      </button>
                    </div>
                  ))
                )}
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Mes Adresses</h2>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Aucune adresse enregistrée</p>
                  <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900">
                    Ajouter une adresse
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Mes Favoris</h2>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Aucun favori pour le moment</p>
                  <button 
                    onClick={onClose}
                    className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900"
                  >
                    Découvrir nos produits
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Paramètres</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Notifications</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" defaultChecked />
                        <span>Recevoir les newsletters</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" defaultChecked />
                        <span>Notifications de commande</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" />
                        <span>Offres promotionnelles</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Confidentialité</h3>
                    <button className="text-red-600 hover:underline">
                      Supprimer mon compte
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}