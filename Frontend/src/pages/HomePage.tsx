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
  // State pour les sections qui ne changent pas (Trending, etc.)
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestsellers, setBestsellers] = useState<Product[]>([]);

  // State pour la nouvelle grille de produits dynamique
  const [gridProducts, setGridProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [gridLoading, setGridLoading] = useState(true);

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
      {/* Hero Grid Section (inchangé) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        <div className="lg:col-span-6 relative bg-gradient-to-br from-pink-100 to-orange-100 flex items-center min-h-[50vh] lg:min-h-screen">
          <div className="absolute inset-0">
            <img
              src="https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg"
              alt="Women's Fashion"
              className="w-full h-full object-cover opacity-80"
            />
          </div>
          <div className="relative z-10 p-6 md:p-12 text-left">
            <h2 className="text-3xl md:text-5xl font-light mb-4 text-gray-800">Women's fashion</h2>
            <p className="text-gray-600 mb-6 max-w-md text-sm md:text-base">
              Sitamet, consectetur adipiscing elit, sed do eiusmod tempor incididunt labore edolore magna aliquam erat volutpat.
            </p>
            <button 
              onClick={() => onCategoryChange('femme')}
              className="border-b-2 border-gray-800 text-gray-800 pb-1 hover:border-gray-600 transition-colors text-sm md:text-base"
            >
              SHOP NOW
            </button>
          </div>
        </div>
        <div className="lg:col-span-6 grid grid-cols-2 grid-rows-2">
          <div 
            className="relative bg-gradient-to-br from-teal-100 to-green-100 flex items-center justify-center cursor-pointer group min-h-[25vh] lg:min-h-[50vh]"
            onClick={() => onCategoryChange('homme')}
          >
            <div className="absolute inset-0">
              <img
                src="https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg"
                alt="Men's Fashion"
                className="w-full h-full object-cover opacity-70"
              />
            </div>
            <div className="relative z-10 text-center text-gray-800 p-4">
              <h3 className="text-lg md:text-2xl font-light mb-2">Men's fashion</h3>
              <p className="text-xs md:text-sm mb-4">358 Items</p>
              <div className="border-b border-gray-800 group-hover:border-gray-600 transition-colors text-xs md:text-sm">
                SHOP NOW
              </div>
            </div>
          </div>
          <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center min-h-[25vh] lg:min-h-[50vh]">
            <div className="absolute inset-0">
              <img
                src="https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg"
                alt="Kid's Fashion"
                className="w-full h-full object-cover opacity-70"
              />
            </div>
            <div className="relative z-10 text-center text-gray-800 p-4">
              <h3 className="text-lg md:text-2xl font-light mb-2">Kid's fashion</h3>
              <p className="text-xs md:text-sm mb-4">273 Items</p>
              <div className="border-b border-gray-800 text-xs md:text-sm">SHOP NOW</div>
            </div>
          </div>
          <div className="relative bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center min-h-[25vh] lg:min-h-[50vh]">
            <div className="absolute inset-0">
              <img
                src="https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg"
                alt="Cosmetics"
                className="w-full h-full object-cover opacity-70"
              />
            </div>
            <div className="relative z-10 text-center text-gray-800 p-4">
              <h3 className="text-lg md:text-2xl font-light mb-2">Cosmetics</h3>
              <p className="text-xs md:text-sm mb-4">159 Items</p>
              <div className="border-b border-gray-800 text-xs md:text-sm">SHOP NOW</div>
            </div>
          </div>
          <div 
            className="relative bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center cursor-pointer group min-h-[25vh] lg:min-h-[50vh]"
            onClick={() => onCategoryChange('accessoires')}
          >
            <div className="absolute inset-0">
              <img
                src="https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg"
                alt="Accessories"
                className="w-full h-full object-cover opacity-70"
              />
            </div>
            <div className="relative z-10 text-center text-gray-800 p-4">
              <h3 className="text-lg md:text-2xl font-light mb-2">Accessories</h3>
              <p className="text-xs md:text-sm mb-4">792 Items</p>
              <div className="border-b border-gray-800 group-hover:border-gray-600 transition-colors text-xs md:text-sm">
                SHOP NOW
              </div>
            </div>
          </div>
        </div>
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
