import { useState } from 'react';
import { ChevronDown, ArrowLeft, Sparkles, HelpCircle, MessageSquare, Search } from 'lucide-react';
import { formatPrice } from '../utils';
import { BUSINESS_CONSTANTS } from '../constants';
import Logo from '../components/Logo';
import { Link } from 'react-router-dom';

interface FAQPageProps {
  onClose?: () => void;
}

const faqs = [
  {
    category: 'Commandes & Paiement',
    questions: [
      {
        q: 'Comment passer une commande sur la boutique ?',
        a: 'Sélectionnez les articles de votre choix, précisez votre taille et coloris, puis ajoutez-les au panier. Suivez ensuite les étapes simples de validation, choisissez votre adresse et votre mode de règlement sécurisé.'
      },
      {
        q: 'Quels sont les moyens de paiement acceptés ?',
        a: 'Nous acceptons les cartes bancaires sécurisées (Visa, Mastercard avec 3D Secure) ainsi que les solutions Mobile Money partenaires (Wave, Orange Money, MTN Moov) via notre passerelle certifiée Moneroo.'
      },
      {
        q: 'Puis-je modifier ou annuler une commande après validation ?',
        a: 'Tant que votre commande n\'a pas encore été prise en charge par nos ateliers d\'expédition (délai indicatif de 2 heures), vous pouvez joindre notre service client pour demander une modification.'
      }
    ]
  },
  {
    category: 'Expédition & Acheminement',
    questions: [
      {
        q: 'Quels sont les délais indicatifs de livraison ?',
        a: 'Les commandes sont traitées et remises au transporteur sous 24 à 48 heures ouvrées. L\'acheminement standard s\'effectue en 48 à 72h ouvrées selon votre localité.'
      },
      {
        q: 'Quels sont les frais de port appliqués ?',
        a: `La livraison suivie vous est offerte pour toute commande à partir de ${formatPrice(BUSINESS_CONSTANTS.FREE_SHIPPING_THRESHOLD)}. En deçà, un forfait de ${formatPrice(BUSINESS_CONSTANTS.SHIPPING_COST)} s'applique.`
      },
      {
        q: 'Comment suivre l\'acheminement de mon colis ?',
        a: 'Dès que le colis quitte nos ateliers, un numéro de suivi unique vous est transmis par email. Vous pouvez également le suivre à tout moment via notre page dédiée « Suivre ma commande ».'
      }
    ]
  },
  {
    category: 'Retours, Échanges & Remboursement',
    questions: [
      {
        q: 'Quel est le délai pour retourner un article ?',
        a: 'Vous disposez d\'un délai légal et contractuel de 14 jours à compter de la réception de votre colis pour effectuer une demande de retour ou d\'échange.'
      },
      {
        q: 'Quelles sont les conditions pour qu\'un retour soit accepté ?',
        a: 'Les pièces doivent être renvoyées neuves, non portées, non lavées, avec leurs étiquettes d\'origine intactes et dans leur emballage protecteur d\'origine.'
      },
      {
        q: 'Sous quel délai le remboursement est-il effectif ?',
        a: 'Dès réception et contrôle qualité de la pièce par nos artisans, le remboursement est ordonné sur le mode de paiement d\'origine sous 5 à 7 jours ouvrés.'
      }
    ]
  },
  {
    category: 'Guide des Tailles & Confection',
    questions: [
      {
        q: 'Comment choisir la taille idéale ?',
        a: 'Un guide des mensurations détaillé est présent sur chaque fiche création. Si vous hésitez entre deux tailles, nous vous conseillons de contacter notre service conciergerie pour un avis personnalisé.'
      },
      {
        q: 'Quelles sont les matières privilégiées par Stell\'s Hope ?',
        a: 'Nous privilégions le coton biologique certifié GOTS, les fibres naturelles, le lin thermorégulant et les soies d\'exception, sélectionnées pour leur longévité et leur toucher soyeux.'
      },
      {
        q: 'Comment entretenir mes créations Stell\'s Hope ?',
        a: 'Chaque pièce est pourvue d\'une étiquette d\'entretien spécifique. Nous préconisons un lavage doux sur l\'envers à 30°C ou un nettoyage à sec pour les vestes structurées.'
      }
    ]
  }
];

export default function FAQPage({ onClose }: FAQPageProps) {
  const [openItems, setOpenItems] = useState<string[]>(['Commandes & Paiement-0']);
  const [activeCategory, setActiveCategory] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const categories = ['Tous', ...faqs.map(f => f.category)];

  const filteredFaqs = faqs
    .filter(cat => activeCategory === 'Tous' || cat.category === activeCategory)
    .map(cat => ({
      ...cat,
      questions: cat.questions.filter(q =>
        !searchQuery.trim() ||
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }))
    .filter(cat => cat.questions.length > 0);

  return (
    <div className="fixed inset-0 bg-[#FAF9F6] text-stone-900 selection:bg-stone-900 selection:text-white z-50 overflow-y-auto animate-in fade-in duration-200">
      {/* Top Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-stone-200/80 px-6 sm:px-10 py-4 flex items-center justify-between shadow-sm">
        <button
          onClick={() => onClose ? onClose() : window.history.back()}
          className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-stone-500 hover:text-stone-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Retour</span>
        </button>

        <Logo className="h-6" />

        <div className="w-20 text-right">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
            Aide & FAQ
          </span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-stone-100 text-stone-700 border border-stone-200 mb-3">
            <Sparkles className="w-3 h-3 text-terracotta-500" />
            Centre d'Assistance
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-stone-950 mb-3">
            Questions Fréquentes
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
            Retrouvez les réponses aux questions les plus usuelles sur vos commandes, les livraisons et la confection de nos créations.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-lg mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par mot-clé (livraison, taille, retour...)"
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-stone-200 rounded-full text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-950 focus:ring-4 focus:ring-stone-950/5 transition-all shadow-sm"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-stone-950 text-white shadow-sm'
                  : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-950'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordions */}
        <div className="space-y-8">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-stone-200/80 p-8">
              <HelpCircle className="w-8 h-8 text-stone-400 mx-auto mb-3" />
              <p className="font-serif text-lg font-medium text-stone-900 mb-1">Aucune réponse ne correspond</p>
              <p className="text-xs text-stone-500 mb-4">Essayez d'ajuster votre recherche ou contactez notre conciergerie.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('Tous'); }}
                className="text-xs font-semibold text-stone-950 underline underline-offset-4"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            filteredFaqs.map((catGroup) => (
              <div key={catGroup.category} className="space-y-3">
                <h2 className="font-serif text-lg font-medium text-stone-900 pl-2">
                  {catGroup.category}
                </h2>
                <div className="space-y-3">
                  {catGroup.questions.map((faqItem, idx) => {
                    const id = `${catGroup.category}-${idx}`;
                    const isOpen = openItems.includes(id);

                    return (
                      <div
                        key={id}
                        className={`bg-white border rounded-2xl transition-all duration-200 overflow-hidden ${
                          isOpen ? 'border-stone-950 shadow-sm' : 'border-stone-200/80 hover:border-stone-300'
                        }`}
                      >
                        <button
                          onClick={() => toggleItem(id)}
                          className="w-full text-left p-5 flex items-center justify-between gap-4 font-serif text-sm sm:text-base font-medium text-stone-950"
                        >
                          <span>{faqItem.q}</span>
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
                            isOpen ? 'bg-stone-950 text-white rotate-180' : 'bg-stone-100 text-stone-500'
                          }`}>
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 animate-in fade-in duration-150">
                            {faqItem.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Conciergerie CTA Card */}
        <div className="mt-14 p-8 rounded-3xl bg-white border border-stone-200/80 shadow-sm text-center max-w-lg mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-900 flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-5 h-5 text-terracotta-600" />
          </div>
          <h3 className="font-serif text-xl font-medium text-stone-950">
            Une question spécifique ?
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Notre équipe de conseillers vous apporte une réponse sur-mesure sous 24h ouvrées.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              onClick={onClose}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-950 text-white text-xs font-semibold tracking-wider uppercase hover:bg-stone-800 transition-colors shadow-card-luxury"
            >
              Écrire à la Conciergerie
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}