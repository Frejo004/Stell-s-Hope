import React from 'react';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { useQueryState, parseAsInteger } from 'nuqs';
import Pagination from './Pagination';

const WishlistGrid: React.FC = () => {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const { wishlist, loading, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (loading) return <div className="text-center py-8">Chargement...</div>;

  // Simulate pagination for wishlist (client-side)
  const itemsPerPage = 12;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedWishlist = wishlist.slice(startIndex, endIndex);
  const totalPages = Math.ceil(wishlist.length / itemsPerPage);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Mes Favoris</h2>
      
      {wishlist.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Votre liste de favoris est vide
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedWishlist.map((item: any) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={item.product?.images?.[0] || '/placeholder.jpg'}
                  alt={item.product?.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.product?.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {item.product?.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">
                      {item.product?.price}€
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleWishlist(item.product_id)}
                        className="p-2 rounded-full text-red-500 bg-red-50 hover:bg-red-100"
                      >
                        ♥
                      </button>
                      <button
                        onClick={() => addToCart(item.product_id)}
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

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              totalItems={wishlist.length}
              itemsPerPage={itemsPerPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default WishlistGrid;