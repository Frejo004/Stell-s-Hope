import React, { useEffect, useState } from 'react';
import { useProductFilters } from '../hooks/useProductFilters';
import { productService } from '../services/productService';

const ProductFilters: React.FC = () => {
  const {
    search, setSearch,
    category, setCategory,
    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    sortBy, setSortBy,
    colors, setColors,
    sizes, setSizes,
    resetFilters,
    setPage
  } = useProductFilters();

  const [categories, setCategories] = useState([]);

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

  const availableColors = ['Noir', 'Blanc', 'Gris', 'Bleu', 'Rouge', 'Vert', 'Beige', 'Marine'];
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="bg-white border border-gray-200 w-full max-w-xs">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Filtres</h3>
        <button
          onClick={resetFilters}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Réinitialiser
        </button>
      </div>
      <div className="p-4 space-y-4">

      {/* Recherche */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
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
        <label className="block text-sm font-medium mb-2">Catégorie</label>
        <select
          value={category || ''}
          onChange={(e) => {
            setCategory(e.target.value ? parseInt(e.target.value) : null);
            setPage(1);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Prix */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Prix</label>
        <div className="flex space-x-1">
          <input
            type="number"
            value={minPrice || ''}
            onChange={(e) => {
              setMinPrice(e.target.value ? parseInt(e.target.value) : null);
              setPage(1);
            }}
            placeholder="Min"
            className="w-20 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="text-gray-400 self-center">-</span>
          <input
            type="number"
            value={maxPrice || ''}
            onChange={(e) => {
              setMaxPrice(e.target.value ? parseInt(e.target.value) : null);
              setPage(1);
            }}
            placeholder="Max"
            className="w-20 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="text-xs text-gray-500 self-center">€</span>
        </div>
      </div>

      {/* Couleurs */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Couleurs</label>
        <div className="flex flex-wrap gap-2">
          {availableColors.map(color => (
            <button
              key={color}
              onClick={() => handleColorToggle(color)}
              className={`px-3 py-1 text-sm rounded-full border ${
                colors.includes(color)
                  ? 'bg-blue-100 border-blue-500 text-blue-700'
                  : 'bg-gray-100 border-gray-300 text-gray-700'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Tailles */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Tailles</label>
        <div className="flex flex-wrap gap-2">
          {availableSizes.map(size => (
            <button
              key={size}
              onClick={() => handleSizeToggle(size)}
              className={`px-3 py-1 text-sm rounded border ${
                sizes.includes(size)
                  ? 'bg-blue-100 border-blue-500 text-blue-700'
                  : 'bg-gray-100 border-gray-300 text-gray-700'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Tri */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Trier par</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="created_at">Plus récents</option>
          <option value="price_asc">Prix croissant</option>
          <option value="price_desc">Prix décroissant</option>
          <option value="name">Nom A-Z</option>
          <option value="popularity">Popularité</option>
        </select>
      </div>
      </div>
    </div>
  );
};

export default ProductFilters;