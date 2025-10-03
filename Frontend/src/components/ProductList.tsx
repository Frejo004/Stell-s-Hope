import React from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useProductFilters } from '../hooks/useProductFilters';
import Pagination from './Pagination';

const ProductList: React.FC = () => {
  const { getFilters, page, setPage } = useProductFilters();
  const { products, loading, error } = useProducts(getFilters());
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Erreur: {error}</div>;

  const productsData = products?.data || products || [];
  const pagination = products?.meta || products?.pagination;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {productsData.map((product: any) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={product.images?.[0] || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">{product.price}€</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-2 rounded-full ${
                      isInWishlist(product.id) 
                        ? 'text-red-500 bg-red-50' 
                        : 'text-gray-400 bg-gray-50'
                    }`}
                  >
                    ♥
                  </button>
                  <button
                    onClick={() => addToCart(product.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pagination && (
        <Pagination
          currentPage={page}
          totalPages={pagination.last_page || Math.ceil(pagination.total / pagination.per_page)}
          onPageChange={setPage}
          totalItems={pagination.total}
          itemsPerPage={pagination.per_page}
        />
      )}
    </div>
  );
};

export default ProductList;