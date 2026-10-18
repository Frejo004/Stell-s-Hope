import { useState, useEffect, useMemo } from 'react';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import { getImageUrl } from '../utils/imageUtils';
import { productService } from '../services/productService';
import { formatPrice } from '../utils';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Headphones, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import SEO from '../components/SEO';

interface HomePageProps {
  products?: Product[];
  onProductClick: (product: Product) => void;
  onCategoryChange: (category: string) => void;
}

export default function HomePage({ products, onProductClick, onCategoryChange }: HomePageProps) {
  // State pour le slider hero
  const [currentSlide, setCurrentSlide] = useState(0);

  // State pour les sections
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestsellers, setBestsellers] = useState<Product[]>([]);

  // State pour la grille de produits dynamique
  const [gridProducts, setGridProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [gridLoading, setGridLoading] = useState(true);

  // Configuration des slides du hero avec univers éditorial
  const heroSlides = [
    {
      id: 1,
      image: '/hero_section_images/1.png',
      mobileImage: '/hero_section_images/square_1.png',
      tag: "Collection Femme",
      title: "Élégance Contemporaine",
      subtitle: "Des coupes fluides et raffinées confectionnées pour sublimer chaque silhouette.",
      category: 'femme',
      position: 'left',
      accentColor: 'from-[#F9EFE7] via-[#FAF5F0] to-[#FAF9F6]'
    },
    {
      id: 2,
      image: '/hero_section_images/2.png',
      mobileImage: '/hero_section_images/square_2.png',
      tag: "Collection Homme",
      title: "Allure & Précision",
      subtitle: "L'art du vestiaire masculin moderne : des pièces structurées aux finitions irréprochables.",
      category: 'homme',
      position: 'right',
      accentColor: 'from-[#EBF0F5] via-[#F4F6F9] to-[#FAF9F6]'
    },
    {
      id: 3,
      image: '/hero_section_images/3.png',
      mobileImage: '/hero_section_images/square_3.png',
      tag: "Accessoires & Maroquinerie",
      title: "Le Détail Singulier",
      subtitle: "Les pièces maîtresses qui transforment et rehaussent votre style au quotidien.",
      category: 'accessories',
      position: 'left',
      accentColor: 'from-[#F3ECE8] via-[#FAF6F4] to-[#FAF9F6]'
    }
  ];

  // Auto-rotation du slider (6 secondes)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Chargement initial des catégories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await productService.getCategories();
        setCategories(fetchedCategories.data || fetchedCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, []);

  // Chargement des produits de la grille dynamique
  useEffect(() => {
    const loadGridProducts = async () => {
      setGridLoading(true);
      try {
        const categoryId = selectedCategory === 'All'
          ? undefined
          : categories.find(c => c.name === selectedCategory)?.id;

        const response = await productService.getProducts({
          per_page: 8,
          sort_by: 'created_at',
          sort_direction: 'desc',
          ...(selectedCategory !== 'All' && { category: categoryId }),
        });

        setGridProducts(response.data);
      } catch (error) {
        console.error('Error loading grid products:', error);
      } finally {
        setGridLoading(false);
      }
    };

    if (selectedCategory === 'All' || categories.length > 0) {
      loadGridProducts();
    }
  }, [selectedCategory, categories]);

  // Chargement des produits phares
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const [featured, best] = await Promise.all([
          productService.getFeaturedProducts(),
          productService.getBestsellers()
        ]);
        setFeaturedProducts(featured);
        setBestsellers(best);
      } catch (error) {
        console.error('Error loading featured/bestseller products:', error);
      }
    };
    loadProducts();
  }, []);

  const bestSellersList = bestsellers.length > 0 ? bestsellers : (products || []).filter(product => product.is_bestseller).slice(0, 4);

  const topCategories = useMemo(() => {
    return ['All', ...categories.slice(0, 5).map(c => c.name)];
  }, [categories]);

  return (
    <div className="bg-[#FAF9F6] text-stone-900 selection:bg-rose-200 selection:text-stone-950">
      <SEO
        title="Maison de Haute Couture & Créations d'Exception"
        description="Plongez dans l'univers Stell's Hope : pièces haute couture d'exception, coupes modernes et matières nobles sélectionnées avec rigueur."
      />

      {/* ─── Hero Slider Section ────────────────────────────────────────── */}
      <section className="relative min-h-[580px] sm:min-h-[680px] lg:h-[calc(100vh-6rem)] max-h-[900px] overflow-hidden border-b border-stone-200/50">
        {heroSlides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Fond dégradé subtil & soyeux */}
              <div className={`absolute inset-0 bg-gradient-to-br ${slide.accentColor}`} />

              {/* Image Hero Desktop & Mobile */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className={`hidden lg:block absolute h-full w-auto object-contain transition-transform duration-1000 ease-out ${
                    slide.position === 'right' ? 'left-1/3' : 'right-4'
                  } ${isActive ? 'scale-100' : 'scale-105'}`}
                  style={{ maxWidth: '60%' }}
                />

                <img
                  src={slide.mobileImage}
                  alt={slide.title}
                  className="lg:hidden absolute inset-0 w-full h-full object-cover object-center opacity-85"
                />
              </div>

              {/* Contenu textuel */}
              <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center">
                <div className={`w-full lg:max-w-xl py-12 ${slide.position === 'right' ? 'lg:ml-auto' : ''}`}>
                  <div className={`space-y-4 transition-all duration-700 delay-200 transform ${
                    isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}>
                    {/* Tag Éditorial */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 backdrop-blur-md rounded-full border border-stone-200/60 shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                      <span className="text-[11px] font-semibold tracking-widest uppercase text-stone-800">
                        {slide.tag}
                      </span>
                    </div>

                    {/* Titre Serif Majestueux */}
                    <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-stone-950 leading-[1.08]">
                      {slide.title}
                    </h1>

                    {/* Sous-titre */}
                    <p className="text-sm sm:text-base text-stone-600 font-normal leading-relaxed max-w-md">
                      {slide.subtitle}
                    </p>

                    {/* Bouton d'action CTA */}
                    <div className="pt-2">
                      <button
                        onClick={() => onCategoryChange(slide.category)}
                        className="group inline-flex items-center gap-3 px-7 py-3.5 bg-stone-950 hover:bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                      >
                        <span>Découvrir la collection</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Contrôles du slider (Flèches minimalistes & Barres d'états) */}
        <div className="absolute bottom-6 left-6 sm:left-12 z-20 flex items-center gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1 rounded-full transition-all duration-500 ${
                index === currentSlide ? 'w-10 bg-stone-950' : 'w-3 bg-stone-300 hover:bg-stone-400'
              }`}
              aria-label={`Aller à la diapositive ${index + 1}`}
            />
          ))}
        </div>

        <div className="hidden sm:flex absolute bottom-6 right-12 z-20 items-center gap-2">
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-stone-200/60 flex items-center justify-center text-stone-800 hover:bg-stone-950 hover:text-white transition-all shadow-sm"
            aria-label="Diapositive précédente"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-stone-200/60 flex items-center justify-center text-stone-800 hover:bg-stone-950 hover:text-white transition-all shadow-sm"
            aria-label="Diapositive suivante"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ─── Piliers de Confiance & Réassurance ────────────────────────── */}
      <section className="py-8 border-b border-stone-200/50 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center shrink-0 text-stone-800">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-950">Livraison Offerte</h4>
                <p className="text-[11px] text-stone-500 mt-0.5">Dès 50 000 FCFA d'achats</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center shrink-0 text-stone-800">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-950">Paiement Garanti</h4>
                <p className="text-[11px] text-stone-500 mt-0.5">Wave, Orange, MTN & Cartes</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center shrink-0 text-stone-800">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-950">Retours 30 Jours</h4>
                <p className="text-[11px] text-stone-500 mt-0.5">Échange simple et rapide</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center shrink-0 text-stone-800">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-950">Service Client</h4>
                <p className="text-[11px] text-stone-500 mt-0.5">Accompagnement 7j/7</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Bento Grid : Les Collections Emblématiques ────────────────── */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">
              Sélection Stell's Hope
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-950 font-normal mt-1">
              Les Univers de la Maison
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mt-2 md:mt-0 font-normal">
            Explorez nos vestiaires soigneusement pensés pour allier confort absolu et élégance affirmée.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Bloc Femme (Mise en avant principale - 7 cols) */}
          <div
            onClick={() => onCategoryChange('femme')}
            className="group relative md:col-span-7 h-[420px] sm:h-[480px] rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-card-lg transition-all duration-500"
          >
            <img
              src="/hero_section_images/1.png"
              alt="Collection Femme"
              className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
              <span className="inline-block text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full">
                À la Une
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal">Vestiaire Féminin</h3>
              <p className="text-xs text-stone-200/90 max-w-sm font-light">
                Robes d'exception, ensembles structurés et pièces essentielles du quotidien.
              </p>
              <div className="pt-2 flex items-center text-xs font-semibold tracking-wider uppercase gap-2 group-hover:underline">
                <span>Découvrir</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>

          {/* Deux Blocs Droite (Homme & Accessoires - 5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {/* Homme */}
            <div
              onClick={() => onCategoryChange('homme')}
              className="group relative h-[200px] sm:h-[228px] rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-card-lg transition-all duration-500"
            >
              <img
                src="/hero_section_images/2.png"
                alt="Collection Homme"
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white space-y-1">
                <h3 className="font-serif text-xl sm:text-2xl font-normal">L'Homme Élégant</h3>
                <div className="flex items-center text-[11px] font-semibold tracking-wider uppercase gap-1.5 group-hover:underline">
                  <span>Voir la collection</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>

            {/* Accessoires */}
            <div
              onClick={() => onCategoryChange('accessories')}
              className="group relative h-[200px] sm:h-[228px] rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-card-lg transition-all duration-500"
            >
              <img
                src="/hero_section_images/3.png"
                alt="Accessoires"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white space-y-1">
                <h3 className="font-serif text-xl sm:text-2xl font-normal">Accessoires & Détails</h3>
                <div className="flex items-center text-[11px] font-semibold tracking-wider uppercase gap-1.5 group-hover:underline">
                  <span>Explorer</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Grille des Nouveautés Dynamique ─────────────────────────────── */}
      <section className="py-16 bg-white border-y border-stone-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">
              Nouveautés en rayon
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-950 font-normal mt-1">
              Les Dernières Pièces
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-2 font-normal">
              Des nouveautés ajoutées chaque semaine pour enrichir votre garde-robe.
            </p>

            {/* Onglets de Catégories modernes en forme de pastilles */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {topCategories.map((tab) => {
                const isSelected = selectedCategory === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setSelectedCategory(tab)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                      isSelected
                        ? 'bg-stone-950 text-white shadow-sm'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                    }`}
                  >
                    {tab === 'All' ? 'Toutes les pièces' : tab}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grille de Produits */}
          {gridLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse space-y-3">
                  <div className="bg-stone-100 rounded-2xl aspect-[3/4]" />
                  <div className="h-4 bg-stone-100 rounded w-3/4" />
                  <div className="h-4 bg-stone-100 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {gridProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductClick={onProductClick}
                />
              ))}
            </div>
          )}

          {/* Bouton Voir Toute la Boutique */}
          <div className="mt-12 text-center">
            <button
              onClick={() => onCategoryChange('all')}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs uppercase tracking-widest font-semibold rounded-full transition-all duration-200 hover:scale-[1.02]"
            >
              <span>Accéder à tout le catalogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ─── Bannière Éditoriale Haute Couture ─────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F4EFEB] rounded-3xl overflow-hidden border border-stone-200/60 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5 h-[340px] sm:h-[420px] overflow-hidden">
              <img
                src="https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg"
                alt="L'Art du Style"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 space-y-4">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-stone-500">
                La Philosophie Stell's Hope
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-stone-950 font-normal leading-tight">
                Quand l'élégance intemporelle rencontre la modernité urbaine.
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light max-w-lg">
                Chaque création est pensée pour traverser les saisons avec panache. Matières sélectionnées, coupes précises et finitions soignées pour vous accompagner en toutes occasions.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onCategoryChange('all')}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-stone-950 border-b-2 border-stone-950 pb-1 hover:text-stone-600 hover:border-stone-600 transition-colors"
                >
                  <span>Explorer notre sélection signature</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Sélection Best-Sellers ────────────────────────────────────── */}
      {bestSellersList.length > 0 && (
        <section className="py-16 bg-white border-t border-stone-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">
                  Les Favoris de la Communauté
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-stone-950 font-normal mt-1">
                  Nos Pièces Coup de Cœur
                </h2>
              </div>
              <button
                onClick={() => onCategoryChange('all')}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-stone-950 transition-colors uppercase tracking-wider"
              >
                <span>Tout afficher</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {bestSellersList.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductClick={onProductClick}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Club Privilège Newsletter ─────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-stone-950 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
          <span className="text-[11px] font-semibold tracking-widest uppercase text-rose-300">
            Rejoignez le Cercle Privilège
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight">
            Recevez 10% sur votre première commande
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-md mx-auto font-light leading-relaxed">
            Inscrivez-vous pour accéder en exclusivité à nos ventes privées, nouveautés et conseils de style.
          </p>
          <div className="max-w-md mx-auto pt-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Merci de votre inscription au Club Stell\'s Hope !');
              }}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="email"
                required
                placeholder="Votre adresse email..."
                className="flex-1 px-5 py-3 rounded-full bg-stone-900 border border-stone-800 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-600"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-stone-950 hover:bg-stone-200 text-xs uppercase tracking-widest font-semibold rounded-full transition-all duration-200 shadow-md"
              >
                Rejoindre
              </button>
            </form>
            <p className="text-[10px] text-stone-500 mt-2">
              Désabonnement en un clic à tout moment. Vos données restent strictement confidentielles.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
