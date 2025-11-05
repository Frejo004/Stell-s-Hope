import { useState, useEffect, useMemo } from 'react';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';

interface HomePageProps {
  products: Product[]; // Gardé pour les sections existantes comme Trending/Feature
  onProductClick: (product: Product) => void;
  onCategoryChange: (category: string) => void;
}

export default function HomePage({ products, onProductClick, onCategoryChange }: HomePageProps) {
  // State pour le slider hero
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // State pour les sections qui ne changent pas (Trending, etc.)
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestsellers, setBestsellers] = useState<Product[]>([]);

  // State pour la nouvelle grille de produits dynamique
  const [gridProducts, setGridProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [gridLoading, setGridLoading] = useState(true);

  // Configuration des slides du hero
  const heroSlides = [
    {
      id: 1,
      image: '/hero_section_images/1.png',
      title: "Femmes",
      description: "Découvrez notre collection exclusive de mode féminine. Qualité supérieure et style intemporel pour la femme moderne.",
      category: 'femme',
      position: 'left',
      bgGradient: 'from-pink-100 via-rose-50 to-orange-50',
      mobilePosition: 'object-right' // Personnage à droite
    },
    {
      id: 2,
      image: '/hero_section_images/2.png',
      title: "Hommes",
      description: "Découvrez notre collection exclusive de mode masculine. Qualité supérieure et style intemporel pour l'homme moderne.",
      category: 'homme',
      position: 'right',
      bgGradient: 'from-teal-100 via-cyan-50 to-blue-50',
      mobilePosition: 'object-left' // Personnage à gauche
    },
    {
      id: 3,
      image: '/hero_section_images/3.png',
      title: "Accessoires",
      description: "Découvrez notre collection exclusive d'accessoires. Qualité supérieure et style intemporel pour l'homme moderne.",
      category: 'accessoires',
      position: 'left',
      bgGradient: 'from-purple-100 via-pink-50 to-indigo-50',
      mobilePosition: 'object-right' // Personnage à droite
    }
  ];

  // Auto-rotation du slider toutes les 3 secondes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    
    return () => clearInterval(timer);
  }, []);

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

  // Chargement des produits de la grille en fonction de la catégorie sélectionnée
  useEffect(() => {
    const loadGridProducts = async () => {
      setGridLoading(true);
      try {
        const categoryId = selectedCategory === 'All' 
          ? undefined 
          : categories.find(c => c.name === selectedCategory)?.id;

        const response = await productService.getProducts({
          per_page: 12,
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

    // Ne pas charger si les catégories ne sont pas encore là (sauf pour 'All')
    if (selectedCategory === 'All' || categories.length > 0) {
      loadGridProducts();
    }
  }, [selectedCategory, categories]);

  // Logique pour les sections Trending/Bestsellers (inchangée)
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

  const bestSellers = bestsellers.length > 0 ? bestsellers : products.filter(product => product.is_bestseller).slice(0, 3);
  const newProducts = featuredProducts.length > 0 ? featuredProducts : products.filter(product => product.is_featured).slice(0, 3);

  // Génère les onglets de catégories à partir des catégories chargées
  const topCategories = useMemo(() => {
    // Simplification: on prend les 6 premières catégories de l'API
    return ['All', ...categories.slice(0, 6).map(c => c.name)];
  }, [categories]);

  return (
    <div>
      {/* Hero Slider Section */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Slides Container */}
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide 
                ? 'opacity-100' 
                : 'opacity-0'
            }`}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient}`} />
            
            {/* Background Image - Desktop: positioned left/right, Mobile: centered background */}
            <div className={`absolute inset-0 transition-all duration-1000 ${
              index === currentSlide ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
            }`}>
              {/* Desktop Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className={`hidden lg:block absolute h-full w-auto object-contain ${
                  slide.position === 'right' ? 'left-1/4' : 'right-0'
                }`}
                style={{ maxWidth: '65%' }}
              />
              
              {/* Mobile Image - Full background */}
              <img
                src={slide.image}
                alt={slide.title}
                className={`lg:hidden absolute inset-0 w-full h-full object-cover ${slide.mobilePosition} opacity-90`}
              />
            </div>
            
            {/* Content Container - Desktop: side positioned, Mobile: bottom centered */}
            <div className="relative h-full flex items-end lg:items-center">
              <div className="container mx-auto px-6 md:px-12 pb-24 lg:pb-0">
                {/* Text Content */}
                <div className={`lg:max-w-2xl ${
                  slide.position === 'right' ? 'lg:ml-auto lg:text-right' : 'lg:mr-auto lg:text-left'
                } text-center lg:text-left`}>
                  <div className={`transform transition-all duration-1000 delay-300 ${
                    index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-light mb-4 lg:mb-6 text-gray-800 leading-tight">
                      {slide.title}
                    </h1>
                    <p className={`hidden lg:block text-gray-600 mb-8 max-w-lg text-base md:text-lg leading-relaxed ${
                      slide.position === 'right' ? 'ml-auto' : 'mr-auto'
                    }`}>
                      {slide.description}
                    </p>
                    <button 
                      onClick={() => onCategoryChange(slide.category)}
                      className="group relative inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm lg:bg-transparent px-6 py-3 lg:px-0 lg:py-0 rounded-full lg:rounded-none border-b-0 lg:border-b-2 border-gray-800 text-gray-800 hover:bg-rose-500 lg:hover:bg-transparent hover:text-white lg:hover:text-rose-500 lg:hover:border-rose-500 transition-all duration-300 text-sm md:text-base font-medium shadow-lg lg:shadow-none"
                    >
                      SHOP NOW
                      <svg 
                        className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Gradient Overlay for better text readability */}
            <div className="lg:hidden absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />
          </div>
        ))}

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-500 rounded-full ${
                index === currentSlide 
                  ? 'w-12 h-3 bg-gray-800' 
                  : 'w-3 h-3 bg-gray-400 hover:bg-gray-600'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </section>

      {/* New Products Section (modifié) */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-800 mb-8">NEW PRODUCT</h2>
            <div className="flex flex-wrap justify-center gap-4 md:space-x-8 mb-12">
              {topCategories.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedCategory(tab)}
                  className={`text-xs md:text-sm font-medium pb-2 ${
                    selectedCategory === tab
                      ? 'text-red-500 border-b-2 border-red-500' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid (modifié) */}
          {gridLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-300"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {gridProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductClick={onProductClick}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Collection Banner (inchangé) */}
      <section className="relative min-h-[300px] md:h-96 bg-gradient-to-r from-pink-50 to-blue-50 overflow-hidden">
        <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/3 h-48 md:h-96">
            <img
              src="https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg"
              alt="Collection"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 text-center p-6 md:p-0">
            <p className="text-red-500 text-xs md:text-sm font-medium mb-2">THE CHLOE COLLECTION</p>
            <h2 className="text-2xl md:text-4xl font-light text-gray-800 mb-4 md:mb-6">The Project Jacket</h2>
            <button className="border-b-2 border-gray-800 text-gray-800 pb-1 hover:border-gray-600 transition-colors text-sm md:text-base">
              SHOP NOW
            </button>
          </div>
          <div className="w-full md:w-1/3 h-48 md:h-96">
            <img
              src="https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg"
              alt="Collection"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Trending Products (inchangé) */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div>
              <h3 className="text-xl font-medium text-gray-800 mb-6 border-b-2 border-red-500 pb-2 inline-block">
                HOT TREND
              </h3>
              <div className="space-y-4">
                {newProducts.slice(0, 3).map((product) => (
                  <div key={product.id} className="flex items-center space-x-4">
                    <img
                      src={product.images?.[0] || '/placeholder.jpg'}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-medium text-gray-800">{product.name}</h4>
                      <div className="flex items-center space-x-1 my-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xs">★</span>
                        ))}
                      </div>
                      <p className="font-semibold text-gray-800">${Number(product.price || 0).toFixed(2)} €</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium text-gray-800 mb-6">BEST SELLER</h3>
              <div className="space-y-4">
                {bestSellers.slice(0, 3).map((product) => (
                  <div key={product.id} className="flex items-center space-x-4">
                    <img
                      src={product.images?.[0] || '/placeholder.jpg'}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-medium text-gray-800">{product.name}</h4>
                      <div className="flex items-center space-x-1 my-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xs">★</span>
                        ))}
                      </div>
                      <p className="font-semibold text-gray-800">{Number(product.price || 0).toFixed(2)} €</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium text-gray-800 mb-6">FEATURE</h3>
              <div className="space-y-4">
                {products.slice(0, 3).map((product) => (
                  <div key={product.id} className="flex items-center space-x-4">
                    <img
                      src={product.images?.[0] || '/placeholder.jpg'}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-medium text-gray-800">{product.name}</h4>
                      <div className="flex items-center space-x-1 my-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xs">★</span>
                        ))}
                      </div>
                      <p className="font-semibold text-gray-800">{Number(product.price || 0).toFixed(2)} €</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sale Banner (inchangé) */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2">
            <img
              src="https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg"
              alt="Sale"
              className="w-full h-60 md:h-80 object-cover rounded-lg"
            />
          </div>
          <div className="w-full md:w-1/2 text-center md:text-left">
            <p className="text-red-500 text-xs md:text-sm font-medium mb-2">DISCOUNT</p>
            <h2 className="text-3xl md:text-5xl font-light text-red-500 mb-4">Summer 2024</h2>
            <p className="text-xl md:text-2xl font-light text-gray-800 mb-6">SALE 50%</p>
            
            <div className="flex justify-center md:justify-start space-x-4 md:space-x-6 mb-8">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-800">30</div>
                <div className="text-xs md:text-sm text-gray-600">Day</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-800">12</div>
                <div className="text-xs md:text-sm text-gray-600">Hour</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-800">26</div>
                <div className="text-xs md:text-sm text-gray-600">Min</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-800">20</div>
                <div className="text-xs md:text-sm text-gray-600">Sec</div>
              </div>
            </div>
            
            <button className="border-b-2 border-gray-800 text-gray-800 pb-1 hover:border-gray-600 transition-colors text-sm md:text-base">
              SHOP NOW
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
