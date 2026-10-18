import { useState, useCallback, useMemo, useEffect, lazy, Suspense } from 'react';
import { Search, ShoppingBag, Menu, X, User, Heart, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCartContext } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './AuthModal';
import CartSidebarNew from './CartSidebarNew';

const SearchPage = lazy(() => import('../pages/SearchPage'));
const AccountPage = lazy(() => import('../pages/AccountPage'));
import Logo from './Logo';
import { Product } from '../types';
import { formatPrice } from '../utils';
import { BUSINESS_CONSTANTS } from '../constants';

interface HeaderProps {
  onCategoryChange: (category: string) => void;
  currentCategory: string;
  products?: Product[];
  onProductClick: (product: Product) => void;
}

const Header = ({ onCategoryChange, currentCategory, products, onProductClick }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const { cartItemsCount, setIsOpen } = useCartContext();
  const navigate = useNavigate();
  const { wishlist } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  // Close overlays on navigation
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setIsAccountOpen(false);
  }, [location.pathname]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setIsSearchOpen(true);
  }, []);

  const categories = useMemo(() => [
    { id: 'home', label: 'Accueil', href: '#' },
    { id: 'all', label: 'Boutique', href: '#' },
    { id: 'homme', label: 'Homme', href: '#' },
    { id: 'femme', label: 'Femme', href: '#' },
    { id: 'accessories', label: 'Accessoires', href: '#' },
    { id: 'sale', label: 'Promos', href: '#' }
  ], []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#FAF9F6]/90 backdrop-blur-xl border-b border-stone-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-all duration-300">
      {/* Top luxury announcement bar */}
      <div className="bg-stone-950 text-stone-200 py-2 px-4 border-b border-white/5">
        <p className="text-center text-[11px] tracking-widest uppercase font-medium flex items-center justify-center gap-2">
          <span>Livraison offerte dès {formatPrice(BUSINESS_CONSTANTS.FREE_SHIPPING_THRESHOLD)}</span>
          <span className="w-1 h-1 rounded-full bg-rose-300 inline-block opacity-75" />
          <span className="text-stone-400 hidden sm:inline">Paiement 100% sécurisé</span>
          <span className="w-1 h-1 rounded-full bg-rose-300 hidden sm:inline-block opacity-75" />
          <span>Retours 30 jours</span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2.5 -ml-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-full transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Ouvrir le menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => onCategoryChange('home')}>
            <Logo size="md" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {categories.map((category) => {
              const isActive = currentCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={`relative px-4 py-2 text-xs uppercase tracking-wider font-medium transition-all duration-200 rounded-full ${
                    isActive
                      ? 'text-stone-950 font-bold bg-white shadow-sm border border-stone-200/50'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100/60'
                  }`}
                >
                  {category.label}
                  {category.id === 'sale' && (
                    <span className="ml-1.5 px-1.5 py-0.2 bg-rose-100 text-rose-700 rounded-full text-[9px] font-bold">
                      %
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-3">
            {/* Search Bar - Desktop */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher une pièce..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                  className="w-56 lg:w-64 pl-9 pr-4 py-1.5 bg-white/80 hover:bg-white focus:bg-white text-xs border border-stone-200/70 rounded-full text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/20 focus:border-stone-400 transition-all shadow-sm"
                />
                <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-stone-400" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-stone-700 hover:text-stone-950 hover:bg-stone-100/80 transition-colors"
                aria-label="Recherche"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* User Account Dropdown */}
              {isAuthenticated ? (
                <div className="relative group">
                  <button
                    className="w-9 h-9 rounded-full flex items-center justify-center text-stone-700 hover:text-stone-950 hover:bg-stone-100/80 transition-colors"
                    aria-label="Compte utilisateur"
                  >
                    <User className="w-4 h-4" />
                  </button>
                  <div className="absolute right-0 mt-2 w-52 bg-white/95 backdrop-blur-md border border-stone-200/80 rounded-2xl shadow-card-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-1.5">
                    <div className="p-3 border-b border-stone-100">
                      <p className="font-semibold text-xs text-stone-900 truncate">{user?.first_name} {user?.last_name}</p>
                      <p className="text-[11px] text-stone-500 truncate mt-0.5">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => setIsAccountOpen(true)}
                      className="w-full flex items-center px-3 py-2 text-xs font-medium text-stone-700 hover:text-stone-950 hover:bg-stone-50 rounded-xl transition-colors"
                    >
                      <User className="w-3.5 h-3.5 mr-2 text-stone-400" />
                      Mon compte & Commandes
                    </button>
                    <button
                      onClick={logout}
                      className="w-full flex items-center px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors mt-0.5"
                    >
                      <LogOut className="w-3.5 h-3.5 mr-2" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <button
                    className="w-9 h-9 rounded-full flex items-center justify-center text-stone-700 hover:text-stone-950 hover:bg-stone-100/80 transition-colors"
                    aria-label="Se connecter"
                  >
                    <User className="w-4 h-4" />
                  </button>
                  <div className="absolute right-0 mt-2 w-44 bg-white/95 backdrop-blur-md border border-stone-200/80 rounded-2xl shadow-card-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-1.5">
                    <button
                      onClick={() => navigate('/login')}
                      className="w-full px-3 py-2 text-xs font-medium text-stone-700 hover:text-stone-950 hover:bg-stone-50 rounded-xl text-left transition-colors"
                    >
                      Se connecter
                    </button>
                    <button
                      onClick={() => navigate('/register')}
                      className="w-full px-3 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-black rounded-xl text-left transition-colors mt-1"
                    >
                      Créer un compte
                    </button>
                  </div>
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={() => navigate('/wishlist')}
                className="w-9 h-9 rounded-full flex items-center justify-center text-stone-700 hover:text-stone-950 hover:bg-stone-100/80 transition-colors relative"
                aria-label="Favoris"
              >
                <Heart className="w-4 h-4" />
                {wishlist.length > 0 && (
                  <span className="absolute 1 top-0.5 right-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-[#FAF9F6] animate-scale-in">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setIsOpen(true)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-stone-700 hover:text-stone-950 hover:bg-stone-100/80 transition-colors relative"
                aria-label="Panier"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartItemsCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-stone-900 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-[#FAF9F6] animate-scale-in">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div
          className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu Content */}
          <div
            className={`absolute top-0 left-0 w-[85%] max-w-sm h-full bg-[#FAF9F6] shadow-2xl transition-transform duration-300 ease-out transform flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
          >
            <div className="p-5 border-b border-stone-200/60 flex items-center justify-between">
              <Logo size="sm" />
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 -mr-2 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
                aria-label="Fermer le menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {/* Mobile Search inside Menu */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher une pièce..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch(searchQuery);
                        setIsMenuOpen(false);
                      }
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/20"
                  />
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                </div>
              </div>

              <div className="space-y-1">
                {categories.map((category) => {
                  const isActive = currentCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => {
                        onCategoryChange(category.id);
                        setIsMenuOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-stone-950 font-bold bg-white shadow-sm border border-stone-200/60'
                          : 'text-stone-700 hover:bg-stone-100/70'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{category.label}</span>
                        {category.id === 'sale' && (
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full text-[10px] font-bold">
                            SOLDE
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Menu Footer (Auth) */}
            <div className="p-4 border-t border-stone-200/60 bg-white space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center px-2 mb-2">
                    <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xs mr-3">
                      {user?.first_name?.charAt(0) || 'U'}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-semibold text-xs text-stone-900 truncate">{user?.first_name} {user?.last_name}</p>
                      <p className="text-[11px] text-stone-500 truncate">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsAccountOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center px-4 py-2.5 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-semibold text-stone-800 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 mr-2" />
                    Mon Compte & Commandes
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center px-4 py-2.5 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5 mr-2" />
                    Déconnexion
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      navigate('/login');
                      setIsMenuOpen(false);
                    }}
                    className="px-4 py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 shadow-sm text-center"
                  >
                    Connexion
                  </button>
                  <button
                    onClick={() => {
                      navigate('/register');
                      setIsMenuOpen(false);
                    }}
                    className="px-4 py-3 bg-black text-white rounded-lg font-medium shadow-sm text-center"
                  >
                    Inscription
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>

    <AuthModal
      isOpen={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
    />

    {isSearchOpen && (
      <Suspense fallback={null}>
        <SearchPage
          products={products || []}
          onClose={() => setIsSearchOpen(false)}
          onProductClick={onProductClick}
          initialQuery={searchQuery}
        />
      </Suspense>
    )}

    {isAccountOpen && isAuthenticated && (
      <Suspense fallback={null}>
        <AccountPage onClose={() => setIsAccountOpen(false)} />
      </Suspense>
    )}

    <CartSidebarNew />
  </>
);
};

Header.displayName = 'Header';

export default Header;