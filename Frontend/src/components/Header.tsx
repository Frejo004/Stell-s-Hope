import React, { useState } from 'react';
import { Search, ShoppingBag, Menu, X, User, Heart, LogOut } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './AuthModal';
import SearchPage from './SearchPage';
import AccountPage from './AccountPage';
import { Product } from '../types';

interface HeaderProps {
  onCategoryChange: (category: string) => void;
  currentCategory: string;
  products: Product[];
  onProductClick: (product: Product) => void;
}

export default function Header({ onCategoryChange, currentCategory, products, onProductClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const { cartItemsCount, setIsOpen } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearchOpen(true);
  };

  const categories = [
    { id: 'all', label: 'Accueil', href: '#' },
    { id: 'boutique', label: 'Boutique', href: '#' },
    { id: 'homme', label: 'Homme', href: '#' },
    { id: 'femme', label: 'Femme', href: '#' },
    { id: 'accessories', label: 'Accessoires', href: '#' },
    { id: 'sale', label: 'Promos', href: '#' }
  ];

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
            <h1 className="text-2xl font-bold tracking-tight text-black">
              ÉLÉGANCE
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`text-sm font-medium transition-colors hover:text-rose-300 ${
                  currentCategory === category.id
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
                      <p className="font-medium">{user?.firstName} {user?.lastName}</p>
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
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <User className="w-6 h-6" />
                </button>
              )}
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Heart className="w-6 h-6" />
              </button>
              <button
                onClick={() => setIsOpen(true)}
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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
              
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    onCategoryChange(category.id);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 text-base font-medium transition-colors ${
                    currentCategory === category.id
                      ? 'text-rose-300 bg-rose-50'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      
      {isSearchOpen && (
        <SearchPage
          products={products}
          onClose={() => setIsSearchOpen(false)}
          onProductClick={onProductClick}
          initialQuery={searchQuery}
        />
      )}
      
      {isAccountOpen && isAuthenticated && (
        <AccountPage onClose={() => setIsAccountOpen(false)} />
      )}
    </header>
  );
}