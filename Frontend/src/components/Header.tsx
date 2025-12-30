import { useState, useCallback, useMemo, useEffect } from 'react';
import { Search, ShoppingBag, Menu, X, User, Heart, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCartContext } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './AuthModal';
import SearchPage from '../pages/SearchPage';
import AccountPage from '../pages/AccountPage';
import CartSidebarNew from './CartSidebarNew';
import Logo from './Logo';
import { Product } from '../types';

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
  const { cartItemsCount, isOpen, setIsOpen } = useCartContext();
  const navigate = useNavigate();

  console.log('Header isOpen:', isOpen);

  // Log pour debug
  console.log('📊 Header cartItemsCount:', cartItemsCount);
  const { wishlist } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  // Close overlays on navigation
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setIsAccountOpen(false);
  }, [location.pathname]);

  // Force re-render when wishlist or cart changes
  useEffect(() => {
    // This effect will run whenever wishlist changes
  }, [wishlist]);

  useEffect(() => {
    console.log('🔄 Header re-rendering, cartItemsCount:', cartItemsCount);
  }, [cartItemsCount]);

  useEffect(() => {
    console.log('🔄 Header isOpen changed:', isOpen);
  }, [isOpen]);

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
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top banner */}
      <div className="bg-black text-white py-2 px-4">
        <p className="text-center text-sm">
          Livraison gratuite dès 100€ • Retours gratuits sous 30 jours
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`text-sm font-medium transition-colors hover:text-rose-300 ${currentCategory === category.id
                  ? 'text-rose-300 border-b-2 border-rose-300'
                  : 'text-gray-700'
                  }`}
              >
                {category.label}
              </button>
            ))}
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Bar - Desktop */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Search className="w-6 h-6 md:hidden" />
              </button>
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <User className="w-6 h-6" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="p-3 border-b">
                      <p className="font-medium">{user?.first_name} {user?.last_name}</p>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => setIsAccountOpen(true)}
                      className="w-full flex items-center px-3 py-2 text-left hover:bg-gray-50"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Mon compte
                    </button>
                    <button
                      onClick={logout}
                      className="w-full flex items-center px-3 py-2 text-left hover:bg-gray-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <User className="w-6 h-6" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <button
                      onClick={() => navigate('/login')}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50"
                    >
                      Se connecter
                    </button>
                    <button
                      onClick={() => navigate('/register')}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50"
                    >
                      S'inscrire
                    </button>
                  </div>
                </div>
              )}
              <button
                onClick={() => navigate('/wishlist')}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors relative"
              >
                <Heart className="w-6 h-6" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  console.log('🛒 Cart icon clicked, current isOpen:', isOpen);
                  console.log('setIsOpen function:', setIsOpen);
                  setIsOpen(true);
                  console.log('After setIsOpen(true)');
                }}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors relative"
              >
                <ShoppingBag className="w-6 h-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-300 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
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
            className={`absolute top-0 left-0 w-[80%] max-w-sm h-full bg-white shadow-xl transition-transform duration-300 ease-out transform flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <span className="font-bold text-xl uppercase tracking-wider">Menu</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 -mr-2 text-gray-500 hover:text-black rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              {/* Mobile Search inside Menu */}
              <div className="px-4 mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Que recherchez-vous ?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch(searchQuery);
                        setIsMenuOpen(false);
                      }
                    }}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-rose-200"
                  />
                  <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-1 px-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      onCategoryChange(category.id);
                      setIsMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 rounded-lg text-lg font-medium transition-colors ${currentCategory === category.id
                      ? 'text-rose-500 bg-rose-50'
                      : 'text-gray-800 hover:bg-gray-50'
                      }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Menu Footer (Auth) */}
            <div className="p-4 border-t bg-gray-50 space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center px-4 mb-2">
                    <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center font-bold mr-3">
                      {user?.first_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user?.first_name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsAccountOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center px-4 py-3 bg-white border border-gray-200 rounded-lg font-medium text-gray-700 shadow-sm"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Mon Compte
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center px-4 py-3 text-red-500 font-medium hover:bg-red-50 rounded-lg"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
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

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {isSearchOpen && (
        <SearchPage
          products={products || []}
          onClose={() => setIsSearchOpen(false)}
          onProductClick={onProductClick}
          initialQuery={searchQuery}
        />
      )}

      {isAccountOpen && isAuthenticated && (
        <AccountPage onClose={() => setIsAccountOpen(false)} />
      )}

      <CartSidebarNew />
    </header>
  );
};

Header.displayName = 'Header';

export default Header;