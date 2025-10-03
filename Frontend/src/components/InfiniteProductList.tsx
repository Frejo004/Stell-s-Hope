import React from 'react';
import { useInfiniteProducts } from '../hooks/useInfiniteProducts';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useProductFilters } from '../hooks/useProductFilters';

const InfiniteProductList: React.FC = () => {
  const { getFilters } = useProductFilters();
  const { products, loading, error, isFetching, hasMore } = useInfiniteProducts(getFilters());
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Erreur: {error}</div>;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product: any, index: number) => (
          <div key={`product-${product.id}-${index}`} className="group bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                src={product.images?.[0] || '/placeholder.jpg'}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2 rounded-full shadow-md ${
                    isInWishlist(product.id) 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white text-gray-600 hover:text-red-500'
                  }`}
                >
                  ♥
                </button>
                <button
                  onClick={() => console.log('Voir détails:', product.id)}
                  className="p-2 bg-white text-gray-600 rounded-full shadow-md hover:bg-green-600 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button
                  onClick={() => addToCart(product.id)}
                  className="p-2 bg-white text-gray-600 rounded-full shadow-md hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
              <p className="text-gray-500 text-sm mb-3 line-clamp-1">{product.description}</p>
              <div>
                <span className="text-lg font-semibold text-gray-900">{Number(product.price || 0).toFixed(2)} €</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      {isFetching && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Chargement de plus de produits...</p>
        </div>
      )}

      {/* End message */}
      {!hasMore && products.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          Vous avez vu tous les produits disponibles
        </div>
      )}

      {/* No products */}
      {!loading && products.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucun produit trouvé avec ces critères
        </div>
      )}
    </div>
  );
};

export default InfiniteProductList;