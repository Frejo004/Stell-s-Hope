import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SlidersHorizontal, ChevronRight, Sparkles } from 'lucide-react';
import ProductFilters from '../components/ProductFilters';
import InfiniteProductList from '../components/InfiniteProductList';
import { useProductFilters } from '../hooks/useProductFilters';
import { ProductListingProvider, useProductListing } from '../contexts/ProductListingContext';
import { categoryService } from '../services/categoryService';
import SEO from '../components/SEO';

const CATEGORY_EDITORIAL_META: Record<string, { subtitle: string; image: string }> = {
  femme: {
    subtitle: 'L\'allure contemporaine, la fluidité des étoffes et la grâce des coupes atelier.',
    image: 'https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg'
  },
  homme: {
    subtitle: 'L\'élégance architecturée, le sens du détail et l\'authenticité des matières nobles.',
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg'
  },
  accessoires: {
    subtitle: 'Maroquinerie fine, pièces signatures et finitions artisanales d\'exception.',
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg'
  },
  enfant: {
    subtitle: 'Douceur des textures et créations pensées pour la liberté de mouvement.',
    image: 'https://images.pexels.com/photos/1619801/pexels-photo-1619801.jpeg'
  }
};

export default function CategoryPage() {
  const { category: categorySlug } = useParams<{ category: string }>();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [categoryName, setCategoryName] = useState<string>('');
  const { setCategory } = useProductFilters();

  useEffect(() => {
    const fetchCategory = async () => {
      if (categorySlug) {
        try {
          const categories = await categoryService.getCategories();
          const category = categories.find(cat => 
            cat.name.toLowerCase().replace(/\s+/g, '-') === categorySlug.toLowerCase()
          );
          if (category) {
            setCategory(category.id);
            setCategoryName(category.name);
          } else {
            // Si pas trouvé par slug exact, mettre en forme le slug en titre
            const formatted = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);
            setCategoryName(formatted);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération de la catégorie:', error);
        }
      }
    };
    fetchCategory();
  }, [categorySlug, setCategory]);

  return (
    <ProductListingProvider>
      <CategoryContent
        isFiltersOpen={isFiltersOpen}
        setIsFiltersOpen={setIsFiltersOpen}
        categoryName={categoryName}
        categorySlug={categorySlug || ''}
      />
    </ProductListingProvider>
  );
}

type CategoryContentProps = {
  isFiltersOpen: boolean;
  setIsFiltersOpen: (open: boolean) => void;
  categoryName: string;
  categorySlug: string;
};

const CategoryContent = ({ isFiltersOpen, setIsFiltersOpen, categoryName, categorySlug }: CategoryContentProps) => {
  const { total } = useProductListing();
  const productCount = total;

  const normalizedSlug = categorySlug.toLowerCase();
  const editorial = useMemo(() => {
    return CATEGORY_EDITORIAL_META[normalizedSlug] || {
      subtitle: 'Découvrez notre sélection exclusive conçue avec passion et savoir-faire.',
      image: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg'
    };
  }, [normalizedSlug]);

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-stone-900 selection:bg-stone-900 selection:text-white pb-20">
      <SEO
        title={categoryName ? `Collection ${categoryName}` : 'Boutique Haute Couture'}
        description={editorial.subtitle}
        image={editorial.image}
      />

      {/* ── Editorial Category Hero Banner ── */}
      <section className="relative overflow-hidden bg-stone-950 text-white min-h-[260px] sm:min-h-[320px] flex items-center">
        <img
          src={editorial.image}
          alt={categoryName || 'Catégorie'}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-400 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight className="w-3 h-3 text-stone-500" />
            <Link to="/boutique" className="hover:text-white transition-colors">Boutique</Link>
            <ChevronRight className="w-3 h-3 text-stone-500" />
            <span className="text-white font-semibold">{categoryName || 'Collection'}</span>
          </nav>

          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-white/10 text-rose-300 border border-white/15 backdrop-blur-md mb-3">
              <Sparkles className="w-3 h-3 text-terracotta-400" />
              Atelier Stell's Hope
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-white mb-3 capitalize">
              {categoryName || 'Collection'}
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              {editorial.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* ── Main Catalog Grid & Filters ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Colonne des filtres */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-28">
              {/* Mobile Filter Trigger */}
              <div className="lg:hidden mb-6">
                <button
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className="flex items-center justify-between w-full px-5 py-3.5 bg-white border border-stone-200 rounded-2xl shadow-sm font-semibold text-xs uppercase tracking-wider text-stone-800"
                >
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-terracotta-500" />
                    <span>Filtres de la collection</span>
                  </span>
                  <span className="text-stone-400 text-xs">
                    {isFiltersOpen ? 'Masquer' : 'Afficher'}
                  </span>
                </button>
              </div>

              {/* Filter Panel */}
              <div className={`${isFiltersOpen ? 'block' : 'hidden'} lg:block mb-8 lg:mb-0`}>
                <ProductFilters />
              </div>
            </div>
          </div>

          {/* Grille des produits */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200/60">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                <span className="font-serif text-base text-stone-950 font-bold mr-1.5">{productCount}</span>
                création{productCount > 1 ? 's' : ''} disponible{productCount > 1 ? 's' : ''}
              </p>
            </div>

            <InfiniteProductList />
          </div>
        </div>
      </div>
    </div>
  );
};