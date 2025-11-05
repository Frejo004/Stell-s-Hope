import { useEffect, useState, useCallback } from 'react';
import { useProductFilters } from '../hooks/useProductFilters';
import { productService } from '../services/productService';
import { Category } from '../types';

// Composants temporaires (à remplacer par les vrais composants UI plus tard)
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
    className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${className}`}
    step={step}
  />
);

interface CheckboxProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
  children?: React.ReactNode;
}

const Checkbox = ({ id, checked, onCheckedChange, className = '', children }: CheckboxProps) => (
  <div className="flex items-center space-x-2">
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${className}`}
    />
    {children && <label htmlFor={id} className="text-sm font-normal">{children}</label>}
  </div>
);


interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

const Select = ({ value, onValueChange, children, className = '' }: SelectProps) => (
  <select 
    value={value} 
    onChange={(e) => onValueChange?.(e.target.value)}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm ${className}`}
  >
    {children}
  </select>
);

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

const SelectTrigger = ({ children, className = '' }: SelectTriggerProps) => (
  <div className={className}>{children}</div>
);

interface SelectValueProps {
  placeholder: string;
  children?: React.ReactNode;
}

const SelectValue = ({ placeholder }: SelectValueProps) => (
  <span>{placeholder}</span>
);

interface SelectContentProps {
  children: React.ReactNode;
}

const SelectContent = ({ children }: SelectContentProps) => (
  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
    {children}
  </div>
);

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const SelectItem = ({ value, children }: SelectItemProps) => (
  <option value={value} className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
    {children}
  </option>
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

  const resetAllFilters = () => {
    setPage(1);
    setSearch('');
    setCategory(null);
    setMinPrice(0);
    setMaxPrice(1000);
    setSortBy('created_at');
    setColors([]);
    setSizes([]);
    setPriceRange([0, 1000]);
    setLocalMinPrice(0);
    setLocalMaxPrice(1000);
  };

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    productService.getCategories().then(setCategories);
  }, []);

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
    { name: 'Gris', value: 'gris', bg: 'bg-gray-400' },
    { name: 'Bleu', value: 'bleu', bg: 'bg-blue-500' },
    { name: 'Rouge', value: 'rouge', bg: 'bg-red-500' },
    { name: 'Vert', value: 'vert', bg: 'bg-green-500' },
    { name: 'Beige', value: 'beige', bg: 'bg-amber-100' },
    { name: 'Marine', value: 'marine', bg: 'bg-blue-900' },
  ];

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  
  // Valeurs par défaut pour le slider de prix
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [localMinPrice, setLocalMinPrice] = useState<number | null>(null);
  const [localMaxPrice, setLocalMaxPrice] = useState<number | null>(null);

  // Mettre à jour le slider quand les prix changent
  useEffect(() => {
    if (minPrice !== null && maxPrice !== null) {
      setPriceRange([minPrice, maxPrice]);
      setLocalMinPrice(minPrice);
      setLocalMaxPrice(maxPrice);
    }
  }, [minPrice, maxPrice]);

  // Gérer le changement de prix avec un debounce
  const handlePriceChange = useCallback((values: number[]) => {
    setPriceRange([values[0], values[1]]);
    // Mettre à jour les prix après un délai
    const timer = setTimeout(() => {
      setMinPrice(values[0]);
      setMaxPrice(values[1]);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [setMinPrice, setMaxPrice, setPage]);

  return (
    <div className="bg-white border border-gray-200 w-full max-w-xs">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Filtres</h3>
        <button
          onClick={resetAllFilters}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Réinitialiser
        </button>
      </div>
      <div className="p-4 space-y-6">

      {/* Recherche */}
      <div>
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Rechercher un produit..."
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Catégorie */}
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium mb-2">Catégorie</label>
        <select
          value={category || ''}
          onChange={(e) => {
            setCategory(e.target.value ? parseInt(e.target.value) : null);
            setPage(1);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Options de tri */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Trier par</label>
        <Select
          value={sortBy}
          onValueChange={(value) => {
            setSortBy(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Nouveautés</SelectItem>
            <SelectItem value="price_asc">Prix croissant</SelectItem>
            <SelectItem value="price_desc">Prix décroissant</SelectItem>
            <SelectItem value="popularity">Populaire</SelectItem>
            <SelectItem value="rating">Mieux notés</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Prix avec slider */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-4">Prix</label>
        <div className="px-2">
          <Slider
            min={0}
            max={1000}
            step={10}
            value={[priceRange[0], priceRange[1]]}
            onValueChange={handlePriceChange}
            className="mb-4"
          />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Min:</span>
            <input
              type="number"
              value={localMinPrice !== null ? localMinPrice : minPrice || ''}
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value) : null;
                setLocalMinPrice(value);
                if (value !== null) {
                  setMinPrice(value);
                  setPage(1);
                }
              }}
              className="w-20 px-2 py-1 text-sm border rounded"
              min="0"
              max={maxPrice || 1000}
            />
          </div>
          <div className="h-px w-4 bg-gray-300"></div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Max:</span>
            <input
              type="number"
              value={localMaxPrice !== null ? localMaxPrice : maxPrice || ''}
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value) : null;
                setLocalMaxPrice(value);
                if (value !== null) {
                  setMaxPrice(value);
                  setPage(1);
                }
              }}
              className="w-20 px-2 py-1 text-sm border rounded"
              min={minPrice || 0}
              max="10000"
            />
          </div>
        </div>
      </div>

      {/* Couleurs */}
      <div className="mb-6">
        <span className="block text-sm font-medium text-gray-700 mb-3">Couleurs</span>
        <div className="space-y-2">
          {availableColors.map((color) => (
            <div key={color.value} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color.value}`}
                checked={colors.includes(color.value)}
                onCheckedChange={() => handleColorToggle(color.value)}
              >
                <div className="flex items-center space-x-2">
                  <span className={`w-4 h-4 rounded-full ${color.bg} border border-gray-200`}></span>
                  <span className="text-sm font-normal">{color.name}</span>
                </div>
              </Checkbox>
            </div>
          ))}
        </div>
      </div>

      {/* Tailles */}
      <div className="mb-6">
        <span className="block text-sm font-medium text-gray-700 mb-3">Tailles</span>
        <div className="grid grid-cols-3 gap-2">
          {availableSizes.map((size) => (
            <div key={size} className="flex items-center">
              <div key={size} className="flex items-center">
                <input
                  type="checkbox"
                  id={`size-${size}`}
                  checked={sizes.includes(size)}
                  onChange={() => handleSizeToggle(size)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={`size-${size}`} className="ml-2 text-sm font-normal">
                  {size}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};

export default ProductFilters;