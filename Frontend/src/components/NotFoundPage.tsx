import React, { useState } from 'react';
import { Search, Home, ArrowRight, Package, Heart, Sparkles } from 'lucide-react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface NotFoundPageProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onNavigateHome: () => void;
  onCategoryChange: (category: string) => void;
}

export default function NotFoundPage({ products, onProductClick, onNavigateHome, onCategoryChange }: NotFoundPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const popularProducts = products.filter(p => p.isBestSeller).slice(0, 4);
  const newProducts = products.filter(p => p.isNew).slice(0, 4);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Trigger search functionality
      console.log('Search for:', searchQuery);
    }
  };

  const quickLinks = [
    { label: 'Collection Femme', action: () => onCategoryChange('femme') },
    { label: 'Collection Homme', action: () => onCategoryChange('homme') },
    { label: 'Nouveautés', action: () => onCategoryChange('all') },
    { label: 'Promotions', action: () => onCategoryChange('sale') }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="text-center py-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* 404 Animation */}
          <div className="relative mb-8">
            <h1 className="text-9xl font-bold text-gray-100 select-none">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center">
                <Package className="w-12 h-12 text-rose-300" />
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Oups ! Page introuvable
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            La page que vous recherchez n'existe pas ou a été déplacée.
            <br />Mais ne vous inquiétez pas, nous avons plein d'autres merveilles à vous montrer !
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
              <button
                onClick={handleSearch}
                className="bg-black text-white px-6 py-3 rounded-r-lg hover:bg-gray-900 flex items-center"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={onNavigateHome}
              className="flex items-center justify-center space-x-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900"
            >
              <Home className="w-5 h-5" />
              <span>Retour à l'accueil</span>
            </button>
            
            <button
              onClick={() => onCategoryChange('all')}
              className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50"
            >
              <Heart className="w-5 h-5" />
              <span>Voir nos coups de cœur</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-8">Liens rapides</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => (
              <button
                key={index}
                onClick={link.action}
                className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center group"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span className="font-medium">{link.label}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Products */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="w-6 h-6 text-rose-300" />
              <h3 className="text-2xl font-bold">Nos Best-Sellers</h3>
              <Sparkles className="w-6 h-6 text-rose-300" />
            </div>
            <p className="text-gray-600">
              Découvrez les produits préférés de nos clients
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {popularProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={onProductClick}
              />
            ))}
          </div>

          {/* New Products */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Nouveautés</h3>
            <p className="text-gray-600">
              Les dernières tendances mode
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={onProductClick}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Besoin d'aide ?</h3>
          <p className="text-gray-300 mb-6">
            Notre équipe est là pour vous accompagner dans votre shopping
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4">
              <div className="w-12 h-12 bg-rose-300 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Centre d'aide</h4>
              <p className="text-sm text-gray-300">
                Trouvez des réponses à vos questions
              </p>
            </div>
            
            <div className="p-4">
              <div className="w-12 h-12 bg-rose-300 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Service client</h4>
              <p className="text-sm text-gray-300">
                Contactez-nous du lundi au vendredi
              </p>
            </div>
            
            <div className="p-4">
              <div className="w-12 h-12 bg-rose-300 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Suivi de commande</h4>
              <p className="text-sm text-gray-300">
                Suivez vos commandes en temps réel
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}