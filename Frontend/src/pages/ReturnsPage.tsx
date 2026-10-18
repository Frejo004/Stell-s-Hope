import { useState } from 'react';
import { RotateCcw, Package, CheckCircle2, Clock, AlertCircle, ChevronDown, Mail, Phone, ArrowLeft, Sparkles, Send } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Logo from '../components/Logo';
import { eventBus } from '../utils/eventBus';

interface ReturnsPageProps {
  onClose?: () => void;
}

const FAQ_ITEMS = [
  {
    question: 'Quel est le délai pour effectuer un retour ?',
    answer: 'Vous disposez d\'un délai de 14 jours francs à compter de la remise en main propre de votre commande pour initier votre démarche de retour.'
  },
  {
    question: 'Les retours sont-ils pris en charge ?',
    answer: 'Les retours pour échange de taille ou de conformité sont intégralement pris en charge et organisés par notre service conciergerie.'
  },
  {
    question: 'Dans quel état la création doit-elle être retournée ?',
    answer: 'La pièce doit impérativement être retournée dans son état neuf d\'origine : non portée, non lavée, avec toutes ses étiquettes textiles scellées et son emballage de protection.'
  },
  {
    question: 'Quel est le délai de remboursement ?',
    answer: 'Le remboursement est exécuté sous 5 à 7 jours ouvrés suivant la réception et la validation du contrôle qualité en atelier, directement sur le moyen de règlement initial.'
  },
  {
    question: 'Comment se déroule un échange de taille ?',
    answer: 'Précisez la taille souhaitée dans le formulaire de retour. Dès enregistrement, notre équipe réserve la pièce souhaitée sous réserve de disponibilité des stocks.'
  }
];

const RETURN_STEPS = [
  {
    step: 1,
    icon: Package,
    title: 'Déclaration en ligne',
    description: 'Remplissez le formulaire ci-dessous ou contactez la conciergerie avec votre référence de commande.'
  },
  {
    step: 2,
    icon: Mail,
    title: 'Confirmation & Bon de retour',
    description: 'Vous recevez les instructions de retour et le bon de prise en charge par email sous 24h.'
  },
  {
    step: 3,
    icon: RotateCcw,
    title: 'Remise du colis',
    description: 'Emballez soigneusement la création dans sa boîte d\'origine et confiez-la à notre coursier mandaté.'
  },
  {
    step: 4,
    icon: CheckCircle2,
    title: 'Contrôle & Remboursement',
    description: 'Après validation atelier, votre remboursement ou expédition de la nouvelle taille est opéré sous 5 jours.'
  }
];

export default function ReturnsPage({ onClose }: ReturnsPageProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [form, setForm] = useState({
    order_number: '',
    email: '',
    reason: 'Taille incorrecte',
    type: 'exchange' as 'refund' | 'exchange',
    details: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const RETURN_REASONS = [
    'Taille incorrecte (souhait d\'échange)',
    'Nuance différente des attentes',
    'Changement d\'avis',
    'Création défectueuse ou anomalie',
    'Autre motif particulier'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    eventBus.emit('show-toast', {
      type: 'success',
      message: 'Votre demande de retour a été transmise à notre service logistique.'
    });
  };

  return (
    <div className="fixed inset-0 bg-[#FAF9F6] text-stone-900 selection:bg-stone-900 selection:text-white z-50 overflow-y-auto animate-in fade-in duration-200">
      {/* Top Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-stone-200/80 px-6 sm:px-10 py-4 flex items-center justify-between shadow-sm">
        <button
          onClick={() => onClose ? onClose() : window.history.back()}
          className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-500 hover:text-stone-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Retour à l'Atelier</span>
        </button>

        <Logo className="h-6" />

        <div className="w-20 text-right">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
            Retours
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 sm:py-16 space-y-12">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-stone-100 text-stone-700 border border-stone-200 mb-3">
            <Sparkles className="w-3 h-3 text-terracotta-500" />
            Sérénité & Échanges
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-stone-950 mb-3">
            Retours & Échanges
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
            Votre satisfaction est essentielle. Bénéficiez d'un accompagnement fluide pour échanger votre taille ou demander un remboursement.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Clock, label: '14 Jours', sub: 'Pour essayer tranquillement chez vous' },
            { icon: RotateCcw, label: 'Échange Facilité', sub: 'Nouvelle taille réservée immédiatement' },
            { icon: CheckCircle2, label: 'Remboursement Intégral', sub: 'Effectué sous 5 à 7 jours ouvrés' }
          ].map(({ icon: Icon, label, sub }, idx) => (
            <div key={idx} className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-900 shrink-0">
                <Icon className="w-5 h-5 text-terracotta-600" />
              </div>
              <div>
                <p className="font-serif text-base font-medium text-stone-950">{label}</p>
                <p className="text-xs text-stone-500 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Steps */}
        <div className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
          <h2 className="font-serif text-xl sm:text-2xl font-medium text-stone-950 text-center">
            Les 4 étapes d'un retour en toute simplicité
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {RETURN_STEPS.map(({ step, icon: Icon, title, description }) => (
              <div key={step} className="p-5 rounded-2xl bg-[#FAF9F6] border border-stone-200/80 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-full bg-stone-950 text-white font-serif text-xs font-semibold flex items-center justify-center shadow-card-luxury">
                    {step}
                  </div>
                  <Icon className="w-4 h-4 text-stone-400" />
                </div>
                <h3 className="font-serif text-sm font-medium text-stone-900">{title}</h3>
                <p className="text-xs text-stone-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Return Request Form */}
        <div className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-10 shadow-sm">
          {submitted ? (
            <div className="text-center py-10 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-medium text-stone-950 mb-2">Demande enregistrée</h3>
              <p className="text-xs sm:text-sm text-stone-500 mb-8 leading-relaxed">
                Notre service retour a bien reçu votre demande pour la commande <strong>#{form.order_number}</strong>. Vous recevrez le bon d'expédition et les détails de passage à l'adresse <strong>{form.email}</strong>.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-3 rounded-full bg-stone-950 text-white text-xs font-semibold tracking-wider uppercase hover:bg-stone-800 transition-colors shadow-card-luxury"
              >
                Nouvelle demande
              </button>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="font-serif text-2xl font-medium text-stone-950 mb-2">
                  Déclarer un retour ou un échange
                </h2>
                <p className="text-xs text-stone-500">
                  Renseignez les détails de votre commande pour recevoir votre bon de prise en charge.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold tracking-wide uppercase text-stone-600 mb-1.5">
                      Numéro de commande
                    </label>
                    <input
                      type="text"
                      required
                      value={form.order_number}
                      onChange={(e) => setForm(prev => ({ ...prev, order_number: e.target.value.toUpperCase() }))}
                      placeholder="Ex: #ORD-1234"
                      className="w-full px-4 py-3 bg-[#FAF9F6] border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-950 focus:ring-4 focus:ring-stone-950/5 transition-all shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold tracking-wide uppercase text-stone-600 mb-1.5">
                      Adresse email
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="nom@exemple.com"
                      className="w-full px-4 py-3 bg-[#FAF9F6] border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-950 focus:ring-4 focus:ring-stone-950/5 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold tracking-wide uppercase text-stone-600 mb-1.5">
                      Type de demande
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setForm(p => ({ ...p, type: 'exchange' }))}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                          form.type === 'exchange'
                            ? 'bg-stone-950 text-white border-stone-950 shadow-sm'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        Échange de taille
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm(p => ({ ...p, type: 'refund' }))}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                          form.type === 'refund'
                            ? 'bg-stone-950 text-white border-stone-950 shadow-sm'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        Remboursement
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold tracking-wide uppercase text-stone-600 mb-1.5">
                      Motif principal
                    </label>
                    <select
                      value={form.reason}
                      onChange={(e) => setForm(prev => ({ ...prev, reason: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#FAF9F6] border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 outline-none focus:border-stone-950 focus:ring-4 focus:ring-stone-950/5 transition-all shadow-sm"
                    >
                      {RETURN_REASONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-wide uppercase text-stone-600 mb-1.5">
                    Précisions éventuelles (nouvelle taille souhaitée, etc.)
                  </label>
                  <textarea
                    rows={3}
                    value={form.details}
                    onChange={(e) => setForm(prev => ({ ...prev, details: e.target.value }))}
                    placeholder="Indiquez ici vos précisions..."
                    className="w-full px-4 py-3 bg-[#FAF9F6] border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-950 focus:ring-4 focus:ring-stone-950/5 transition-all shadow-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-4 px-6 rounded-2xl bg-stone-950 text-white font-medium text-xs tracking-wider uppercase hover:bg-stone-800 transition-all duration-200 shadow-card-luxury flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Envoyer la demande de retour</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <h2 className="font-serif text-xl sm:text-2xl font-medium text-stone-950">
            Foire aux questions — Retours & Remboursements
          </h2>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`border rounded-2xl transition-all ${
                    isOpen ? 'border-stone-950 bg-[#FAF9F6]' : 'border-stone-200/80'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between font-serif text-sm font-medium text-stone-950"
                  >
                    <span>{item.question}</span>
                    <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-2">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
