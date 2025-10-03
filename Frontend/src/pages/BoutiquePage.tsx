import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import ProductFilters from '../components/ProductFilters';
import InfiniteProductList from '../components/InfiniteProductList';

export default function BoutiquePage() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

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
          <InfiniteProductList />
        </div>
      </div>
    </div>
  );
}