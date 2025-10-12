import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { useAdminProducts } from '../../hooks/useAdminData';
import { adminService } from '../../services/adminService';
import Toast from '../ui/Toast';
import ConfirmModal from '../ui/ConfirmModal';

interface AdminProductsProps {
  onNavigate: (page: string) => void;
}

export default function AdminProducts({ onNavigate }: AdminProductsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState<{type: 'success' | 'error' | 'warning', message: string} | null>(null);
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, productId: number, productName: string}>({isOpen: false, productId: 0, productName: ''});
  const { products, loading, pagination, refetch } = useAdminProducts();

  const applyFilters = () => {
    refetch(1, searchTerm, selectedCategory, priceFilter, stockFilter, statusFilter, false);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setTimeout(() => {
      refetch(1, value, selectedCategory, priceFilter, stockFilter, statusFilter, false);
    }, 300);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    refetch(1, searchTerm, category, priceFilter, stockFilter, statusFilter, false);
  };

  const handleDeleteClick = (id: number, name: string) => {
    setConfirmModal({ isOpen: true, productId: id, productName: name });
  };

  const handleDeleteConfirm = async () => {
    try {
      await adminService.deleteProduct(confirmModal.productId);
      setToast({ type: 'success', message: 'Produit supprimé avec succès' });
      refetch(pagination.current_page, searchTerm, selectedCategory, priceFilter, stockFilter, statusFilter, false);
    } catch (error) {
      setToast({ type: 'error', message: 'Erreur lors de la suppression' });
    }
    setConfirmModal({ isOpen: false, productId: 0, productName: '' });
  };

  const handleEdit = (id: number) => {
    // TODO: Ouvrir modal d'édition
    setToast({ type: 'warning', message: 'Fonctionnalité d\'édition en cours de développement' });
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Produits</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Nouveau Produit</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes catégories</option>
              <option value="homme">Homme</option>
              <option value="femme">Femme</option>
              <option value="unisexe">Unisexe</option>
            </select>
            <select
              value={priceFilter}
              onChange={(e) => { setPriceFilter(e.target.value); setTimeout(() => refetch(1, searchTerm, selectedCategory, e.target.value, stockFilter, statusFilter, false), 100); }}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous prix</option>
              <option value="0-25">0€ - 25€</option>
              <option value="25-50">25€ - 50€</option>
              <option value="50-100">50€ - 100€</option>
              <option value="100+">100€+</option>
            </select>
            <select
              value={stockFilter}
              onChange={(e) => { setStockFilter(e.target.value); setTimeout(() => refetch(1, searchTerm, selectedCategory, priceFilter, e.target.value, statusFilter, false), 100); }}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tout stock</option>
              <option value="in-stock">En stock</option>
              <option value="low-stock">Stock faible</option>
              <option value="out-of-stock">Rupture</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setTimeout(() => refetch(1, searchTerm, selectedCategory, priceFilter, stockFilter, e.target.value, false), 100); }}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="featured">Vedette</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={product.images?.[0] || '/placeholder-image.jpg'}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">ID: {product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      {product.category?.name || product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {Number(product.price || 0).toFixed(2)}€
                    {product.originalPrice && (
                      <div className="text-xs text-gray-500 line-through">
                        {Number(product.originalPrice || 0).toFixed(2)}€
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <span className={`font-medium ${
                      (product.stock_quantity || 0) > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {(product.stock_quantity || 0) > 0 ? `${product.stock_quantity} en stock` : 'Rupture'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-1">
                      {product.is_featured && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          Vedette
                        </span>
                      )}
                      {product.is_active ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Actif
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Inactif
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(product.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(product.id, product.name)}
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button 
              onClick={() => refetch(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Précédent
            </button>
            <button 
              onClick={() => refetch(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Affichage de <span className="font-medium">{((pagination.current_page - 1) * pagination.per_page) + 1}</span> à{' '}
                <span className="font-medium">{Math.min(pagination.current_page * pagination.per_page, pagination.total)}</span> sur{' '}
                <span className="font-medium">{pagination.total}</span> produits
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button 
                  onClick={() => refetch(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Précédent
                </button>
                {[...Array(pagination.last_page)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => refetch(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      pagination.current_page === i + 1
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  onClick={() => refetch(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Suivant
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Supprimer le produit"
        message={`Êtes-vous sûr de vouloir supprimer le produit "${confirmModal.productName}" ? Cette action est irréversible.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmModal({ isOpen: false, productId: 0, productName: '' })}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />
    </div>
  );
}