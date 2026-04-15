import { useState, useEffect } from 'react';
import { User, Package, MapPin, Heart, LogOut, Edit2, Mail, Phone, Globe, Shield, ChevronRight, X, Save, Lock, Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';
import { useWishlist } from '../contexts/WishlistContext';
import { authService } from '../services/authService';
import { eventBus } from '../utils/eventBus';

interface AccountPageProps {
  onClose: () => void;
}

export default function AccountPage({ onClose }: AccountPageProps) {
  const { user, setUser, logout } = useAuth();
  const { orders } = useOrders();
  const { wishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    postal_code: user?.postal_code || '',
    country: user?.country || 'France'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postal_code: user.postal_code || '',
        country: user.country || 'France'
      });
    }
  }, [user]);

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'orders', label: 'Commandes', icon: Package, color: 'text-rose-500', bg: 'bg-rose-50' },
    { id: 'addresses', label: 'Adresses', icon: MapPin, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'wishlist', label: 'Favoris', icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'settings', label: 'Sécurité', icon: Shield, color: 'text-indigo-500', bg: 'bg-indigo-50' }
  ];

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const updatedUser = await authService.updateProfile(formData);
      setUser(updatedUser);
      setIsEditing(false);
      eventBus.emit('show-toast', { message: 'Profil mis à jour avec succès !', type: 'success' });
    } catch (error) {
      console.error('Update profile error:', error);
      eventBus.emit('show-toast', { message: 'Erreur lors de la mise à jour.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
      shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      delivered: 'bg-green-100 text-green-700 border-green-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

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
    <div className="fixed inset-0 z-[60] flex flex-col bg-gray-50/95 backdrop-blur-md overflow-hidden animate-fadeIn">
      {/* Header moderne avec flou et bouton fermer */}
      <header className="sticky top-0 z-10 bg-white/70 backdrop-blur-lg border-b border-gray-200 px-4 md:px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform -rotate-3">
            <User className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">Mon Espace</h1>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Tableau de bord client</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 hover:rotate-90 text-gray-400 hover:text-gray-900"
        >
          <X className="w-6 h-6" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Left */}
          <aside className="w-full lg:w-80 flex flex-col gap-6">
            {/* User Card */}
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-rose-100/20 border border-white">
              <div className="flex flex-col items-center text-center">
                <div className="relative group mb-4">
                  <div className="absolute -inset-1 bg-gradient-to-tr from-rose-500 to-pink-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                  <div className="relative w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center border-4 border-white shadow-inner overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-rose-300" />
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-lg border border-gray-100 text-rose-500 hover:scale-110 transition-transform">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-1">{user?.first_name} {user?.last_name}</h2>
                <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-6 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{user?.email}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full">
                  <div className="bg-rose-50/50 p-3 rounded-2xl border border-rose-100/50">
                    <p className="text-[10px] text-rose-400 uppercase font-bold tracking-wider mb-0.5">Commandes</p>
                    <p className="text-lg font-bold text-rose-700">{orders?.length || 0}</p>
                  </div>
                  <div className="bg-blue-50/50 p-3 rounded-2xl border border-blue-100/50">
                    <p className="text-[10px] text-blue-400 uppercase font-bold tracking-wider mb-0.5">Favoris</p>
                    <p className="text-lg font-bold text-blue-700">{wishlist?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="bg-white/50 backdrop-blur-sm rounded-3xl p-3 shadow-lg border border-white/50 space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 group ${activeTab === tab.id
                    ? 'bg-black text-white shadow-xl shadow-black/10'
                    : 'text-gray-600 hover:bg-white hover:text-rose-500'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl group-hover:bg-rose-100 transition-colors ${activeTab === tab.id ? 'bg-white/10' : tab.bg}`}>
                      <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : tab.color}`} />
                    </div>
                    <span className="font-semibold">{tab.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'opacity-100' : 'opacity-0'}`} />
                </button>
              ))}

              <div className="h-px bg-gray-200/50 mx-4 my-2" />

              <button
                onClick={() => { logout(); onClose(); }}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl text-gray-600 hover:bg-red-50 hover:text-red-500 transition-all group"
              >
                <div className="p-2 bg-red-50 rounded-xl group-hover:bg-red-100">
                  <LogOut className="w-4 h-4 text-red-500" />
                </div>
                <span className="font-semibold">Déconnexion</span>
              </button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-[2rem] shadow-2xl shadow-rose-100/20 border border-white overflow-hidden flex flex-col min-h-[600px] animate-slideIn">

              {/* Tab Header */}
              <div className="bg-gray-50 border-b border-gray-100 px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">
                    {tabs.find(t => t.id === activeTab)?.label}
                  </h2>
                  <p className="text-gray-500 text-sm font-medium">Gérez vos informations et activités</p>
                </div>

                {activeTab === 'profile' && (
                  <button
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    disabled={loading}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 shadow-lg ${isEditing
                      ? 'bg-black text-white hover:bg-gray-900 shadow-black/20'
                      : 'bg-white text-rose-500 hover:text-rose-600 shadow-rose-100 border border-rose-100'
                      }`}
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : isEditing ? (
                      <Save className="w-4 h-4" />
                    ) : (
                      <Edit2 className="w-4 h-4" />
                    )}
                    <span>{isEditing ? 'Enregistrer' : 'Modifier le profil'}</span>
                  </button>
                )}
              </div>

              {/* Tab Content */}
              <div className="flex-1 p-8">
                {activeTab === 'profile' && (
                  <div className="max-w-3xl space-y-8 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Prénom</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-3.5 w-4 h-4 text-gray-300 group-focus-within:text-rose-400 transition-colors" />
                          <input
                            type="text"
                            disabled={!isEditing}
                            value={formData.first_name}
                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                            className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-11 pr-4 py-3 text-gray-900 font-medium focus:bg-white focus:ring-4 focus:ring-rose-50 focus:border-rose-200 transition-all outline-none disabled:opacity-70"
                            placeholder="John"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Nom</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-3.5 w-4 h-4 text-gray-300 group-focus-within:text-rose-400 transition-colors" />
                          <input
                            type="text"
                            disabled={!isEditing}
                            value={formData.last_name}
                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                            className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-11 pr-4 py-3 text-gray-900 font-medium focus:bg-white focus:ring-4 focus:ring-rose-50 focus:border-rose-200 transition-all outline-none disabled:opacity-70"
                            placeholder="Doe"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Téléphone</label>
                        <div className="relative group">
                          <Phone className="absolute left-4 top-3.5 w-4 h-4 text-gray-300 group-focus-within:text-rose-400 transition-colors" />
                          <input
                            type="tel"
                            disabled={!isEditing}
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-11 pr-4 py-3 text-gray-900 font-medium focus:bg-white focus:ring-4 focus:ring-rose-50 focus:border-rose-200 transition-all outline-none disabled:opacity-70"
                            placeholder="+33 6 00 00 00 00"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Pays</label>
                        <div className="relative group">
                          <Globe className="absolute left-4 top-3.5 w-4 h-4 text-gray-300 group-focus-within:text-rose-400 transition-colors" />
                          <input
                            type="text"
                            disabled={!isEditing}
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-11 pr-4 py-3 text-gray-900 font-medium focus:bg-white focus:ring-4 focus:ring-rose-50 focus:border-rose-200 transition-all outline-none disabled:opacity-70"
                            placeholder="France"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2 space-y-1.5 pt-4">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Email (Non modifiable)</label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-300" />
                          <input
                            type="email"
                            disabled
                            value={user?.email || ''}
                            className="w-full bg-gray-100/50 border border-gray-200 rounded-2xl pl-11 pr-4 py-3 text-gray-500 font-medium cursor-not-allowed"
                          />
                          <div className="absolute right-4 top-3.5">
                            <Lock className="w-4 h-4 text-gray-300" />
                          </div>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 italic pl-1">Pour changer votre email, contactez le support.</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div className="space-y-6 animate-slideUp">
                    {orders.length === 0 ? (
                      <div className="text-center py-20 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-100">
                        <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6">
                          <Package className="w-10 h-10 text-gray-200" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune commande</h3>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Vous n'avez pas encore passé de commande chez Stell's Hope.</p>
                        <button onClick={onClose} className="px-8 py-3 bg-black text-white rounded-full font-bold hover:shadow-2xl transition-all active:scale-95">
                          Parcourir la boutique
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {orders.map(order => (
                          <div key={order.id} className="group bg-white border border-gray-100 rounded-[1.5rem] p-5 hover:shadow-xl hover:shadow-rose-100/30 hover:border-rose-100 transition-all duration-300">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:bg-rose-50 group-hover:border-rose-100 transition-colors">
                                  <Package className="w-6 h-6 text-gray-300 group-hover:text-rose-400" />
                                </div>
                                <div>
                                  <p className="text-sm font-black text-gray-900">#ORD-{order.id}</p>
                                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-6">
                                <div className="text-right">
                                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Total</p>
                                  <p className="text-lg font-black text-gray-900">{Number(order.total).toFixed(2)}€</p>
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider border ${getStatusStyle(order.status)} animate-pulse-subtle`}>
                                  {getStatusLabel(order.status)}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                              <p className="text-xs text-gray-500 font-medium">
                                {(order.order_items || order.orderItems || []).length} article{(order.order_items || order.orderItems || []).length > 1 ? 's' : ''} • Paiement par carte
                              </p>
                              <button
                                onClick={() => window.location.href = `/order-details/${order.id}`}
                                className="flex items-center gap-2 text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors"
                              >
                                <span>Détails</span>
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'addresses' && (
                  <div className="animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white border-2 border-gray-100 rounded-3xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700 opacity-50"></div>
                        <div className="relative">
                          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mb-4">
                            <MapPin className="w-5 h-5 text-amber-500" />
                          </div>
                          <h4 className="font-bold text-gray-900 mb-2">Adresse Principale</h4>
                          <p className="text-sm text-gray-500 leading-relaxed mb-6">
                            {formData.address || 'Aucune adresse renseignée'}<br />
                            {formData.postal_code} {formData.city}<br />
                            {formData.country}
                          </p>
                          <button
                            onClick={() => { setActiveTab('profile'); setIsEditing(true); }}
                            className="text-xs font-bold text-amber-600 hover:text-amber-700 uppercase tracking-widest flex items-center gap-1.5"
                          >
                            <Edit2 className="w-3 h-3" />
                            Modifier
                          </button>
                        </div>
                      </div>

                      <button className="border-2 border-dashed border-gray-100 rounded-3xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-amber-200 hover:bg-amber-50/30 hover:text-amber-500 transition-all group">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3 group-hover:bg-amber-100 transition-colors">
                          <Plus className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-sm uppercase tracking-wider">Ajouter une adresse</span>
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'wishlist' && (
                  <div className="animate-fadeIn">
                    <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                        <div>
                          <h3 className="text-3xl font-black mb-3">Vos coups de cœur</h3>
                          <p className="text-white/80 font-medium max-w-sm">
                            Vous avez {wishlist.length} produit{wishlist.length > 1 ? 's' : ''} dans votre liste d'envies. Vos favoris vous attendent !
                          </p>
                        </div>
                        <button
                          onClick={() => window.location.href = '/wishlist'}
                          className="px-10 py-4 bg-white text-rose-500 rounded-full font-black shadow-2xl hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-wider"
                        >
                          Ma Wishlist
                        </button>
                      </div>
                      <Heart className="absolute bottom-4 left-8 w-24 h-24 text-white/5 -rotate-12" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="aspect-[3/4] bg-gray-50 rounded-2xl border border-gray-100 animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="max-w-2xl space-y-8 animate-fadeIn">
                    <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                          <Shield className="w-5 h-5 text-indigo-500" />
                        </div>
                        <h4 className="font-bold text-gray-900">Préférences de sécurité</h4>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-50 shadow-sm">
                          <div>
                            <p className="font-bold text-gray-900 text-sm">Modification du mot de passe</p>
                            <p className="text-xs text-gray-500">Dernière mise à jour il y a 3 mois</p>
                          </div>
                          <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xs hover:bg-indigo-100 transition-colors">
                            Modifier
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-50 shadow-sm">
                          <div>
                            <p className="font-bold text-gray-900 text-sm">Double authentification (2FA)</p>
                            <p className="text-xs text-indigo-500 font-bold uppercase tracking-wider mt-1">Désactivé</p>
                          </div>
                          <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                            <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-100 cursor-pointer border border-gray-200"></label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50/50 border border-red-50 rounded-3xl p-6">
                      <h4 className="font-bold text-red-900 mb-2">Zone de danger</h4>
                      <p className="text-xs text-red-700/70 mb-6 leading-relaxed">
                        Une fois que vous supprimez votre compte, vous ne pouvez plus revenir en arrière. Soyez certain de votre choix.
                      </p>
                      <button className="px-6 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl font-bold text-xs hover:bg-red-50 transition-colors shadow-sm">
                        Supprimer définitivement mon compte
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .animate-slideIn { animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slideUp { animation: slideUp 0.4s ease-out forwards; }
        
        .animate-pulse-subtle {
          animation: pulse-subtle 3s infinite;
        }
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .toggle-checkbox:checked {
          right: 0;
          border-color: #6366f1;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #6366f1;
        }
        .toggle-checkbox {
          right: 4px;
          top: 0px;
          transition: all 0.3s ease-in-out;
        }
        .toggle-label {
          width: 44px;
        }

        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}


