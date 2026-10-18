import { useState } from 'react';
import { Plus, Edit, Trash2, Search, AlertCircle, CheckCircle, ExternalLink, Sparkles } from 'lucide-react';
import { useAdminProducts } from '../../hooks/useAdminData';
import { adminService } from '../../services/adminService';
import Toast from '../ui/Toast';
import ConfirmModal from '../ui/ConfirmModal';
import ProductEditModal from './ProductEditModal';
import { formatPrice } from '../../utils';

interface AdminProductsProps {
  onNavigate: (page: string) => void;
}

export default function AdminProducts({ onNavigate: _onNavigate }: AdminProductsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceFilter] = useState('all');
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
      setToast({ type: 'success', message: 'Article supprimé du catalogue avec succès' });
      refetch(pagination.current_page, searchTerm, selectedCategory, priceFilter, stockFilter, statusFilter, false);
    } catch {
      setToast({ type: 'error', message: 'Erreur lors de la suppression de l\'article' });
    }
    setConfirmModal({ isOpen: false, productId: 0, productName: '' });
  };

  const handleEdit = (id: number) => {
    setEditModal({ isOpen: true, productId: id });
  };

  const handleEditSuccess = () => {
    const message = editModal.productId ? 'Article mis à jour avec succès' : 'Nouvel article ajouté au catalogue';
    setToast({ type: 'success', message });
    refetch(pagination.current_page, searchTerm, selectedCategory, priceFilter, stockFilter, statusFilter, false);
  };

  if (loading && !products.length) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-stone-300 border-t-stone-950 rounded-full animate-spin"></div>
          <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">Chargement du catalogue...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/60">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-terracotta-600">Atelier Création</span>
          <h1 className="font-serif text-3xl font-normal text-stone-950 mt-1">
            Catalogue des Pièces
          </h1>
          <p className="text-xs text-stone-500 font-light mt-1">
            Gestion des créations, fiches produits, déclinaisons de tailles et tarification en XOF.
          </p>
        </div>

        <button
          onClick={() => setEditModal({ isOpen: true, productId: null })}
          className="inline-flex items-center gap-2 bg-stone-950 hover:bg-black text-white px-6 py-3 rounded-full text-xs uppercase tracking-widest font-semibold shadow-md hover:shadow-lg transition-all hover:scale-[1.01] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-terracotta-400" />
          <span>Nouvelle Pièce</span>
        </button>
      </div>

      {/* ─── Barre de Recherche et Filtres d'Univers ─── */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200/80 p-5">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, référence SKU ou description..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200/80 rounded-2xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-950/10 focus:bg-white focus:border-stone-400 transition-all font-light"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Univers / Catégories */}
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); refetch(1, searchTerm, e.target.value, 'all', stockFilter, statusFilter, false); }}
              className="bg-stone-50 border border-stone-200/80 text-xs font-medium text-stone-700 rounded-2xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-stone-950/10 cursor-pointer"
            >
              <option value="all">Tous les Univers</option>
              <option value="femme">Femme</option>
              <option value="homme">Homme</option>
              <option value="accessoires">Accessoires</option>
              <option value="enfant">Enfant</option>
            </select>

            {/* Disponibilité Stock */}
            <select
              value={stockFilter}
              onChange={(e) => { setStockFilter(e.target.value); refetch(1, searchTerm, selectedCategory, 'all', e.target.value, statusFilter, false); }}
              className="bg-stone-50 border border-stone-200/80 text-xs font-medium text-stone-700 rounded-2xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-stone-950/10 cursor-pointer"
            >
              <option value="all">Tous Stocks</option>
              <option value="in-stock">En Stock</option>
              <option value="low-stock">Stock Limité</option>
              <option value="out-of-stock">Rupture</option>
            </select>

            {/* Statut Publication */}
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); refetch(1, searchTerm, selectedCategory, 'all', stockFilter, e.target.value, false); }}
              className="bg-stone-50 border border-stone-200/80 text-xs font-medium text-stone-700 rounded-2xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-stone-950/10 cursor-pointer"
            >
              <option value="all">Tous Statuts</option>
              <option value="active">Actif en boutique</option>
              <option value="inactive">Masqué / Brouillon</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── Table des Produits Haute Couture ─── */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-100">
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-stone-400 text-[10px]">Création & Réf</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-stone-400 text-[10px]">Univers</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-stone-400 text-[10px]">Prix</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-stone-400 text-[10px]">Disponibilité</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-stone-400 text-[10px]">Visibilité</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-stone-400 text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.length > 0 ? (
                products.map((product) => {
                  const image = product.images?.[0] || '/placeholder-image.jpg';
                  const categoryName = typeof product.category === 'object' ? product.category?.name : product.category;
                  const stock = product.stock_quantity ?? product.stock ?? 0;

                  return (
                    <tr key={product.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="relative shrink-0">
                            <img
                              src={image}
                              alt={product.name}
                              className="w-12 h-16 object-cover rounded-xl border border-stone-200/70 bg-stone-50"
                            />
                            {product.is_featured && (
                              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center shadow-xs">
                                <Sparkles className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-stone-900 truncate max-w-[220px]">
                              {product.name}
                            </p>
                            <p className="text-[10px] text-terracotta-600 font-mono mt-0.5">
                              SKU #{product.id.toString().padStart(4, '0')}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-stone-100 text-stone-700 border border-stone-200/60">
                          {categoryName || 'Collection'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-serif font-medium text-sm text-stone-950">
                            {formatPrice(product.price || 0)}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-[10px] text-stone-400 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            stock > 10 ? 'bg-emerald-500' : stock > 0 ? 'bg-amber-500' : 'bg-rose-500'
                          }`} />
                          <span className="text-stone-700 font-medium">
                            {stock > 0 ? `${stock} en atelier` : 'Rupture'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          product.is_active
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-stone-100 text-stone-600 border-stone-200'
                        }`}>
                          {product.is_active ? (
                            <><CheckCircle className="w-3 h-3 text-emerald-600" /> En ligne</>
                          ) : (
                            <><AlertCircle className="w-3 h-3 text-stone-400" /> Masqué</>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleEdit(product.id)}
                            className="p-2 text-stone-500 hover:text-stone-950 hover:bg-stone-100 rounded-xl transition-colors"
                            title="Modifier la fiche"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => window.open(`/product/${product.id}`, '_blank')}
                            className="p-2 text-stone-500 hover:text-stone-950 hover:bg-stone-100 rounded-xl transition-colors"
                            title="Aperçu boutique"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(product.id, product.name)}
                            className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                            title="Supprimer du catalogue"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-stone-400 italic">
                    Aucun article trouvé dans cette sélection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ─── Pagination ─── */}
        <div className="bg-stone-50/60 px-6 py-4 border-t border-stone-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <p className="text-stone-400 font-light">
              Affichage de <span className="font-medium text-stone-800">{((pagination.current_page - 1) * pagination.per_page) + 1}</span> à{' '}
              <span className="font-medium text-stone-800">{Math.min(pagination.current_page * pagination.per_page, pagination.total)}</span> sur{' '}
              <span className="font-medium text-stone-800">{pagination.total}</span> créations
            </p>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => refetch(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                className="px-3.5 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 disabled:opacity-40 transition-colors shadow-2xs"
              >
                Précédent
              </button>

              <div className="flex gap-1">
                {[...Array(Math.min(5, pagination.last_page))].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => refetch(i + 1)}
                    className={`w-8 h-8 flex items-center justify-center text-xs rounded-xl font-medium transition-all ${
                      pagination.current_page === i + 1
                        ? 'bg-stone-950 text-white shadow-sm'
                        : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => refetch(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page}
                className="px-3.5 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 disabled:opacity-40 transition-colors shadow-2xs"
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
        title="Supprimer la création"
        message={`Êtes-vous certain de vouloir retirer définitivement "${confirmModal.productName}" de la collection ?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmModal({ isOpen: false, productId: 0, productName: '' })}
        confirmText="Supprimer"
        cancelText="Conserver"
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
