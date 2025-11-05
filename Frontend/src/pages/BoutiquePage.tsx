import { useState  } from 'react';
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import ProductFilters from '../components/ProductFilters';
import InfiniteProductList from '../components/InfiniteProductList';

// Ajout de types pour gérer les filtres et le tri, comme recommandé.
type ActiveFilters = { [key: string]: string | string[] };
type SortOption = 'newest' | 'popularity' | 'price-asc' | 'price-desc';

export default function BoutiquePage() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  // Ajout d'états pour les filtres actifs, le tri et le nombre de produits.
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({ Categorie: 'Femme' });
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  // Le nombre de produits serait mis à jour par le composant InfiniteProductList.
  const productCount = 128; // Exemple statique

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: 'Nouveautés' },
    { value: 'popularity', label: 'Popularité' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Boutique - Tous nos produits
        </h1>
      </div>

      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="flex items-center space-x-2 w-full p-3 bg-gray-100 rounded-lg"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span>Filtres</span>
              </button>
            </div>

            <div className={`${isFiltersOpen ? 'block' : 'hidden'} lg:block`}>
              <ProductFilters />
            </div>
          </div>
        </div>

        {/* Products Grid with Infinite Scroll */}
        <div className="lg:col-span-3">
          {/* Section pour le tri et le nombre de résultats */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <p className="text-gray-600 mb-2 sm:mb-0">
              {productCount} produit{productCount > 1 ? 's' : ''}
            </p>
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Affichage des filtres actifs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(activeFilters).map(([key, value]) => (
              <div key={key} className="flex items-center bg-gray-200 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">
                <span>{key}: {Array.isArray(value) ? value.join(', ') : value}</span>
                <button onClick={() => { /* Logique pour retirer le filtre */ }} className="ml-2">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* La liste des produits utiliserait maintenant les filtres et le tri.
              Les "Skeletons Loaders" seraient gérés à l'intérieur de ce composant. */}
          <InfiniteProductList filters={activeFilters} sortBy={sortOption} />
        </div>
      </div>
    </div>
  );
}