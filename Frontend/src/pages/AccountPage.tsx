import { useState, useEffect } from 'react';
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  Edit2,
  Mail,
  Phone,
  Globe,
  Shield,
  ChevronRight,
  X,
  Save,
  Lock,
  Sparkles,
  Truck,
  ExternalLink,
  Trash2,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';
import { useWishlist } from '../contexts/WishlistContext';
import { useCartContext } from '../contexts/CartContext';
import { authService } from '../services/authService';
import { eventBus } from '../utils/eventBus';
import { formatPrice } from '../utils';
import { getImageUrl } from '../utils/imageUtils';
import { useNavigate, Link } from 'react-router-dom';

interface AccountPageProps {
  onClose: () => void;
}

export default function AccountPage({ onClose }: AccountPageProps) {
  const { user, setUser, logout } = useAuth();
  const { orders } = useOrders();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCartContext();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'wishlist' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    postal_code: user?.postal_code || '',
    country: user?.country || 'Côte d\'Ivoire'
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
        country: user.country || 'Côte d\'Ivoire'
      });
    }
  }, [user]);

  const tabs = [
    { id: 'profile' as const, label: 'Mon Profil', icon: User, count: null },
    { id: 'orders' as const, label: 'Commandes', icon: Package, count: orders?.length || 0 },
    { id: 'addresses' as const, label: 'Adresses', icon: MapPin, count: null },
    { id: 'wishlist' as const, label: 'Coups de Cœur', icon: Heart, count: wishlist?.length || 0 },
    { id: 'settings' as const, label: 'Sécurité & Accès', icon: Shield, count: null }
  ];

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const updatedUser = await authService.updateProfile(formData);
      setUser(updatedUser);
      setIsEditing(false);
      eventBus.emit('show-toast', { message: 'Profil mis à jour avec succès.', type: 'success' });
    } catch (error) {
      console.error('Update profile error:', error);
      eventBus.emit('show-toast', { message: 'Erreur lors de la mise à jour.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return { label: 'Livrée', classes: 'bg-emerald-50 text-emerald-800 border-emerald-200/80' };
      case 'shipped':
        return { label: 'Expédiée', classes: 'bg-stone-100 text-stone-900 border-stone-300' };
      case 'processing':
        return { label: 'En confection', classes: 'bg-amber-50 text-amber-800 border-amber-200/80' };
      case 'confirmed':
        return { label: 'Confirmée', classes: 'bg-stone-900 text-white border-stone-900' };
      case 'cancelled':
        return { label: 'Annulée', classes: 'bg-red-50 text-red-700 border-red-200/80' };
      default:
        return { label: 'En attente', classes: 'bg-stone-100 text-stone-600 border-stone-200' };
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-[#FAF9F6] text-stone-900 selection:bg-stone-900 selection:text-white overflow-hidden animate-in fade-in duration-200">
      {/* ── Top Header Bar ── */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-stone-200/80 px-6 sm:px-10 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-stone-950 text-white flex items-center justify-center font-serif text-lg font-bold shadow-card-luxury">
            {user?.first_name?.charAt(0) || 'S'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-lg sm:text-xl font-medium tracking-tight text-stone-950">
                Salon Privilège
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-stone-100 text-stone-700 border border-stone-200">
                <Sparkles className="w-2.5 h-2.5 text-terracotta-500" />
                Membre Atelier
              </span>
            </div>
            <p className="text-xs text-stone-500 truncate max-w-xs">
              {user?.first_name} {user?.last_name} • {user?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-950 transition-colors"
            aria-label="Fermer l'espace client"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ── Main Content Container ── */}
      <div className="flex-1 overflow-y-auto max-w-7xl w-full mx-auto p-4 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ── Sidebar Navigation ── */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Identity Card */}
            <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50/50 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-stone-950 text-white flex items-center justify-center font-serif text-2xl font-bold shadow-card-luxury">
                  {user?.first_name?.charAt(0) || 'U'}
                </div>
                <div className="min-w-0">
                  <h2 className="font-serif text-lg font-medium text-stone-900 truncate">
                    {user?.first_name} {user?.last_name}
                  </h2>
                  <p className="text-xs text-stone-500 truncate mt-0.5">{user?.email}</p>
                  <span className="inline-block mt-2 text-[10px] font-semibold tracking-widest uppercase text-terracotta-600 bg-terracotta-50 px-2.5 py-0.5 rounded-full border border-terracotta-100">
                    Compte Vérifié
                  </span>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-stone-100">
                <button
                  onClick={() => setActiveTab('orders')}
                  className="p-3 bg-stone-50 hover:bg-stone-100 rounded-2xl text-left transition-colors"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">Commandes</p>
                  <p className="font-serif text-xl font-medium text-stone-900 mt-0.5">{orders?.length || 0}</p>
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className="p-3 bg-stone-50 hover:bg-stone-100 rounded-2xl text-left transition-colors"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">Coups de cœur</p>
                  <p className="font-serif text-xl font-medium text-stone-900 mt-0.5">{wishlist?.length || 0}</p>
                </button>
              </div>
            </div>

            {/* Navigation Pills */}
            <nav className="bg-white border border-stone-200/80 rounded-3xl p-2 shadow-sm space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-semibold tracking-wide transition-all duration-200 ${
                      isActive
                        ? 'bg-stone-950 text-white shadow-card-luxury'
                        : 'text-stone-600 hover:text-stone-950 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                      <span>{tab.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {tab.count !== null && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'text-white translate-x-0.5' : 'text-stone-300'}`} />
                    </div>
                  </button>
                );
              })}

              <div className="pt-2 border-t border-stone-100 mt-2">
                <button
                  onClick={() => { logout(); onClose(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Se déconnecter</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* ── Main Tab Panel ── */}
          <main className="lg:col-span-8">
            <div className="bg-white border border-stone-200/80 rounded-3xl shadow-sm p-6 sm:p-8 min-h-[560px]">
              {/* Tab Title Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-stone-100">
                <div>
                  <h3 className="font-serif text-2xl font-medium tracking-tight text-stone-950">
                    {tabs.find(t => t.id === activeTab)?.label}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Gérez vos informations de commande, vos adresses et vos préférences.
                  </p>
                </div>

                {activeTab === 'profile' && (
                  <button
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    disabled={loading}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 shadow-sm ${
                      isEditing
                        ? 'bg-stone-950 text-white hover:bg-stone-800'
                        : 'bg-stone-100 text-stone-800 hover:bg-stone-200 border border-stone-200'
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Enregistrement...</span>
                      </>
                    ) : isEditing ? (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Enregistrer</span>
                      </>
                    ) : (
                      <>
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Modifier</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* ── Tab: Profile ── */}
              {activeTab === 'profile' && (
                <div className="space-y-6 max-w-2xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold tracking-wide uppercase text-stone-600 mb-1.5">
                        Prénom
                      </label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FAF9F6] border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 outline-none focus:border-stone-950 focus:ring-2 focus:ring-stone-950/5 disabled:opacity-75 disabled:bg-stone-50 transition-all shadow-sm"
                        placeholder="Jean"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold tracking-wide uppercase text-stone-600 mb-1.5">
                        Nom
                      </label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FAF9F6] border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 outline-none focus:border-stone-950 focus:ring-2 focus:ring-stone-950/5 disabled:opacity-75 disabled:bg-stone-50 transition-all shadow-sm"
                        placeholder="Dupont"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold tracking-wide uppercase text-stone-600 mb-1.5">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        disabled={!isEditing}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FAF9F6] border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 outline-none focus:border-stone-950 focus:ring-2 focus:ring-stone-950/5 disabled:opacity-75 disabled:bg-stone-50 transition-all shadow-sm"
                        placeholder="+225 07 00 00 00 00"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold tracking-wide uppercase text-stone-600 mb-1.5">
                        Pays
                      </label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FAF9F6] border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 outline-none focus:border-stone-950 focus:ring-2 focus:ring-stone-950/5 disabled:opacity-75 disabled:bg-stone-50 transition-all shadow-sm"
                        placeholder="Côte d'Ivoire"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold tracking-wide uppercase text-stone-600">
                        Adresse email
                      </label>
                      <span className="text-[10px] text-stone-400">Identifiant immuable</span>
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type="email"
                        disabled
                        value={user?.email || ''}
                        className="w-full pl-11 pr-10 py-3 bg-stone-100/70 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-500 cursor-not-allowed"
                      />
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Tab: Orders ── */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-16 px-4 bg-[#FAF9F6] rounded-3xl border border-dashed border-stone-200">
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-4 text-stone-400 shadow-sm border border-stone-200/80">
                        <Package className="w-8 h-8" />
                      </div>
                      <h4 className="font-serif text-xl font-medium text-stone-900 mb-2">Aucune commande pour le moment</h4>
                      <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
                        Explorez notre collection et passez votre première commande pour suivre son acheminement en direct.
                      </p>
                      <button
                        onClick={() => { onClose(); navigate('/boutique'); }}
                        className="px-6 py-3 rounded-full bg-stone-950 text-white font-semibold text-xs tracking-wider uppercase hover:bg-stone-800 transition-all shadow-card-luxury"
                      >
                        Découvrir la boutique
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => {
                        const badge = getStatusBadge(order.status);
                        return (
                          <div
                            key={order.id}
                            className="p-5 rounded-2xl border border-stone-200/80 bg-[#FAF9F6] hover:bg-white hover:border-stone-300 transition-all duration-200 shadow-sm space-y-4"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-700 shadow-sm">
                                  <Package className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="font-serif text-base font-medium text-stone-950">
                                    Commande #{order.order_number || order.id}
                                  </p>
                                  <p className="text-[11px] text-stone-400">
                                    Passée le {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric'
                                    })}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${badge.classes}`}>
                                  {badge.label}
                                </span>
                                <span className="font-serif text-base font-semibold text-stone-950">
                                  {formatPrice(order.total)}
                                </span>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-stone-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                              <p className="text-stone-500">
                                {(order.order_items || []).length} article{(order.order_items || []).length > 1 ? 's' : ''} commandé{(order.order_items || []).length > 1 ? 's' : ''}
                              </p>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => { onClose(); navigate(`/order-tracking/${order.id}`); }}
                                  className="inline-flex items-center gap-1.5 text-stone-600 hover:text-stone-950 font-semibold"
                                >
                                  <Truck className="w-3.5 h-3.5" />
                                  <span>Suivre l'envoi</span>
                                </button>
                                <button
                                  onClick={() => { onClose(); navigate(`/order-details/${order.id}`); }}
                                  className="inline-flex items-center gap-1 text-terracotta-600 hover:text-terracotta-700 font-semibold"
                                >
                                  <span>Détails</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ── Tab: Addresses ── */}
              {activeTab === 'addresses' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 rounded-3xl bg-[#FAF9F6] border border-stone-200 relative overflow-hidden">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-500 bg-white px-2.5 py-1 rounded-full border border-stone-200">
                          Adresse par défaut
                        </span>
                        <MapPin className="w-4 h-4 text-terracotta-500" />
                      </div>
                      <h4 className="font-serif text-base font-medium text-stone-900 mb-2">
                        {formData.first_name} {formData.last_name}
                      </h4>
                      <p className="text-xs text-stone-600 leading-relaxed min-h-[3rem]">
                        {formData.address ? (
                          <>
                            {formData.address}<br />
                            {formData.postal_code} {formData.city}<br />
                            {formData.country}
                          </>
                        ) : (
                          <span className="italic text-stone-400">Aucune adresse principale enregistrée.</span>
                        )}
                      </p>
                      <div className="mt-4 pt-4 border-t border-stone-200/60">
                        <button
                          onClick={() => { setActiveTab('profile'); setIsEditing(true); }}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-900 hover:text-terracotta-600 transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Mettre à jour l'adresse</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Tab: Wishlist ── */}
              {activeTab === 'wishlist' && (
                <div>
                  {wishlist.length === 0 ? (
                    <div className="text-center py-16 px-4 bg-[#FAF9F6] rounded-3xl border border-dashed border-stone-200">
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-4 text-stone-400 shadow-sm border border-stone-200/80">
                        <Heart className="w-8 h-8" />
                      </div>
                      <h4 className="font-serif text-xl font-medium text-stone-900 mb-2">Votre carnet de coups de cœur est vide</h4>
                      <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
                        Enregistrez vos créations favorites en cliquant sur le cœur afin de les retrouver en un clic.
                      </p>
                      <button
                        onClick={() => { onClose(); navigate('/boutique'); }}
                        className="px-6 py-3 rounded-full bg-stone-950 text-white font-semibold text-xs tracking-wider uppercase hover:bg-stone-800 transition-all shadow-card-luxury"
                      >
                        Explorer les collections
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {wishlist.map((product) => (
                          <div
                            key={product.id}
                            className="group p-3 rounded-2xl bg-[#FAF9F6] border border-stone-200 hover:border-stone-300 transition-all duration-200 flex flex-col justify-between"
                          >
                            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-stone-100 mb-3">
                              <img
                                src={getImageUrl(product.images?.[0])}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <button
                                onClick={() => removeFromWishlist(product.id)}
                                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-stone-500 hover:text-red-500 transition-colors shadow-sm"
                                aria-label="Retirer des favoris"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div>
                              <p className="font-serif text-sm font-medium text-stone-900 line-clamp-1 mb-1">
                                {product.name}
                              </p>
                              <p className="text-xs font-semibold text-stone-950 mb-3">
                                {formatPrice(product.price)}
                              </p>
                              <button
                                onClick={() => {
                                  addToCart({
                                    product_id: product.id,
                                    product: product,
                                    quantity: 1,
                                    size: product.sizes?.[0] || '',
                                    color: product.colors?.[0] || ''
                                  });
                                  eventBus.emit('show-toast', { message: 'Produit ajouté au panier !', type: 'success' });
                                }}
                                className="w-full py-2 px-3 rounded-xl bg-stone-950 text-white text-[11px] font-semibold tracking-wider uppercase hover:bg-stone-800 transition-colors flex items-center justify-center gap-1.5"
                              >
                                <ShoppingBag className="w-3 h-3" />
                                <span>Ajouter au panier</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="text-center pt-4 border-t border-stone-100">
                        <button
                          onClick={() => { onClose(); navigate('/wishlist'); }}
                          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-900 hover:text-terracotta-600 underline underline-offset-4"
                        >
                          <span>Voir la page complète des favoris</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Tab: Settings ── */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-2xl">
                  <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-stone-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-serif text-sm font-medium text-stone-900">Mot de passe & Clé d'accès</h4>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Changez régulièrement votre mot de passe pour garantir la confidentialité de vos informations.
                        </p>
                      </div>
                      <Link
                        to="/forgot-password"
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-900 hover:bg-stone-50 transition-colors shadow-sm"
                      >
                        Modifier
                      </Link>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-stone-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-sm font-medium text-stone-900">Notifications de suivi</h4>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Recevoir les alertes d'expédition et confirmations par email.
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                      Activé
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl border border-red-200 bg-red-50/30 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-red-900">Zone de confidentialité</h4>
                      <p className="text-xs text-red-600/70 mt-0.5">
                        Pour toute demande de suppression de données conforme au RGPD, contactez notre conciergerie.
                      </p>
                    </div>
                    <Link
                      to="/contact"
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl bg-white border border-red-200 text-xs font-semibold text-red-700 hover:bg-red-50 transition-colors shadow-sm"
                    >
                      Contacter l'Atelier
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
