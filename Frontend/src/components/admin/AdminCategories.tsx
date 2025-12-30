import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag, Layers, Package, CheckCircle2, X } from 'lucide-react';
import { adminService } from '../../services/adminService';
import Toast from '../ui/Toast';

interface AdminCategoriesProps {
  onNavigate: (page: string) => void;
}

export default function AdminCategories({ onNavigate: _onNavigate }: AdminCategoriesProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning', message: string } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [deletingCategory, setDeletingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', description: '', is_active: true });

  const [attributes] = useState([
    { id: '1', name: 'Tailles', type: 'size', values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
    { id: '2', name: 'Couleurs', type: 'color', values: ['Blanc', 'Noir', 'Bleu marine', 'Rose poudré'] },
    { id: '3', name: 'Types', type: 'type', values: ['Hauts', 'Bas', 'Accessoires'] }
  ]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await adminService.getCategories();
      setCategories(data);
    } catch (error) {
      setToast({ type: 'error', message: 'Erreur lors du chargement des catégories' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await adminService.updateCategory(editingCategory.id, formData);
        setToast({ type: 'success', message: 'Catégorie mise à jour' });
      } else {
        await adminService.createCategory(formData);
        setToast({ type: 'success', message: 'Catégorie créée' });
      }
      setShowModal(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '', is_active: true });
      fetchCategories();
    } catch (error) {
      setToast({ type: 'error', message: 'Erreur lors de la sauvegarde' });
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description || '', is_active: category.is_active });
    setShowModal(true);
  };

  const handleDeleteClick = (category: any) => {
    setDeletingCategory(category);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await adminService.deleteCategory(deletingCategory.id);
      setToast({ type: 'success', message: 'Catégorie supprimée' });
      setShowDeleteModal(false);
      setDeletingCategory(null);
      fetchCategories();
    } catch (error) {
      setToast({ type: 'error', message: 'Erreur lors de la suppression' });
    }
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
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Catégories & Attributs</h1>
          <p className="text-slate-500 mt-1 font-medium">Structurez votre catalogue avec précision.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-rose-500 text-white px-6 py-3 rounded-2xl border-none font-bold text-sm shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 hover:-translate-y-0.5 transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nouvelle Catégorie</span>
        </button>
      </div>

      {/* Stats Cards Premium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Catégories', value: categories.length, icon: Tag, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'Attributs Actifs', value: attributes.length, icon: Layers, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Produits Classés', value: categories.reduce((sum, cat) => sum + (cat.products_count || 0), 0), icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-[1.5rem] p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-black text-slate-900 leading-none">{stat.value}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories Section */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Catégories Catalogue</h2>
            <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {categories.length} Total
            </span>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="group flex items-center justify-between p-4 bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-rose-200 rounded-2xl transition-all hover:shadow-md">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Tag className="w-5 h-5 text-rose-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">{category.name}</h3>
                      <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        <Package className="w-3 h-3 mr-1" />
                        {category.products_count || 0} produits
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border ${category.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}>
                      {category.is_active ? 'Actif' : 'Inactif'}
                    </span>
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(category)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Attributes Section */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Attributs & Filtres</h2>
            <button className="text-rose-500 hover:text-rose-600 text-[10px] font-bold uppercase tracking-widest flex items-center space-x-1">
              <Plus className="w-3 h-3" />
              <span>Nouveau</span>
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {attributes.map((attribute) => (
                <div key={attribute.id} className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 hover:border-indigo-200 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Layers className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{attribute.name}</h3>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {attribute.values.map((value, index) => (
                      <span key={index} className="px-3 py-1 text-[10px] font-bold bg-white text-slate-600 border border-slate-200 rounded-xl shadow-sm">
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Premium */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingCategory(null);
                  setFormData({ name: '', description: '', is_active: true });
                }}
                className="p-2 bg-white rounded-xl border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nom de la catégorie</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-rose-500/20 focus:bg-white transition-all font-medium text-slate-700"
                  placeholder="Ex: Robes de soirée"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-rose-500/20 focus:bg-white transition-all font-medium text-slate-700"
                  rows={4}
                  placeholder="Que contient cette catégorie ?"
                />
              </div>
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl">
                <input
                  type="checkbox"
                  id="category_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5 rounded-lg border-slate-300 text-rose-500 focus:ring-rose-500/20"
                />
                <label htmlFor="category_active" className="text-sm font-bold text-slate-700 cursor-pointer flex-1">
                  Marquer cette catégorie comme active sur le site
                </label>
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCategory(null);
                    setFormData({ name: '', description: '', is_active: true });
                  }}
                  className="flex-1 px-6 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3.5 bg-rose-500 text-white rounded-2xl font-bold text-sm hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{editingCategory ? 'Mettre à jour' : 'Créer la catégorie'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Premium */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Supprimer la catégorie ?</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Êtes-vous sûr de vouloir supprimer la catégorie <span className="text-slate-900 font-bold">"{deletingCategory?.name}"</span> ?
                <br />Cette action supprimera également les associations de produits.
              </p>
            </div>
            <div className="p-8 bg-slate-50 flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingCategory(null);
                }}
                className="flex-1 px-6 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-6 py-3.5 bg-rose-500 text-white rounded-2xl font-bold text-sm hover:bg-rose-600 shadow-lg shadow-rose-500/10 transition-all"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
