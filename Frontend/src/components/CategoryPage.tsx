import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Product, FilterState } from '../types';
import ProductGrid from './ProductGrid';
import Filters from './Filters';

interface CategoryPageProps {
  products: Product[];
  category: string;
  onProductClick: (product: Product) => void;
}

export default function CategoryPage({ products, category, onProductClick }: CategoryPageProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: [],
    type: [],
    size: [],
    color: [],
    priceRange: [0, 500],
    sort: 'newest'
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'homme': return 'Collection Homme';
      case 'femme': return 'Collection Femme';
      case 'accessories': return 'Accessoires';
      case 'sale': return 'Promotions';
      default: return 'Toutes les nouveautés';
    }
  };

  const getFilteredProducts = () => {
    let filtered = products;

    // Category filter
    if (category === 'homme') {
      filtered = filtered.filter(p => p.category === 'homme');
    } else if (category === 'femme') {
      filtered = filtered.filter(p => p.category === 'femme');
    } else if (category === 'accessories') {
      filtered = filtered.filter(p => p.type === 'accessoires');
    } else if (category === 'sale') {
      filtered = filtered.filter(p => p.isOnSale);
    }

    // Apply filters
    if (filters.category.length > 0) {
      filtered = filtered.filter(p => filters.category.includes(p.category));
    }
    
    if (filters.type.length > 0) {
      filtered = filtered.filter(p => filters.type.includes(p.type));
    }
    
    if (filters.size.length > 0) {
      filtered = filtered.filter(p => 
        p.sizes.some(size => filters.size.includes(size))
      );
    }
    
    if (filters.color.length > 0) {
      filtered = filtered.filter(p => 
        p.colors.some(color => filters.color.includes(color))
      );
    }
    
    // Price filter
    filtered = filtered.filter(p => p.price <= filters.priceRange[1]);

    // Sort
    switch (filters.sort) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // newest - no sorting needed as products are already ordered
        break;
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {getCategoryTitle(category)}
        </h1>
        <p className="text-gray-600">
          {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
        </p>
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

            <Filters
              filters={filters}
              onFiltersChange={setFilters}
              isOpen={isFiltersOpen}
              onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          <ProductGrid
            products={filteredProducts}
            onProductClick={onProductClick}
          />
        </div>
      </div>
    </div>
  );
}