import { useState } from 'react';
import { Search, AlertTriangle, Package, TrendingDown, Layers, CheckCircle2, RefreshCcw, Edit2 } from 'lucide-react';
import { useAdminInventory } from '../../hooks/useAdminData';

interface AdminInventoryProps {
  onNavigate: (page: string) => void;
}

export default function AdminInventory({ onNavigate: _onNavigate }: AdminInventoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { inventory = [], stats = { total: 0, inStock: 0, lowStock: 0, outOfStock: 0, totalUnits: 0 }, loading } = useAdminInventory();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-stone-300 border-t-stone-950 rounded-full animate-spin"></div>
          <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">Inventaire en cours de chargement...</span>
        </div>
      </div>
    );
  }

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStock = stockFilter === 'all' ||
      (stockFilter === 'low' && item.stock <= item.reorderLevel) ||
      (stockFilter === 'out' && item.stock === 0);
    return matchesSearch && matchesStock;
  });

  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInventory = filteredInventory.slice(startIndex, startIndex + itemsPerPage);

  const getStockStatus = (stock: number, reorderLevel: number) => {
    if (stock === 0) return { label: 'Rupture', color: 'bg-rose-50 text-rose-800 border-rose-200', icon: AlertTriangle };
    if (stock <= reorderLevel) return { label: 'Stock Limité', color: 'bg-amber-50 text-amber-800 border-amber-200', icon: TrendingDown };
    return { label: 'En Réserve', color: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: CheckCircle2 };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/60">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-terracotta-600">Réserves & Ateliers</span>
          <h1 className="font-serif text-3xl font-normal text-stone-950 mt-1">
            Gestion des Stocks & Approvisionnements
          </h1>
          <p className="text-xs text-stone-500 font-light mt-1">
            Surveillance des niveaux d'inventaire, seuils d'alerte et réservations en cours.
          </p>
        </div>

        <div className="px-4 py-2 bg-white rounded-2xl border border-stone-200/80 shadow-sm flex items-center gap-2 self-start sm:self-auto">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-semibold text-stone-700 uppercase tracking-widest">
            {stats.total} références suivies
          </span>
        </div>
      </div>

      {/* ─── Cartes Métriques Inventaire ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Références Totales', value: stats.total, icon: Package, color: 'text-stone-900', bg: 'bg-stone-100' },
          { label: 'En Réserve', value: stats.inStock, icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-50' },
          { label: 'Stock Limité', value: stats.lowStock, icon: TrendingDown, color: 'text-amber-700', bg: 'bg-amber-50' },
          { label: 'En Rupture', value: stats.outOfStock, icon: AlertTriangle, color: 'text-rose-700', bg: 'bg-rose-50' },
          { label: 'Pièces Totales', value: stats.totalUnits, icon: Layers, color: 'text-stone-700', bg: 'bg-stone-100' },
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

      {/* ─── Alerte Réapprovisionnement Haute Couture ─── */}
      {stats.lowStock > 0 && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-700 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-amber-900 uppercase tracking-wider">Alerte de Réapprovisionnement</h3>
            <p className="text-xs text-amber-800/80 mt-0.5 font-light">
              L'atelier signale <span className="font-semibold underline">{stats.lowStock} pièces</span> en quantité critique en-deçà du seuil défini.
            </p>
          </div>
        </div>
      )}

      {/* ─── Barre de Recherche et Filtres ─── */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200/80 p-5">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Rechercher par référence, création ou atelier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200/80 rounded-2xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-950/10 focus:bg-white focus:border-stone-400 transition-all font-light"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="bg-stone-50 border border-stone-200/80 text-xs font-medium text-stone-700 rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-stone-950/10 cursor-pointer"
            >
              <option value="all">Tous les États</option>
              <option value="low">Stock Limité</option>
              <option value="out">Rupture Immédiate</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── Table d'Inventaire ─── */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-100">
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-stone-400 text-[10px]">Création</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-stone-400 text-[10px]">Quantités</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-stone-400 text-[10px]">Disponibilité</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-stone-400 text-[10px]">Statut</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-stone-400 text-[10px]">Atelier / Origine</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-stone-400 text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {paginatedInventory.length > 0 ? (
                paginatedInventory.map((item) => {
                  const status = getStockStatus(item.stock, item.reorderLevel);
                  const available = item.stock - item.reserved;

                  return (
                    <tr key={item.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={item.image || '/placeholder.jpg'}
                            alt={item.name}
                            className="w-12 h-16 object-cover rounded-xl border border-stone-200/60 bg-stone-50 shrink-0"
                          />
                          <div>
                            <p className="font-medium text-stone-900">{item.name}</p>
                            <p className="text-[10px] text-terracotta-600 font-mono mt-0.5">
                              REF #{item.id.toString().padStart(4, '0')}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[11px] min-w-[100px]">
                            <span className="text-stone-400">Total :</span>
                            <span className="font-semibold text-stone-900">{item.stock}</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-stone-400">Réservé :</span>
                            <span className="text-stone-600">{item.reserved}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className={`font-serif text-sm font-medium ${available > 0 ? 'text-stone-950' : 'text-rose-600'}`}>
                            {available} pièces
                          </p>
                          <p className="text-[10px] text-stone-400 mt-0.5">
                            Seuil d'alerte : {item.reorderLevel}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${status.color}`}>
                          <status.icon className="w-3 h-3" />
                          <span>{status.label}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-stone-600 font-light">
                        {item.supplier || 'Atelier Stell\'s Hope'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
                            title="Réapprovisionner"
                          >
                            <RefreshCcw className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
                            title="Ajuster le seuil"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-stone-400 italic">
                    Aucun article correspondant dans l'inventaire.
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
              Affichage de <span className="font-medium text-stone-800">{startIndex + 1}</span> à{' '}
              <span className="font-medium text-stone-800">{Math.min(startIndex + itemsPerPage, filteredInventory.length)}</span> sur{' '}
              <span className="font-medium text-stone-800">{filteredInventory.length}</span> articles
            </p>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3.5 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 disabled:opacity-40 transition-colors shadow-2xs"
              >
                Précédent
              </button>

              <div className="flex gap-1">
                {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 flex items-center justify-center text-xs rounded-xl font-medium transition-all ${
                      currentPage === i + 1
                        ? 'bg-stone-950 text-white shadow-sm'
                        : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3.5 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 disabled:opacity-40 transition-colors shadow-2xs"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
