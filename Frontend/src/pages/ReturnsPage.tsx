import { useState } from 'react';
import { RotateCcw, Package, CheckCircle, Clock, AlertCircle, ChevronDown, ChevronUp, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ReturnsPageProps {
  onClose: () => void;
}

const FAQ_ITEMS = [
  {
    question: 'Quel est le délai pour effectuer un retour ?',
    answer: 'Vous disposez de 30 jours à compter de la réception de votre commande pour nous retourner un article. Passé ce délai, nous ne pourrons malheureusement pas accepter votre retour.'
  },
  {
    question: 'Les retours sont-ils gratuits ?',
    answer: 'Oui, les retours sont entièrement gratuits pour la France métropolitaine. Pour les retours depuis l\'étranger, des frais de port peuvent s\'appliquer.'
  },
  {
    question: 'Dans quel état doit être l\'article retourné ?',
    answer: 'L\'article doit être retourné dans son état d\'origine : non porté, non lavé, avec toutes ses étiquettes attachées et dans son emballage d\'origine si possible.'
  },
  {
    question: 'Quand serai-je remboursé(e) ?',
    answer: 'Le remboursement est effectué sous 5 à 10 jours ouvrés après réception et vérification de votre retour, sur le moyen de paiement utilisé lors de l\'achat.'
  },
  {
    question: 'Puis-je échanger un article contre une autre taille ?',
    answer: 'Oui, les échanges de taille ou de couleur sont possibles sous 30 jours, dans la limite des stocks disponibles. Précisez votre souhait dans le formulaire de retour.'
  },
  {
    question: 'Les articles soldés sont-ils retournables ?',
    answer: 'Les articles achetés en promotion sont retournables dans les mêmes conditions que les articles à prix plein, sauf mention contraire indiquée sur la fiche produit.'
  }
];

const RETURN_STEPS = [
  {
    step: 1,
    icon: Package,
    title: 'Initiez votre retour',
    description: 'Remplissez le formulaire ci-dessous ou connectez-vous à votre compte pour sélectionner la commande concernée.'
  },
  {
    step: 2,
    icon: Mail,
    title: 'Recevez votre étiquette',
    description: 'Vous recevrez par email une étiquette de retour prépayée sous 24h.'
  },
  {
    step: 3,
    icon: RotateCcw,
    title: 'Expédiez votre colis',
    description: 'Déposez votre colis dans un point relais ou bureau de poste avec l\'étiquette fournie.'
  },
  {
    step: 4,
    icon: CheckCircle,
    title: 'Remboursement',
    description: 'Dès réception et vérification, votre remboursement est traité sous 5-10 jours ouvrés.'
  }
];

export default function ReturnsPage({ onClose }: ReturnsPageProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({
    order_number: '',
    email: '',
    reason: '',
    type: 'refund' as 'refund' | 'exchange',
    details: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const RETURN_REASONS = [
    'Taille incorrecte',
    'Couleur différente de la photo',
    'Article défectueux ou endommagé',
    'Article non conforme à la description',
    'Changement d\'avis',
    'Commande en double',
    'Autre raison'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici on connecterait au backend pour créer un ticket de retour
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6 sm:p-8">
        <button onClick={onClose} className="mb-8 text-gray-600 hover:text-black transition-colors">
          ← Retour
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center">
            <RotateCcw className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Retours & Échanges</h1>
            <p className="text-gray-500 text-sm mt-1">30 jours pour changer d'avis — Retours gratuits</p>
          </div>
        </div>

        {/* Bannière politique */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: Clock, label: '30 jours', sub: 'Pour retourner votre article' },
            { icon: CheckCircle, label: 'Gratuit', sub: 'Retours en France métropolitaine' },
            { icon: RotateCcw, label: '5-10 jours', sub: 'Délai de remboursement' }
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="bg-rose-50 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <Icon className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{label}</p>
                <p className="text-xs text-gray-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Étapes */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Comment ça marche ?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {RETURN_STEPS.map(({ step, icon: Icon, title, description }) => (
              <div key={step} className="relative bg-gray-50 rounded-xl p-5">
                <div className="w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center text-sm font-bold mb-3">
                  {step}
                </div>
                <Icon className="w-5 h-5 text-rose-400 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Formulaire de retour */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Initier un retour</h2>

          {submitted ? (
            <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Demande envoyée !</h3>
              <p className="text-gray-600 mb-4">
                Votre demande de retour a été enregistrée. Vous recevrez votre étiquette de retour par email sous 24h.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-sm text-rose-500 hover:underline"
              >
                Faire une autre demande
              </button>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              {/* Raccourci si connecté */}
              {isAuthenticated ? (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <p className="text-sm text-blue-700 font-medium">Vous êtes connecté — retrouvez vos commandes directement</p>
                  </div>
                  <button
                    onClick={() => navigate('/account')}
                    className="text-sm font-semibold text-blue-600 hover:underline whitespace-nowrap ml-4"
                  >
                    Mes commandes →
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-600">Connectez-vous pour un retour simplifié</p>
                  </div>
                  <button
                    onClick={() => navigate('/login')}
                    className="text-sm font-semibold text-gray-800 hover:underline whitespace-nowrap ml-4"
                  >
                    Se connecter →
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de commande *</label>
                    <input
                      type="text"
                      required
                      value={form.order_number}
                      onChange={(e) => setForm(p => ({ ...p, order_number: e.target.value.toUpperCase() }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-transparent outline-none"
                      placeholder="CMD-20250415-XXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email de commande *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-transparent outline-none"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                {/* Type : remboursement ou échange */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Je souhaite *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'refund', label: 'Un remboursement' },
                      { value: 'exchange', label: 'Un échange' }
                    ].map(opt => (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          form.type === opt.value ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="type"
                          value={opt.value}
                          checked={form.type === opt.value}
                          onChange={() => setForm(p => ({ ...p, type: opt.value as 'refund' | 'exchange' }))}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${form.type === opt.value ? 'border-black' : 'border-gray-300'}`}>
                          {form.type === opt.value && <div className="w-2 h-2 bg-black rounded-full" />}
                        </div>
                        <span className="font-medium text-sm">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Motif du retour *</label>
                  <select
                    required
                    value={form.reason}
                    onChange={(e) => setForm(p => ({ ...p, reason: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-transparent outline-none bg-white"
                  >
                    <option value="">Sélectionnez un motif</option>
                    {RETURN_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Détails supplémentaires</label>
                  <textarea
                    rows={3}
                    value={form.details}
                    onChange={(e) => setForm(p => ({ ...p, details: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-transparent outline-none resize-none"
                    placeholder="Décrivez votre problème ou précisez la taille/couleur souhaitée pour un échange..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-3.5 rounded-xl font-semibold hover:bg-gray-900 transition-all"
                >
                  Envoyer ma demande de retour
                </button>
              </form>
            </div>
          )}
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Questions fréquentes</h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => (
              <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900 text-sm">{item.question}</span>
                  {openFaq === idx
                    ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                  }
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <div className="bg-rose-50 rounded-xl p-6 border border-rose-100">
          <h3 className="font-semibold text-gray-900 mb-3">Besoin d'aide supplémentaire ?</h3>
          <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-rose-400" />
              <span>contact@stellshope.fr</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-rose-400" />
              <span>+33 1 23 45 67 89 — Lun-Ven 9h-19h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
