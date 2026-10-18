import { useState } from 'react';
import { Search, Home, ArrowRight, Package, Heart, Sparkles, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { useNavigate, Link } from 'react-router-dom';

interface NotFoundPageProps {
  products?: Product[];
  onProductClick: (product: Product) => void;
  onNavigateHome: () => void;
  onCategoryChange: (category: string) => void;
}

export default function NotFoundPage({ products, onProductClick, onNavigateHome, onCategoryChange }: NotFoundPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const popularProducts = (products || []).filter(p => p.is_bestseller).slice(0, 4);
  const newProducts = (products || []).filter(p => p.isNew).slice(0, 4);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const quickLinks = [
    { label: 'Collection Femme', action: () => onCategoryChange('femme') },
    { label: 'Collection Homme', action: () => onCategoryChange('homme') },
    { label: 'Maroquinerie & Accessoires', action: () => onCategoryChange('accessoires') },
    { label: 'Toutes les créations', action: () => onCategoryChange('all') }
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 selection:bg-stone-900 selection:text-white pb-20">
      {/* Hero Section */}
      <div className="text-center py-16 sm:py-24 px-4 max-w-3xl mx-auto">
        <div className="relative mb-6">
          <span className="font-serif text-8xl sm:text-9xl font-light text-stone-200 select-none tracking-widest block">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-stone-950 text-white shadow-card-luxury">
              <Sparkles className="w-3.5 h-3.5 text-rose-300" />
              Échappée Introuvable
            </span>
          </div>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-stone-950 mb-3">
          Cette création semble s'être évanouie
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed mb-8">
          La page que vous recherchez a été déplacée ou n'est plus accessible. Nos ateliers vous invitent à explorer d'autres merveilles.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Rechercher une pièce ou une collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-5 pr-12 py-3.5 bg-white border border-stone-200 rounded-full text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-950 focus:ring-4 focus:ring-stone-950/5 transition-all shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-2 w-9 h-9 rounded-full bg-stone-950 text-white flex items-center justify-center hover:bg-stone-800 transition-colors"
              aria-label="Rechercher"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-950 text-white text-xs font-semibold tracking-wider uppercase hover:bg-stone-800 transition-all shadow-card-luxury"
          >
            <Home className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </button>

          <Link
            to="/boutique"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-stone-200 text-stone-900 text-xs font-semibold tracking-wider uppercase hover:border-stone-950 transition-all shadow-sm"
          >
            <span>Découvrir le vestiaire</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Quick Links Pills */}
      <div className="max-w-4xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickLinks.map((link, idx) => (
            <button
              key={idx}
              onClick={link.action}
              className="p-4 bg-white border border-stone-200/80 rounded-2xl shadow-sm hover:border-stone-950 hover:shadow-card-luxury transition-all text-center group"
            >
              <span className="font-serif text-xs sm:text-sm font-medium text-stone-800 group-hover:text-stone-950">
                {link.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Products Showcase */}
      {popularProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-stone-200/60">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">
                Sélection Stell's Hope
              </span>
              <h2 className="font-serif text-2xl font-medium text-stone-950 mt-1">
                Les Pièces Signatures
              </h2>
            </div>
            <Link
              to="/boutique"
              className="text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-stone-950 flex items-center gap-1"
            >
              <span>Tout voir</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {popularProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={onProductClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}