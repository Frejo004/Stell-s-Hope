import React from 'react';
import { useAdminProductFilters } from '../../hooks/useAdminFilters';
import { adminService } from '../../services/adminService';
import Pagination from '../Pagination';

const AdminProductList: React.FC = () => {
  const { 
    page, setPage, 
    search, setSearch, 
    category, setCategory, 
    status, setStatus,
    getFilters 
  } = useAdminProductFilters();

  const [products, setProducts] = React.useState<any>({ data: [], meta: {} });
  const [loading, setLoading] = React.useState(true);
  const [categories, setCategories] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          adminService.getAdminProducts(getFilters()),
          adminService.getCategories?.() || []
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, search, category, status]);

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await adminService.deleteProduct(id);
        // Refresh data
        const productsData = await adminService.getAdminProducts(getFilters());
        setProducts(productsData);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  if (loading) return <div className="text-center py-8">Chargement...</div>;

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          
          <select
            value={category || ''}
            onChange={(e) => {
              setCategory(e.target.value ? parseInt(e.target.value) : null);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <select
            value={status || ''}
            onChange={(e) => {
              setStatus(e.target.value || null);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </select>

          <button
            onClick={() => {
              setSearch('');
              setCategory(null);
              setStatus(null);
              setPage(1);
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Liste des produits */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prix
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.data.map((product: any) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={product.images?.[0] || '/placeholder.jpg'}
                      alt={product.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        SKU: {product.sku}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.category?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.price}€
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.stock_quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    product.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.is_active ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button className="text-indigo-600 hover:text-indigo-900">
                    Modifier
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          currentPage={page}
          totalPages={products.meta.last_page || 1}
          onPageChange={setPage}
          totalItems={products.meta.total || 0}
          itemsPerPage={products.meta.per_page || 15}
        />
      </div>
    </div>
  );
};

export default AdminProductList;