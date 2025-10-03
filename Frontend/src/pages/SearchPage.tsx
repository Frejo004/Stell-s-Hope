import React, { useState, useMemo } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface SearchPageProps {
  products: Product[];
  onClose: () => void;
  onProductClick: (product: Product) => void;
  initialQuery?: string;
}

export default function SearchPage({ products, onClose, onProductClick, initialQuery = '' }: SearchPageProps) {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 500] as [number, number],
    sortBy: 'relevance' as 'relevance' | 'price-low' | 'price-high' | 'newest'
  });
  const [showFilters, setShowFilters] = useState(false);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    let results = products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.type.toLowerCase().includes(query.toLowerCase())
    );

    // Apply filters
    if (filters.category) {
      results = results.filter(p => p.category === filters.category);
    }

    results = results.filter(p => 
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Sort results
    switch (filters.sortBy) {
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        results.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        // Keep relevance order (search match quality)
        break;
    }

    return results;
  }, [products, query, filters]);

  const popularSearches = ['chemise', 'jean', 'robe', 'pull', 'sneakers', 'sac'];

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher des produits..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-300"
              autoFocus
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            <span>Filtres</span>
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Catégorie</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Toutes</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="unisexe">Unisexe</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Prix max</label>
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                  }))}
                  className="w-full"
                />
                <span className="text-sm text-gray-600">{filters.priceRange[1]}€</span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Trier par</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    sortBy: e.target.value as typeof filters.sortBy
                  }))}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="relevance">Pertinence</option>
                  <option value="price-low">Prix croissant</option>
                  <option value="price-high">Prix décroissant</option>
                  <option value="newest">Nouveautés</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {!query.trim() ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Que recherchez-vous ?</h2>
            <p className="text-gray-600 mb-6">Recherches populaires :</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularSearches.map(search => (
                <button
                  key={search}
                  onClick={() => setQuery(search)}
                  className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 text-sm"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} pour "{query}"
              </h2>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">Aucun produit trouvé pour votre recherche.</p>
                <p className="text-sm text-gray-500">
                  Essayez avec des mots-clés différents ou parcourez nos catégories.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {searchResults.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onProductClick={onProductClick}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}