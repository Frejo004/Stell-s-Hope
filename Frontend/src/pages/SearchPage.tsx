import { useState, useMemo } from 'react';
import { Search, X, SlidersHorizontal, ArrowLeft, Sparkles } from 'lucide-react';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { formatPrice } from '../utils';
import { BUSINESS_CONSTANTS } from '../constants';
import Logo from '../components/Logo';

interface SearchPageProps {
  products?: Product[];
  onClose: () => void;
  onProductClick: (product: Product) => void;
  initialQuery?: string;
}

export default function SearchPage({ products, onClose, onProductClick, initialQuery = '' }: SearchPageProps) {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, BUSINESS_CONSTANTS.PRICE_FILTER_MAX] as [number, number],
    sortBy: 'relevance' as 'relevance' | 'price-low' | 'price-high' | 'newest'
  });
  const [showFilters, setShowFilters] = useState(false);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    let results = (products || []).filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category?.name?.toLowerCase().includes(query.toLowerCase()) ||
      (product.type?.toLowerCase().includes(query.toLowerCase()) ?? false)
    );

    if (filters.category) {
      results = results.filter(p => p.category?.name?.toLowerCase() === filters.category.toLowerCase());
    }

    results = results.filter(p =>
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

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
        break;
    }

    return results;
  }, [products, query, filters]);

  const popularSearches = ['Robe', 'Chemise', 'Pantalon', 'Sac', 'Costume', 'Accessoires', 'Lin'];

  return (
    <div className="fixed inset-0 bg-[#FAF9F6] text-stone-900 selection:bg-stone-900 selection:text-white z-[80] overflow-y-auto animate-in fade-in duration-200">
      {/* ── Search Header Bar ── */}
      <div className="sticky top-0 z-30 bg-white/85 backdrop-blur-xl border-b border-stone-200/80 px-4 sm:px-8 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-3 sm:gap-4">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 hover:text-stone-950 transition-colors shrink-0"
            aria-label="Fermer la recherche"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Search Input Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher une création, une matière, une coupe..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 bg-stone-50 border border-stone-200 rounded-full text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-950 focus:bg-white focus:ring-4 focus:ring-stone-950/5 transition-all shadow-inner"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-600"
                aria-label="Effacer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shrink-0 ${
              showFilters
                ? 'bg-stone-950 text-white'
                : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-950'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filtres</span>
          </button>
        </div>

        {/* Filters drawer */}
        {showFilters && (
          <div className="max-w-6xl mx-auto pt-4 mt-3 border-t border-stone-200/60 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                  Univers & Catégorie
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 outline-none focus:border-stone-950"
                >
                  <option value="">Toutes les collections</option>
                  <option value="femme">Femme</option>
                  <option value="homme">Homme</option>
                  <option value="accessoires">Accessoires</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                  <span>Prix maximum</span>
                  <span className="text-stone-900">{formatPrice(filters.priceRange[1])}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={BUSINESS_CONSTANTS.PRICE_FILTER_MAX}
                  step={BUSINESS_CONSTANTS.PRICE_FILTER_STEP}
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                  }))}
                  className="w-full accent-stone-950"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                  Classement
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    sortBy: e.target.value as typeof filters.sortBy
                  }))}
                  className="w-full px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 outline-none focus:border-stone-950"
                >
                  <option value="relevance">Pertinence Atelier</option>
                  <option value="price-low">Prix croissant</option>
                  <option value="price-high">Prix décroissant</option>
                  <option value="newest">Dernières nouveautés</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Search Body ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
        {!query.trim() ? (
          <div className="text-center py-12 max-w-lg mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-stone-100 text-stone-700 border border-stone-200 mb-4">
              <Sparkles className="w-3 h-3 text-terracotta-500" />
              Inspiration Atelier
            </span>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-stone-950 mb-2">
              Que désirez-vous découvrir ?
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mb-8 leading-relaxed">
              Explorez nos lignes prêt-à-porter, maroquinerie d'art et créations signatures.
            </p>

            <div className="text-left bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-3">
                Suggestions populaires
              </p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map(search => (
                  <button
                    key={search}
                    onClick={() => setQuery(search)}
                    className="px-4 py-2 rounded-full bg-stone-50 hover:bg-stone-950 hover:text-white border border-stone-200 text-xs font-medium text-stone-700 transition-all duration-200"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-stone-200/80">
              <h2 className="font-serif text-xl sm:text-2xl font-medium text-stone-950">
                Résultats pour « <span className="italic">{query}</span> »
              </h2>
              <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
                {searchResults.length} création{searchResults.length > 1 ? 's' : ''}
              </span>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-16 px-4 max-w-md mx-auto bg-white rounded-3xl border border-stone-200/80 shadow-sm">
                <Search className="w-10 h-10 text-stone-300 mx-auto mb-4" />
                <h3 className="font-serif text-xl font-medium text-stone-900 mb-2">
                  Aucune pièce correspondante
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed mb-6">
                  Nous n'avons pas trouvé de création pour cette recherche. Essayez un autre terme ou découvrez notre catalogue complet.
                </p>
                <button
                  onClick={() => setQuery('')}
                  className="px-6 py-2.5 rounded-full bg-stone-950 text-white text-xs font-semibold tracking-wider uppercase hover:bg-stone-800 transition-colors"
                >
                  Effacer la recherche
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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