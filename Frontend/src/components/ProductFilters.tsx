import { useEffect, useState } from 'react';
import { useProductFilters } from '../hooks/useProductFilters';
import { productService } from '../services/productService';
import { Category } from '../types';
import { BUSINESS_CONSTANTS } from '../constants';
import { Search, RotateCcw } from 'lucide-react';

interface SliderProps {
  min: number;
  max: number;
  value: number[];
  onValueChange: (value: number[]) => void;
  className?: string;
  step?: number;
}

const Slider = ({ min, max, value, onValueChange, className = '', step = 1 }: SliderProps) => (
  <input 
    type="range" 
    min={min} 
    max={max} 
    value={value?.[0] || 0} 
    onChange={(e) => onValueChange?.([parseInt(e.target.value)])}
    className={`w-full h-1.5 bg-stone-200 accent-stone-950 rounded-lg appearance-none cursor-pointer ${className}`}
    step={step}
  />
);

const ProductFilters: React.FC = () => {
  const {
    search, setSearch,
    category, setCategory,
    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    sortBy, setSortBy,
    colors, setColors,
    sizes, setSizes,
    setPage
  } = useProductFilters();

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    productService.getCategories().then(setCategories);
  }, []);

  const [localMinPrice, setLocalMinPrice] = useState<number | null>(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState<number | null>(maxPrice);
  const [localSearch, setLocalSearch] = useState(search);

  const resetAllFilters = () => {
    setPage(1);
    setSearch('');
    setCategory(null);
    setMinPrice(null);
    setMaxPrice(null);
    setSortBy('created_at');
    setColors([]);
    setSizes([]);
    setLocalMinPrice(null);
    setLocalMaxPrice(null);
    setLocalSearch('');
  };

  const handleColorToggle = (color: string) => {
    setColors(colors.includes(color) 
      ? colors.filter(c => c !== color)
      : [...colors, color]
    );
    setPage(1);
  };

  const handleSizeToggle = (size: string) => {
    setSizes(sizes.includes(size)
      ? sizes.filter(s => s !== size)
      : [...sizes, size]
    );
    setPage(1);
  };

  const availableColors = [
    { name: 'Noir', value: 'noir', bg: 'bg-black' },
    { name: 'Blanc', value: 'blanc', bg: 'bg-white border' },
    { name: 'Gris', value: 'gris', bg: 'bg-stone-500' },
    { name: 'Bleu', value: 'bleu', bg: 'bg-sky-600' },
    { name: 'Rouge', value: 'rouge', bg: 'bg-rose-600' },
    { name: 'Vert', value: 'vert', bg: 'bg-emerald-600' },
    { name: 'Beige', value: 'beige', bg: 'bg-amber-100' },
    { name: 'Marine', value: 'marine', bg: 'bg-blue-950' },
  ];

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
  }, [minPrice, maxPrice]);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    if (localMinPrice === minPrice && localMaxPrice === maxPrice) return;
    const timer = setTimeout(() => {
      setMinPrice(localMinPrice);
      setMaxPrice(localMaxPrice);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [localMinPrice, localMaxPrice, minPrice, maxPrice, setMinPrice, setMaxPrice, setPage]);

  useEffect(() => {
    if (localSearch === search) return;
    const timer = setTimeout(() => {
      setSearch(localSearch);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [localSearch, search, setSearch, setPage]);

  return (
    <div className="bg-white rounded-3xl border border-stone-200/70 shadow-sm overflow-hidden w-full max-w-sm">
      {/* En-tête des filtres */}
      <div className="flex justify-between items-center p-5 border-b border-stone-100">
        <h3 className="text-xs uppercase tracking-widest font-bold text-stone-900">
          Filtres de recherche
        </h3>
        <button
          onClick={resetAllFilters}
          className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-medium transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Effacer</span>
        </button>
      </div>

      <div className="p-5 space-y-6">
        {/* Recherche rapide */}
        <div>
          <label htmlFor="search" className="block text-xs uppercase tracking-wider font-semibold text-stone-600 mb-2">
            Mots-clés
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Ex: Robe, Veste, Sac..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200/80 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-400/20 focus:border-stone-400 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Catégorie */}
        <div>
          <label htmlFor="category" className="block text-xs uppercase tracking-wider font-semibold text-stone-600 mb-2">
            Catégorie
          </label>
          <select
            id="category"
            value={category || ''}
            onChange={(e) => {
              setCategory(e.target.value ? parseInt(e.target.value) : null);
              setPage(1);
            }}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200/80 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-400/20 focus:border-stone-400 transition-all"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Options de tri */}
        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-stone-600 mb-2">
            Trier par
          </label>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200/80 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-400/20 focus:border-stone-400 transition-all"
          >
            <option value="created_at">Nouveautés d'abord</option>
            <option value="price_asc">Prix : Moins cher au plus cher</option>
            <option value="price_desc">Prix : Plus cher au moins cher</option>
            <option value="popularity">Pièces les plus populaires</option>
            <option value="rating">Mieux notées</option>
          </select>
        </div>

        {/* Plage de Prix avec slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-600">
              Budget (FCFA)
            </span>
            <span className="text-xs font-semibold text-stone-900">
              {localMaxPrice ? `${localMaxPrice.toLocaleString()} FCFA` : 'Max'}
            </span>
          </div>
          <div className="py-2">
            <Slider
              min={0}
              max={BUSINESS_CONSTANTS.PRICE_FILTER_MAX}
              step={BUSINESS_CONSTANTS.PRICE_FILTER_STEP}
              value={[localMaxPrice ?? BUSINESS_CONSTANTS.PRICE_FILTER_MAX]}
              onValueChange={(values) => setLocalMaxPrice(values[0] ?? null)}
            />
          </div>
          <div className="flex items-center gap-2 pt-1 text-xs text-stone-500">
            <span className="bg-stone-100 px-2.5 py-1 rounded-lg font-medium text-stone-700">0 FCFA</span>
            <span className="flex-1 text-center font-light text-[10px] text-stone-400">à</span>
            <span className="bg-stone-100 px-2.5 py-1 rounded-lg font-medium text-stone-700">
              {BUSINESS_CONSTANTS.PRICE_FILTER_MAX.toLocaleString()} FCFA
            </span>
          </div>
        </div>

        {/* Couleurs */}
        <div>
          <span className="block text-xs uppercase tracking-wider font-semibold text-stone-600 mb-3">
            Nuances & Couleurs
          </span>
          <div className="grid grid-cols-2 gap-2">
            {availableColors.map((color) => {
              const isChecked = colors.includes(color.value);
              return (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleColorToggle(color.value)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                    isChecked
                      ? 'border-stone-950 bg-stone-950 text-white shadow-sm'
                      : 'border-stone-200/80 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${color.bg} shadow-sm shrink-0`} />
                  <span className="truncate">{color.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tailles */}
        <div>
          <span className="block text-xs uppercase tracking-wider font-semibold text-stone-600 mb-3">
            Tailles disponibles
          </span>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => {
              const isChecked = sizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`w-10 h-10 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center border ${
                    isChecked
                      ? 'bg-stone-950 text-white border-stone-950 shadow-sm'
                      : 'bg-white text-stone-700 border-stone-200/80 hover:bg-stone-50 hover:border-stone-300'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;