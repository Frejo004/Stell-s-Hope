import { useState } from 'react';
import { Search, Eye, Mail, Phone, Users, UserCheck, Star, ShoppingBag, Calendar, MoreHorizontal } from 'lucide-react';
import { useAdminCustomers } from '../../hooks/useAdminData';
import { formatPrice } from '../../utils';

interface AdminCustomersProps {
  onNavigate: (page: string) => void;
}

export default function AdminCustomers({ onNavigate: _onNavigate }: AdminCustomersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { customers, stats, loading } = useAdminCustomers();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-stone-300 border-t-stone-950 rounded-full animate-spin"></div>
          <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">Chargement de la clientèle...</span>
        </div>
      </div>
    );
  }

  const filteredCustomers = (customers || []).filter(customer =>
    `${customer.first_name} ${customer.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200/60">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-terracotta-600">Fichier Atelier</span>
          <h1 className="font-serif text-3xl font-normal text-stone-950 mt-1">
            Clientèle & Privilèges
          </h1>
          <p className="text-xs text-stone-500 font-light mt-1">
            Gestion des profils membres, historique d'achats et paniers moyens par client.
          </p>
        </div>

        <div className="px-4 py-2 bg-white rounded-2xl border border-stone-200/80 shadow-sm flex items-center gap-2 self-start sm:self-auto">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-semibold text-stone-700 uppercase tracking-widest">
            {filteredCustomers.length} membres actifs
          </span>
        </div>
      </div>

      {/* ─── Stats Cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Clients Enregistrés', value: stats?.total || 0, icon: Users, color: 'text-stone-900', bg: 'bg-stone-100' },
          { label: 'Actifs Récents', value: stats?.active || 0, icon: UserCheck, color: 'text-emerald-700', bg: 'bg-emerald-50' },
          { label: 'Clients Privilèges', value: stats?.vip || 0, icon: Star, color: 'text-amber-700', bg: 'bg-amber-50' },
          { label: 'Commandes Cumulées', value: stats?.totalOrders || 0, icon: ShoppingBag, color: 'text-terracotta-600', bg: 'bg-rose-50' },
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

      {/* ─── Barre de Recherche ─── */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200/80 p-5">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, e-mail ou identifiant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200/80 rounded-2xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-950/10 focus:bg-white focus:border-stone-400 transition-all font-light"
          />
        </div>
      </div>

      {/* ─── Table des Membres & Clients ─── */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-100">
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-stone-400 text-[10px]">Client Privilège</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-stone-400 text-[10px]">Coordonnées</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-stone-400 text-[10px]">Historique</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-stone-400 text-[10px]">Dépenses Cumulées</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-stone-400 text-[10px]">Statut</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-stone-400 text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-stone-950 text-white flex items-center justify-center font-serif text-xs font-semibold shadow-xs">
                          {(customer.first_name?.[0] || 'U') + (customer.last_name?.[0] || '')}
                        </div>
                        <div>
                          <p className="font-medium text-stone-900">
                            {customer.first_name} {customer.last_name}
                          </p>
                          <p className="text-[10px] text-terracotta-600 font-mono mt-0.5">
                            ID #{customer.id.toString().padStart(4, '0')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <div className="text-xs text-stone-600 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span className="truncate max-w-[200px]">{customer.email}</span>
                        </div>
                        {customer.phone && (
                          <div className="text-[11px] text-stone-400 flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-stone-300 shrink-0" />
                            <span>{customer.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-stone-900">{customer.orders_count || 0} commande{(customer.orders_count || 0) > 1 ? 's' : ''}</p>
                        <p className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>Depuis le {new Date(customer.created_at).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}</span>
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-serif font-medium text-sm text-stone-950">
                        {formatPrice(customer.total_spent || 0)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        customer.is_active
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-stone-100 text-stone-600 border-stone-200'
                      }`}>
                        {customer.is_active ? 'Compte Actif' : 'Désactivé'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
                          title="Consulter le profil"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
                          title="Options"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-stone-400 italic">
                    Aucun client correspondant à cette recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
