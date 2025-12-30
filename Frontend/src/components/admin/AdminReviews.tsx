import { useState } from 'react';
import { Search, Eye, Star, MessageSquare, ThumbsUp, ThumbsDown, Calendar, Package } from 'lucide-react';
import { useAdminReviews } from '../../hooks/useAdminData';

interface AdminReviewsProps {
  onNavigate: (page: string) => void;
}

export default function AdminReviews({ onNavigate: _onNavigate }: AdminReviewsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { reviews = [], stats = { total: 0, pending: 0, approved: 0, averageRating: 0 }, loading, updateReviewStatus } = useAdminReviews();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const filteredReviews = reviews.filter(review => {
    const customerName = typeof review.customer === 'string' ? review.customer : ((review.customer as any)?.name || '');
    const productName = typeof review.product === 'string' ? review.product : ((review.product as any)?.name || '');

    const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'rejected': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-400 border-slate-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Approuvé';
      case 'pending': return 'En attente';
      case 'rejected': return 'Rejeté';
      default: return status;
    }
  };

  const getInitials = (name: any) => {
    if (!name) return 'U';
    const nameStr = typeof name === 'string' ? name : (name.name || 'U');
    return nameStr.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getDisplayName = (name: any) => {
    if (!name) return 'Client Anonyme';
    return typeof name === 'string' ? name : (name.name || 'Client Anonyme');
  };

  const getProductName = (product: any) => {
    if (!product) return 'Produit inconnu';
    return typeof product === 'string' ? product : (product.name || 'Produit inconnu');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Modération des Avis</h1>
          <p className="text-slate-500 mt-1 font-medium">Gérez les retours clients et maintenez la confiance.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">{stats.pending} Avis en attente</span>
        </div>
      </div>

      {/* Stats Cards Premium */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Avis', value: stats.total, icon: MessageSquare, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'En Attente', value: stats.pending, icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Approuvés', value: stats.approved, icon: ThumbsUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Note Moyenne', value: stats.averageRating.toFixed(1), icon: Star, color: 'text-rose-600', bg: 'bg-rose-50' },
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
                placeholder="Rechercher par client ou produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500/20 focus:bg-white transition-all font-medium text-slate-700"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-slate-50 rounded-2xl p-1 border border-slate-100">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent border-none text-sm font-bold text-slate-600 focus:ring-0 px-4 py-2 cursor-pointer"
              >
                <option value="all">Tous les Statuts</option>
                <option value="pending">En attente</option>
                <option value="approved">Approuvés</option>
                <option value="rejected">Rejetés</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="group bg-white rounded-[2rem] border border-slate-200 hover:border-rose-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Left Column: User & Rating */}
              <div className="md:w-64 flex-shrink-0">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-tr from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center border border-slate-200 group-hover:scale-105 transition-transform shadow-sm">
                    <span className="text-slate-600 font-black text-xs">
                      {getInitials(review.customer)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">{getDisplayName(review.customer)}</h3>
                    <div className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-0.5">
                      {review.date ? new Date(review.date).toLocaleDateString('fr-FR') : 'Date inconnue'}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < (review.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                      />
                    ))}
                    <span className="ml-2 text-xs font-black text-slate-900">{review.rating || 0}/5</span>
                  </div>
                  <span className={`inline-flex items-center self-start px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${getStatusStyle(review.status || '')}`}>
                    {getStatusLabel(review.status || '')}
                  </span>
                </div>
              </div>

              {/* Center Column: Comment & Product */}
              <div className="flex-1 min-w-0">
                <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100 group-hover:bg-white transition-colors">
                  <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                    "{review.comment || 'Sans commentaire'}"
                  </p>
                </div>
                <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <Package className="w-4 h-4 mr-2 text-slate-300" />
                  Produit: <span className="ml-2 text-slate-900 underline decoration-rose-500/30 decoration-2 underline-offset-4 cursor-pointer">{getProductName(review.product)}</span>
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="flex md:flex-col items-center gap-2">
                {review.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateReviewStatus(review.id, 'approved')}
                      className="flex-1 md:w-10 md:h-10 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center border border-emerald-100 shadow-sm"
                      title="Approuver"
                    >
                      <ThumbsUp className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => updateReviewStatus(review.id, 'rejected')}
                      className="flex-1 md:w-10 md:h-10 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center border border-rose-100 shadow-sm"
                      title="Rejeter"
                    >
                      <ThumbsDown className="w-5 h-5" />
                    </button>
                  </>
                )}
                <button className="flex-1 md:w-10 md:h-10 bg-white text-slate-400 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-all flex items-center justify-center border border-slate-200 shadow-sm">
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
