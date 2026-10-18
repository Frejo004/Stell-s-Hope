import { useState } from 'react';
import { SlidersHorizontal, ChevronDown, X, Sparkles } from 'lucide-react';
import ProductFilters from '../components/ProductFilters';
import InfiniteProductList from '../components/InfiniteProductList';
import { ProductListingProvider, useProductListing } from '../contexts/ProductListingContext';

type ActiveFilters = { [key: string]: string | string[] };
type SortOption = 'newest' | 'popularity' | 'price-asc' | 'price-desc';

export default function BoutiquePage() {
  return (
    <ProductListingProvider>
      <BoutiqueContent />
    </ProductListingProvider>
  );
}

function BoutiqueContent() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeFilters] = useState<ActiveFilters>({});
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  const { total } = useProductListing();
  const productCount = total;

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: 'Nouveautés d\'abord' },
    { value: 'popularity', label: 'Popularité' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
  ];

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      {/* ─── Hero / Header Éditorial de la Boutique ───────────────────── */}
      <div className="border-b border-stone-200/60 bg-white/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 rounded-full mb-3 text-stone-700">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Catalogue Intégral
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-stone-950 tracking-tight leading-tight">
              Toutes les Pièces de la Maison
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 font-light mt-2 leading-relaxed">
              Explorez l'intégralité de nos créations pour femme, homme et accessoires. Filtrage sur mesure par taille, couleur et budget.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* ─── Barre d'outils (Nombre de résultats & Tri moderne) ───────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 p-3 sm:px-6 bg-white/80 backdrop-blur-md rounded-2xl border border-stone-200/60 shadow-sm">
          <div className="flex items-center gap-4">
            {/* Bouton Filtres sur Mobile */}
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-stone-950 text-white rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm transition-all hover:bg-black"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filtres {isFiltersOpen ? 'Ouverts' : ''}</span>
            </button>

            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              {productCount} {productCount > 1 ? 'pièces disponibles' : 'pièce disponible'}
            </p>
          </div>

          {/* Tri personnalisé */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400 font-medium hidden sm:inline">Classer par :</span>
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200/80 rounded-full pl-4 pr-9 py-2 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400/20 cursor-pointer transition-colors"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ─── Affichage des filtres actifs ────────────────────────────── */}
        {Object.keys(activeFilters).length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-stone-400 font-medium mr-1">Filtres appliqués :</span>
            {Object.entries(activeFilters).map(([key, value]) => (
              <div
                key={key}
                className="inline-flex items-center gap-1.5 bg-white border border-stone-200 px-3 py-1 rounded-full text-xs font-medium text-stone-800 shadow-sm"
              >
                <span>{key}: {Array.isArray(value) ? value.join(', ') : value}</span>
                <button
                  onClick={() => {}}
                  className="p-0.5 text-stone-400 hover:text-stone-950 rounded-full transition-colors"
                  aria-label="Supprimer le filtre"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
          {/* Sidebar des filtres Desktop & Tiroir Mobile */}
          <div className={`lg:col-span-3 ${isFiltersOpen ? 'block' : 'hidden'} lg:block mb-8 lg:mb-0`}>
            <div className="lg:sticky lg:top-24">
              <ProductFilters />
            </div>
          </div>

          {/* Grille des produits avec Infinite Scroll */}
          <div className="lg:col-span-9">
            <InfiniteProductList />
          </div>
        </div>
      </div>
    </div>
  );
}