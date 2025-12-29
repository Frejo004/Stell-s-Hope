import { useNavigate } from 'react-router-dom';
import { useInfiniteProducts } from '../hooks/useInfiniteProducts';
import { useProductFilters } from '../hooks/useProductFilters';
import ProductCard from './ProductCard';

const InfiniteProductList: React.FC = () => {
  const navigate = useNavigate();
  const { getFilters } = useProductFilters();
  const { products, loading, error, isFetching, hasMore } = useInfiniteProducts(getFilters());

  const handleProductClick = (product: any) => {
    navigate(`/product/${product.id}`);
  };

  if (loading && products.length === 0) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-300"></div>
    </div>
  );

  if (error) return <div className="text-center py-8 text-red-600">Erreur: {error}</div>;

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product: any, index: number) => (
          <ProductCard
            key={`product-${product.id}-${index}`}
            product={product}
            onProductClick={handleProductClick}
          />
        ))}
      </div>

      {/* Loading indicator */}
      {isFetching && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rose-300"></div>
          <p className="mt-2 text-gray-500 text-sm">Chargement...</p>
        </div>
      )}

      {/* End message */}
      {!hasMore && products.length > 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">
          Vous avez tout vu !
        </div>
      )}

      {/* No products */}
      {!loading && products.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-gray-500 font-medium">Aucun produit trouvé</p>
          <p className="text-sm text-gray-400 mt-2">Essayez de modifier vos filtres</p>
        </div>
      )}
    </div>
  );
};

export default InfiniteProductList;