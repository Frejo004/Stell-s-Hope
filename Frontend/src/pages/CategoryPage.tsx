import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import ProductFilters from '../components/ProductFilters';
import InfiniteProductList from '../components/InfiniteProductList';
import { useProductFilters } from '../hooks/useProductFilters';
import { useInfiniteProducts } from '../hooks/useInfiniteProducts';
import { categoryService } from '../services/categoryService';

type SortOption = 'newest' | 'popularity' | 'price-asc' | 'price-desc';

export default function CategoryPage() {
  const { category: categorySlug } = useParams<{ category: string }>();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [categoryName, setCategoryName] = useState<string>('');
  const { setCategory, getFilters } = useProductFilters();
  
  // Récupérer l'ID de la catégorie depuis le slug et l'appliquer aux filtres
  useEffect(() => {
    const fetchCategory = async () => {
      if (categorySlug) {
        try {
          const categories = await categoryService.getCategories();
          const category = categories.find(cat => 
            cat.name.toLowerCase().replace(/\s+/g, '-') === categorySlug
          );
          if (category) {
            setCategory(category.id);
            setCategoryName(category.name);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération de la catégorie:', error);
        }
      }
    };
    fetchCategory();
  }, [categorySlug, setCategory]);
  
  const { products } = useInfiniteProducts(getFilters());
  const productCount = products.length;

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
        <h1 className="text-3xl font-bold text-gray-900">{categoryName || 'Catégorie'}</h1>
      </div>

      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Colonne des filtres, identique à la page Boutique */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <div className="lg:hidden mb-6">
              <button onClick={() => setIsFiltersOpen(!isFiltersOpen)} className="flex items-center space-x-2 w-full p-3 bg-gray-100 rounded-lg">
                <SlidersHorizontal className="w-5 h-5" />
                <span>Filtres</span>
              </button>
            </div>
            <div className={`${isFiltersOpen ? 'block' : 'hidden'} lg:block`}>
              <ProductFilters />
            </div>
          </div>
        </div>

        {/* Grille des produits, identique à la page Boutique */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">{productCount} produit{productCount > 1 ? 's' : ''}</p>
            {/* Options de tri */}
          </div>
          <InfiniteProductList />
        </div>
      </div>
    </div>
  );
}