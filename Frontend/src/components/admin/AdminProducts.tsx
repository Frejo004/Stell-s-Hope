import { useState } from 'react';
import { Plus, Edit, Trash2, Search, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { useAdminProducts } from '../../hooks/useAdminData';
import { adminService } from '../../services/adminService';
import Toast from '../ui/Toast';
import ConfirmModal from '../ui/ConfirmModal';
import ProductEditModal from './ProductEditModal';

interface AdminProductsProps {
  onNavigate: (page: string) => void;
}

export default function AdminProducts({ onNavigate: _onNavigate }: AdminProductsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning', message: string } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean, productId: number, productName: string }>({ isOpen: false, productId: 0, productName: '' });
  const [editModal, setEditModal] = useState<{ isOpen: boolean, productId: number | null }>({ isOpen: false, productId: null });
  const { products, loading, pagination, refetch } = useAdminProducts();

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    const timeoutId = setTimeout(() => {
      refetch(1, value, selectedCategory, 'all', stockFilter, statusFilter, false);
    }, 300);
    return () => clearTimeout(timeoutId);
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
    setEditModal({ isOpen: true, productId: id });
  };

  const handleEditSuccess = () => {
    const message = editModal.productId ? 'Produit modifié avec succès' : 'Produit créé avec succès';
    setToast({ type: 'success', message });
    refetch(pagination.current_page, searchTerm, selectedCategory, priceFilter, stockFilter, statusFilter, false);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Catalogue de Produits</h1>
          <p className="text-slate-500 mt-1 font-medium">Gérez votre inventaire et vos fiches produits.</p>
        </div>
        <button
          onClick={() => setEditModal({ isOpen: true, productId: null })}
          className="bg-rose-500 text-white px-6 py-3 rounded-2xl hover:bg-rose-600 flex items-center justify-center space-x-2 shadow-lg shadow-rose-500/20 transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          <span className="font-bold">Nouveau Produit</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
              <input
                type="text"
                placeholder="Rechercher par nom, SKU ou description..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500/20 focus:bg-white transition-all font-medium text-slate-700"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-slate-50 rounded-2xl p-1 border border-slate-100">
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); refetch(1, searchTerm, e.target.value, 'all', stockFilter, statusFilter, false); }}
                className="bg-transparent border-none text-sm font-bold text-slate-600 focus:ring-0 px-4 py-2 cursor-pointer"
              >
                <option value="all">Toutes Catégories</option>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
                <option value="unisexe">Unisexe</option>
              </select>
            </div>

            <div className="flex items-center bg-slate-50 rounded-2xl p-1 border border-slate-100">
              <select
                value={stockFilter}
                onChange={(e) => { setStockFilter(e.target.value); refetch(1, searchTerm, selectedCategory, 'all', e.target.value, statusFilter, false); }}
                className="bg-transparent border-none text-sm font-bold text-slate-600 focus:ring-0 px-4 py-2 cursor-pointer"
              >
                <option value="all">Tout Stock</option>
                <option value="in-stock">En Stock</option>
                <option value="low-stock">Stock Faible</option>
                <option value="out-of-stock">Rupture</option>
              </select>
            </div>

            <div className="flex items-center bg-slate-50 rounded-2xl p-1 border border-slate-100">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); refetch(1, searchTerm, selectedCategory, 'all', stockFilter, e.target.value, false); }}
                className="bg-transparent border-none text-sm font-bold text-slate-600 focus:ring-0 px-4 py-2 cursor-pointer"
              >
                <option value="all">Tous Statuts</option>
                <option value="active">Actifs</option>
                <option value="inactive">Inactifs</option>
                <option value="featured">Vedettes</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Produit</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Catégorie</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Prix</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Inventaire</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Statut</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={product.images?.[0] || '/placeholder-image.jpg'}
                          alt={product.name}
                          className="w-14 h-14 object-cover rounded-2xl shadow-sm border border-slate-200 group-hover:scale-105 transition-transform"
                        />
                        {product.is_featured && (
                          <div className="absolute -top-2 -right-2 bg-amber-400 text-white p-1 rounded-full border-2 border-white shadow-sm">
                            <Plus className="w-2 h-2 rotate-45" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 leading-tight">{product.name}</div>
                        <div className="text-[10px] font-bold text-rose-500 uppercase tracking-tighter mt-1">SKU: {product.id.toString().padStart(4, '0')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="inline-flex px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-xl bg-slate-100 text-slate-600 border border-slate-200">
                      {typeof product.category === 'object' ? product.category?.name : product.category}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900">{Number(product.price || 0).toFixed(2)}€</span>
                      {product.originalPrice && (
                        <span className="text-[10px] text-slate-400 line-through">
                          {Number(product.originalPrice || 0).toFixed(2)}€
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${(product.stock_quantity || 0) > 10 ? 'bg-emerald-500' :
                        (product.stock_quantity || 0) > 0 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}></div>
                      <span className={`text-sm font-bold ${(product.stock_quantity || 0) > 0 ? 'text-slate-700' : 'text-rose-500'
                        }`}>
                        {product.stock_quantity || 0} en stock
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${product.is_active
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}>
                      {product.is_active ? (
                        <><CheckCircle className="w-3 h-3 mr-1" /> Actif</>
                      ) : (
                        <><AlertCircle className="w-3 h-3 mr-1" /> Inactif</>
                      )}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleEdit(product.id)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        title="Modifier"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => window.open(`/product/${product.id}`, '_blank')}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                        title="Voir sur le site"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product.id, product.name)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        title="Supprimer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Premium */}
        <div className="bg-slate-50/50 px-8 py-5 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Affichage de <span className="text-slate-900">{((pagination.current_page - 1) * pagination.per_page) + 1}</span> à{' '}
              <span className="text-slate-900">{Math.min(pagination.current_page * pagination.per_page, pagination.total)}</span> sur{' '}
              <span className="text-slate-900">{pagination.total}</span> produits
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => refetch(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                Précédent
              </button>
              <div className="flex space-x-1">
                {[...Array(Math.min(5, pagination.last_page))].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => refetch(i + 1)}
                    className={`w-9 h-9 flex items-center justify-center text-xs font-bold rounded-xl transition-all ${pagination.current_page === i + 1
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => refetch(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                Suivant
              </button>
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

      <ProductEditModal
        isOpen={editModal.isOpen}
        productId={editModal.productId}
        onClose={() => setEditModal({ isOpen: false, productId: null })}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
