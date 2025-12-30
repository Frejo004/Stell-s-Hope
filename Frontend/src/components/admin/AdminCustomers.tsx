import { useState } from 'react';
import { Search, Eye, Mail, Phone, Users, UserCheck, Star, ShoppingBag, Calendar, MoreHorizontal } from 'lucide-react';
import { useAdminCustomers } from '../../hooks/useAdminData';

interface AdminCustomersProps {
  onNavigate: (page: string) => void;
}

export default function AdminCustomers({ onNavigate: _onNavigate }: AdminCustomersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { customers, stats, loading } = useAdminCustomers();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const filteredCustomers = (customers || []).filter(customer =>
    `${customer.first_name} ${customer.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Gestion des Clients</h1>
          <p className="text-slate-500 mt-1 font-medium">Visualisez et gérez votre base de clients.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">{filteredCustomers.length} Clients actifs</span>
        </div>
      </div>

      {/* Stats Cards Premium */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Clients', value: stats?.total || 0, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Actifs (30j)', value: stats?.active || 0, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Clients VIP', value: stats?.vip || 0, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Commandes Total', value: stats?.totalOrders || 0, icon: ShoppingBag, color: 'text-rose-600', bg: 'bg-rose-50' },
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

      {/* Filters Bar */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
              <input
                type="text"
                placeholder="Rechercher par nom, email ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500/20 focus:bg-white transition-all font-medium text-slate-700"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-slate-50 rounded-2xl p-1 border border-slate-100">
              <select className="bg-transparent border-none text-sm font-bold text-slate-600 focus:ring-0 px-4 py-2 cursor-pointer">
                <option value="all">Tous les statuts</option>
                <option value="active">Actifs</option>
                <option value="vip">VIP</option>
                <option value="inactive">Inactifs</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section Premium */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Client</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Contact</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Activité</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Dépenses</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Statut</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-tr from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm group-hover:scale-105 transition-transform">
                        <span className="text-slate-600 font-black text-xs">
                          {(customer.first_name?.[0] || 'U') + (customer.last_name?.[0] || '')}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 leading-tight">
                          {customer.first_name} {customer.last_name}
                        </div>
                        <div className="text-[10px] font-bold text-rose-500 uppercase tracking-tighter mt-1">ID: #{customer.id.toString().padStart(4, '0')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col space-y-1">
                      <div className="text-xs font-medium text-slate-600 flex items-center">
                        <Mail className="w-3.5 h-3.5 mr-2 text-slate-400" />
                        {customer.email}
                      </div>
                      {customer.phone && (
                        <div className="text-xs font-medium text-slate-400 flex items-center">
                          <Phone className="w-3.5 h-3.5 mr-2 text-slate-300" />
                          {customer.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <div className="text-sm font-bold text-slate-700">{customer.orders_count || 0} commandes</div>
                      <div className="flex items-center text-[10px] font-medium text-slate-400 mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        Depuis le {new Date(customer.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-sm font-black text-slate-900 border-l-2 border-emerald-500 pl-3">
                      {customer.total_spent ? Number(customer.total_spent).toFixed(2) : '0.00'}€
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${customer.is_active
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : 'bg-slate-50 text-slate-400 border border-slate-200'
                      }`}>
                      {customer.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
