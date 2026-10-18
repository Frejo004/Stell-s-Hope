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
    { id: '2', name: 'Nuances & Teintes', type: 'color', values: ['Blanc Soie', 'Noir Onyx', 'Terracotta', 'Bleu Nuit', 'Rose Poudré'] },
    { id: '3', name: 'Coupes', type: 'type', values: ['Hauts & Chemisiers', 'Robes & Ensembles', 'Pantalons & Jupes', 'Accessoires'] }
  ]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await adminService.getCategories();
      setCategories(data);
    } catch {
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
        setToast({ type: 'success', message: 'Univers actualisé avec succès' });
      } else {
        await adminService.createCategory(formData);
        setToast({ type: 'success', message: 'Nouvel univers créé' });
      }
      setShowModal(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '', is_active: true });
      fetchCategories();
    } catch {
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
      setToast({ type: 'success', message: 'Catégorie retirée du catalogue' });
      setShowDeleteModal(false);
      setDeletingCategory(null);
      fetchCategories();
    } catch {
      setToast({ type: 'error', message: 'Erreur lors de la suppression' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-stone-300 border-t-stone-950 rounded-full animate-spin"></div>
          <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">Chargement des univers...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/60">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-terracotta-600">Structure Collections</span>
          <h1 className="font-serif text-3xl font-normal text-stone-950 mt-1">
            Univers & Attributs
          </h1>
          <p className="text-xs text-stone-500 font-light mt-1">
            Organisez le vestiaire par univers, lignes de vêtements et déclinaisons de tailles/coloris.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: '', description: '', is_active: true });
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 bg-stone-950 hover:bg-black text-white px-6 py-3 rounded-full text-xs uppercase tracking-widest font-semibold shadow-md hover:shadow-lg transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-terracotta-400" />
          <span>Nouvel Univers</span>
        </button>
      </div>

      {/* ─── Stats Cards ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Univers Actifs', value: categories.length, icon: Tag, color: 'text-stone-900', bg: 'bg-stone-100' },
          { label: 'Grilles de Tailles & Nuances', value: attributes.length, icon: Layers, color: 'text-stone-800', bg: 'bg-stone-100' },
          { label: 'Pièces Rattachées', value: categories.reduce((sum, cat) => sum + (cat.products_count || 0), 0), icon: Package, color: 'text-emerald-700', bg: 'bg-emerald-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm">
            <div className={`w-9 h-9 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-3`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <div className="font-serif text-2xl font-normal text-stone-950 leading-none">{stat.value}</div>
            <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mt-2">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ─── Grille 2 colonnes : Univers + Attributs ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Univers du Catalogue */}
        <div className="bg-white rounded-3xl shadow-sm border border-stone-200/80 overflow-hidden">
          <div className="p-6 border-b border-stone-100 flex items-center justify-between">
            <h2 className="font-serif text-base font-normal text-stone-950">Univers du Catalogue</h2>
            <span className="px-3 py-1 bg-stone-100 rounded-full text-[10px] font-semibold text-stone-600 uppercase tracking-wider">
              {categories.length} Univers
            </span>
          </div>

          <div className="p-6 space-y-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 bg-stone-50/60 hover:bg-white border border-stone-200/60 hover:border-stone-300 rounded-2xl transition-all shadow-2xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-stone-200 text-stone-800 flex items-center justify-center shrink-0">
                    <Tag className="w-4 h-4 text-terracotta-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-xs text-stone-900 leading-tight">{category.name}</h3>
                    <p className="text-[10px] text-stone-400 mt-0.5">
                      {category.products_count || 0} création{category.products_count > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                    category.is_active
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-stone-100 text-stone-600 border-stone-200'
                  }`}>
                    {category.is_active ? 'En ligne' : 'Masqué'}
                  </span>
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(category)}
                    className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nuanciers & Déclinaisons */}
        <div className="bg-white rounded-3xl shadow-sm border border-stone-200/80 overflow-hidden">
          <div className="p-6 border-b border-stone-100 flex items-center justify-between">
            <h2 className="font-serif text-base font-normal text-stone-950">Attributs & Nuanciers</h2>
            <span className="text-xs text-stone-400 font-light">Standards Atelier</span>
          </div>

          <div className="p-6 space-y-4">
            {attributes.map((attribute) => (
              <div key={attribute.id} className="bg-stone-50/60 border border-stone-200/60 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-700">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="font-medium text-xs text-stone-900">{attribute.name}</h3>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {attribute.values.map((value, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-[11px] font-medium bg-white text-stone-700 border border-stone-200/80 rounded-xl shadow-2xs"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Modal Création / Modification Univers ─── */}
      {showModal && (
        <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-stone-200/80">
            <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
              <h3 className="font-serif text-lg font-normal text-stone-950">
                {editingCategory ? 'Modifier l\'Univers' : 'Nouvel Univers'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingCategory(null);
                  setFormData({ name: '', description: '', is_active: true });
                }}
                className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">
                  Nom de l'univers
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200/80 rounded-2xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-950/10 focus:bg-white focus:border-stone-400 transition-all font-light"
                  placeholder="Ex: Soirée & Cérémonie"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">
                  Description éditoriale
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200/80 rounded-2xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-950/10 focus:bg-white focus:border-stone-400 transition-all font-light"
                  rows={3}
                  placeholder="Brève description de la sélection..."
                />
              </div>

              <div className="flex items-center gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200/60">
                <input
                  type="checkbox"
                  id="category_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-stone-950 focus:ring-stone-950/20"
                />
                <label htmlFor="category_active" className="text-xs font-medium text-stone-700 cursor-pointer select-none">
                  Afficher cet univers publiquement dans la boutique
                </label>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCategory(null);
                    setFormData({ name: '', description: '', is_active: true });
                  }}
                  className="flex-1 px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-5 py-2.5 bg-stone-950 hover:bg-black text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-terracotta-400" />
                  <span>{editingCategory ? 'Sauvegarder' : 'Créer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Modal Confirmation de Suppression ─── */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-stone-200/80 p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-normal text-stone-950">Retirer l'Univers ?</h3>
              <p className="text-xs text-stone-500 mt-1 font-light leading-relaxed">
                Confirmez-vous le retrait de l'univers <strong className="text-stone-900 font-medium">"{deletingCategory?.name}"</strong> ?
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingCategory(null);
                }}
                className="flex-1 px-4 py-2.5 bg-stone-100 text-stone-700 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-stone-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-rose-700 transition-colors"
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
