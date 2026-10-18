import { useState } from 'react';
import { Search, Package, Truck, CheckCircle2, Clock, XCircle, MapPin, ChevronRight, Sparkles, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { orderService } from '../services/orderService';
import { Order } from '../types/order';

export default function PublicOrderTrackingPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ order_number: '', email: '' });
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOrder(null);
    setLoading(true);
    setSearched(true);

    try {
      const response = await orderService.trackOrderPublic(form.order_number, form.email);
      setOrder(response);
    } catch {
      setError('Aucune commande trouvée avec ces informations. Vérifiez le numéro de référence et l\'adresse email utilisée.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { key: 'pending',   label: 'Commande reçue',   icon: Clock,        statuses: ['pending', 'confirmed', 'processing', 'shipped', 'delivered'] },
    { key: 'confirmed', label: 'Confirmée & validée', icon: Package,   statuses: ['confirmed', 'processing', 'shipped', 'delivered'] },
    { key: 'processing',label: 'En confection',     icon: Package,      statuses: ['processing', 'shipped', 'delivered'] },
    { key: 'shipped',   label: 'Expédiée',          icon: Truck,        statuses: ['shipped', 'delivered'] },
    { key: 'delivered', label: 'Livrée avec soin',  icon: CheckCircle2,  statuses: ['delivered'] },
  ];

  const getStepState = (step: typeof steps[0]) => {
    if (!order) return 'inactive';
    if (order.status === 'cancelled') return 'cancelled';
    return step.statuses.includes(order.status) ? 'done' : 'inactive';
  };

  const statusBadges: Record<string, { label: string; classes: string }> = {
    pending:    { label: 'En attente', classes: 'bg-stone-100 text-stone-700 border-stone-200' },
    confirmed:  { label: 'Confirmée', classes: 'bg-stone-900 text-white border-stone-900' },
    processing: { label: 'En confection', classes: 'bg-amber-50 text-amber-800 border-amber-200' },
    shipped:    { label: 'Colis expédié', classes: 'bg-stone-100 text-stone-900 border-stone-300' },
    delivered:  { label: 'Livré', classes: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    cancelled:  { label: 'Annulé', classes: 'bg-red-50 text-red-700 border-red-200' },
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 selection:bg-stone-900 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-stone-200/80 px-6 sm:px-10 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="inline-block">
            <Logo className="h-6" />
          </button>
          <button
            onClick={() => navigate('/boutique')}
            className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500 hover:text-stone-950 transition-colors"
          >
            <span>Retour à la boutique</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Titre */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-stone-100 text-stone-700 border border-stone-200 mb-3">
            <Sparkles className="w-3 h-3 text-terracotta-500" />
            Conciergerie Stell's Hope
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-stone-950 mb-2">
            Suivi de votre commande
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Consultez le statut de votre colis en temps réel en renseignant la référence de commande et l'email associé.
          </p>
        </div>

        {/* Formulaire de recherche */}
        <form onSubmit={handleSearch} className="bg-white rounded-3xl shadow-sm border border-stone-200/80 p-6 sm:p-8 mb-8 space-y-4">
          <div>
            <label className="block text-xs font-semibold tracking-wide uppercase text-stone-600 mb-1.5">
              Numéro de commande
            </label>
            <input
              type="text"
              required
              value={form.order_number}
              onChange={(e) => setForm(prev => ({ ...prev, order_number: e.target.value.toUpperCase() }))}
              className="w-full px-4 py-3.5 bg-[#FAF9F6] border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-950 focus:ring-4 focus:ring-stone-950/5 transition-all shadow-sm"
              placeholder="Ex: #ORD-1234 ou 1234"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wide uppercase text-stone-600 mb-1.5">
              Adresse email utilisée lors de l'achat
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3.5 bg-[#FAF9F6] border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-950 focus:ring-4 focus:ring-stone-950/5 transition-all shadow-sm"
              placeholder="votre@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-4 px-6 rounded-2xl bg-stone-950 text-white font-medium text-xs tracking-wider uppercase hover:bg-stone-800 disabled:opacity-50 transition-all duration-200 shadow-card-luxury flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Recherche en cours...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Rechercher ma commande</span>
              </>
            )}
          </button>
        </form>

        {/* Erreur */}
        {searched && error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 mb-8 text-xs text-red-700 animate-in fade-in">
            <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        {/* Résultat */}
        {order && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Statut principal */}
            <div className="bg-white rounded-3xl shadow-sm border border-stone-200/80 p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-0.5">Commande</p>
                  <h2 className="font-serif text-2xl font-medium text-stone-950">
                    #{order.order_number || order.id}
                  </h2>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                  statusBadges[order.status]?.classes || 'bg-stone-100 text-stone-800 border-stone-200'
                }`}>
                  {statusBadges[order.status]?.label || order.status}
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Enregistrée le {new Date(order.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>

            {/* Stepper Timeline */}
            {order.status !== 'cancelled' ? (
              <div className="bg-white rounded-3xl shadow-sm border border-stone-200/80 p-6 sm:p-8">
                <h3 className="font-serif text-base font-medium text-stone-950 mb-6">
                  Progression de l'acheminement
                </h3>
                <div className="space-y-1">
                  {steps.map((step, idx) => {
                    const state = getStepState(step);
                    const isDone = state === 'done';
                    const isActive = order.status === step.key;
                    const Icon = step.icon;

                    return (
                      <div key={step.key} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                            isDone
                              ? isActive
                                ? 'bg-stone-950 text-white shadow-card-luxury ring-4 ring-stone-950/10'
                                : 'bg-stone-900 text-white'
                              : 'bg-stone-100 text-stone-300 border border-stone-200'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          {idx < steps.length - 1 && (
                            <div className={`w-0.5 h-7 my-1 ${isDone && !isActive ? 'bg-stone-900' : 'bg-stone-200'}`} />
                          )}
                        </div>
                        <div className="pt-1.5 pb-4">
                          <p className={`font-semibold text-xs ${isDone ? 'text-stone-950' : 'text-stone-400'}`}>
                            {step.label}
                          </p>
                          {isActive && (
                            <p className="text-[10px] uppercase tracking-wider text-terracotta-600 font-semibold mt-0.5">
                              Statut actuel
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-3xl p-6 flex items-center gap-3 text-xs text-red-700">
                <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="font-medium">Cette commande a fait l'objet d'une annulation.</p>
              </div>
            )}

            {/* Lien pour se connecter et voir la facture */}
            <button
              onClick={() => navigate('/login', { state: { from: `/order-details/${order.id}` } })}
              className="w-full flex items-center justify-between bg-white border border-stone-200 rounded-2xl px-6 py-4 text-xs font-semibold text-stone-800 hover:border-stone-950 hover:bg-stone-50 transition-all shadow-sm group"
            >
              <span>Se connecter pour consulter la facture complète</span>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* Aide */}
        <div className="mt-10 text-center text-xs text-stone-400">
          Une question ou besoin d'aide personnalisée ?{' '}
          <button
            onClick={() => navigate('/contact')}
            className="text-stone-900 hover:text-terracotta-600 font-semibold underline underline-offset-4"
          >
            Contacter le service client
          </button>
        </div>
      </div>
    </div>
  );
}
