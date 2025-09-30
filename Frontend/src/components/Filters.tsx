import React from 'react';
import { ChevronDown, X } from 'lucide-react';
import { FilterState } from '../types';

interface FiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Filters({ filters, onFiltersChange, isOpen, onToggle }: FiltersProps) {
  const categories = ['homme', 'femme', 'unisexe'];
  const types = ['hauts', 'bas', 'accessoires'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '29', '30', '31', '32', '33', '34', '36'];
  const colors = ['Noir', 'Blanc', 'Bleu marine', 'Rose poudré', 'Gris', 'Camel', 'Bordeaux', 'Beige'];
  const sortOptions = [
    { value: 'newest', label: 'Nouveautés' },
    { value: 'price-low', label: 'Prix croissant' },
    { value: 'price-high', label: 'Prix décroissant' },
    { value: 'rating', label: 'Mieux notés' }
  ];

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleArrayFilterChange = (key: keyof FilterState, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    handleFilterChange(key, newArray);
  };

  const clearFilters = () => {
    onFiltersChange({
      category: [],
      type: [],
      size: [],
      color: [],
      priceRange: [0, 500],
      sort: 'newest'
    });
  };

  const activeFiltersCount = [
    ...filters.category,
    ...filters.type,
    ...filters.size,
    ...filters.color
  ].length;

  return (
    <div className="bg-white">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <button
          onClick={onToggle}
          className="flex items-center justify-between w-full p-4 border-b"
        >
          <span className="font-medium">
            Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </span>
          <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Filters Content */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="p-4 lg:p-6 space-y-6">
          {/* Sort */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Trier par</h3>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rose-300"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Catégorie</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.category.includes(category)}
                    onChange={() => handleArrayFilterChange('category', category)}
                    className="rounded border-gray-300 text-rose-300 focus:ring-rose-300"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">
                    {category}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Type */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Type</h3>
            <div className="space-y-2">
              {types.map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.type.includes(type)}
                    onChange={() => handleArrayFilterChange('type', type)}
                    className="rounded border-gray-300 text-rose-300 focus:ring-rose-300"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Taille</h3>
            <div className="grid grid-cols-4 gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleArrayFilterChange('size', size)}
                  className={`p-2 text-sm border rounded ${
                    filters.size.includes(size)
                      ? 'border-rose-300 bg-rose-300 text-white'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Couleur</h3>
            <div className="space-y-2">
              {colors.map((color) => (
                <label key={color} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.color.includes(color)}
                    onChange={() => handleArrayFilterChange('color', color)}
                    className="rounded border-gray-300 text-rose-300 focus:ring-rose-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">{color}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Prix</h3>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={filters.priceRange[1]}
                onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>0 €</span>
                <span>{filters.priceRange[1]} €</span>
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center justify-center w-full p-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              <X className="w-4 h-4 mr-2" />
              Effacer les filtres
            </button>
          )}
        </div>
      </div>
    </div>
  );
}