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
        <div className="w-12 h-12 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin"></div>
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
    if (stock === 0) return { label: 'Rupture', color: 'bg-rose-50 text-rose-600 border-rose-100', icon: AlertTriangle };
    if (stock <= reorderLevel) return { label: 'Stock Faible', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: TrendingDown };
    return { label: 'En Stock', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle2 };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Gestion des Stocks</h1>
          <p className="text-slate-500 mt-1 font-medium">Contrôlez l'inventaire et les seuils de réapprovisionnement.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">{stats.total} Produits répertoriés</span>
        </div>
      </div>

      {/* Stats Cards Premium */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Produits', value: stats.total, icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'En Stock', value: stats.inStock, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Stock Faible', value: stats.lowStock, icon: TrendingDown, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'En Rupture', value: stats.outOfStock, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'Unités Totales', value: stats.totalUnits, icon: Layers, color: 'text-blue-600', bg: 'bg-blue-50' },
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

      {/* Critical Alert if needed */}
      {stats.lowStock > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-[2rem] p-6 flex items-center space-x-4">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-black text-amber-900 uppercase tracking-wider">Alerte Réapprovisionnement</h3>
            <p className="text-amber-700/80 text-sm font-medium mt-0.5">
              Il y a actuellement <span className="font-bold underline">{stats.lowStock} produits</span> dont le stock est inférieur au seuil critique.
            </p>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
              <input
                type="text"
                placeholder="Rechercher par nom, SKU ou fournisseur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500/20 focus:bg-white transition-all font-medium text-slate-700"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-slate-50 rounded-2xl p-1 border border-slate-100">
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="bg-transparent border-none text-sm font-bold text-slate-600 focus:ring-0 px-4 py-2 cursor-pointer"
              >
                <option value="all">Tous les Stocks</option>
                <option value="low">Stock Faible</option>
                <option value="out">Rupture</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table Premium */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Produit</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Niveaux</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Disponibilité</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Statut</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Fournisseur</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedInventory.map((item) => {
                const status = getStockStatus(item.stock, item.reorderLevel);
                const available = item.stock - item.reserved;

                return (
                  <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image || '/placeholder.jpg'}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded-2xl shadow-sm border border-slate-200 group-hover:scale-105 transition-transform"
                        />
                        <div>
                          <div className="text-sm font-bold text-slate-900 leading-tight">{item.name}</div>
                          <div className="text-[10px] font-bold text-rose-500 uppercase tracking-tighter mt-1">ID: #{item.id.toString().padStart(4, '0')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center justify-between min-w-[120px]">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Stock:</span>
                          <span className="text-sm font-black text-slate-900">{item.stock}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Réservé:</span>
                          <span className="text-xs font-bold text-slate-500">{item.reserved}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <div className={`text-sm font-black ${available > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {available} unités
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          Seuil: {item.reorderLevel}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${status.color}`}>
                        <status.icon className="w-3 h-3 mr-1.5" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-bold text-slate-700">{item.supplier || 'N/A'}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all" title="Réapprovisionner">
                          <RefreshCcw className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all" title="Modifier">
                          <Edit2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Premium */}
        <div className="bg-slate-50/50 px-8 py-5 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Affichage de <span className="text-slate-900 font-black">{startIndex + 1}</span> à{' '}
              <span className="text-slate-900 font-black">{Math.min(startIndex + itemsPerPage, filteredInventory.length)}</span> sur{' '}
              <span className="text-slate-900 font-black">{filteredInventory.length}</span> produits
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm"
              >
                Précédent
              </button>
              <div className="flex space-x-1">
                {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-9 h-9 flex items-center justify-center text-xs font-bold rounded-xl transition-all ${currentPage === i + 1
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm"
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
