import { FileText, Shield, Truck, Mail, Phone, ArrowLeft, Sparkles } from 'lucide-react';
import { formatPrice } from '../utils';
import { BUSINESS_CONSTANTS } from '../constants';
import Logo from '../components/Logo';

interface LegalPageProps {
  onClose?: () => void;
  type: 'cgv' | 'privacy' | 'shipping';
}

const content = {
  cgv: {
    title: 'Conditions Générales de Vente',
    badge: 'Cadre Contractuel',
    sections: [
      {
        title: '1. Objet & Champ d\'application',
        content: 'Les présentes conditions générales de vente régissent l\'ensemble des relations contractuelles entre la Maison Stell\'s Hope et ses clients acheteurs dans le cadre de la vente de vêtements, accessoires et maroquinerie.'
      },
      {
        title: '2. Commandes & Validations',
        content: 'Toute validation de panier par le client constitue une commande ferme et définitive, sous réserve de disponibilité des matières et de confirmation d\'encaissement sécurisé.'
      },
      {
        title: '3. Tarification & Devises',
        content: `Les tarifs sont libellés en Francs CFA (XOF) toutes taxes comprises. Stell's Hope se réserve la faculté d'ajuster ses barèmes lors du lancement de nouvelles collections sans préavis.`
      },
      {
        title: '4. Modalités de Règlement',
        content: 'Le règlement des achats s\'effectue par Carte bancaire (Visa, Mastercard avec protocole 3D Secure) ou par solutions Mobile Money agrégées par notre partenaire certifié Moneroo.'
      },
      {
        title: '5. Acheminement & Transfert des Risques',
        content: `La livraison est effectuée à l'adresse de destination indiquée lors de la commande. Les délais moyens sont de 48h à 72h ouvrées. La livraison est offerte à partir de ${formatPrice(BUSINESS_CONSTANTS.FREE_SHIPPING_THRESHOLD)}.`
      },
      {
        title: '6. Rétractation & Conformité',
        content: 'Conformément aux règles du commerce électronique et à nos engagements de satisfaction, vous bénéficiez d\'un délai de 14 jours francs pour retourner vos pièces neuves et non portées.'
      }
    ]
  },
  privacy: {
    title: 'Politique de Confidentialité',
    badge: 'Protection des Données',
    sections: [
      {
        title: '1. Collecte Responsable',
        content: 'Nous recueillons uniquement les informations requises pour le bon traitement de vos commandes, l\'expédition de vos colis et l\'accès à votre Salon Privilège.'
      },
      {
        title: '2. Finalités des Traitements',
        content: 'Vos données permettent le suivi logistique, la notification par email de l\'état de vos colis et, si vous y consentez, l\'envoi de nos lettres d\'inspiration exclusives.'
      },
      {
        title: '3. Chiffrement & Sécurité Bancaire',
        content: 'Aucune donnée relative à vos numéros de cartes de crédit ou codes secrets Mobile Money n\'est stockée sur nos serveurs. Les flux sont intégralement chiffrés par Moneroo.'
      },
      {
        title: '4. Vos Droits & Accès',
        content: 'Vous disposez d\'un droit constant d\'accès, de modification, de portabilité et de suppression intégrale de vos informations personnelles sur simple demande à notre Conciergerie.'
      },
      {
        title: '5. Traceurs & Cookies',
        content: 'Notre plateforme emploie des cookies d\'authentification et de maintien de panier afin de fluidifier votre navigation sans solliciter de traceurs publicitaires intrusifs.'
      }
    ]
  },
  shipping: {
    title: 'Livraison & Expéditions',
    badge: 'Politique Logistique',
    sections: [
      {
        title: '1. Périmètre de Desserte',
        content: 'La Maison Stell\'s Hope dessert l\'ensemble des communes d\'Abidjan, les grandes métropoles régionales et prépare des expéditions sous douane pour l\'international.'
      },
      {
        title: '2. Délais de Confection & Envoi',
        content: 'Chaque commande est vérifiée et emballée à la main avec papier de soie sous 24h ouvrées. L\'acheminement s\'effectue ensuite sous 24h à 72h selon la destination.'
      },
      {
        title: '3. Barème des Frais de Port',
        content: `La livraison suivie est gracieusement offerte pour toute acquisition égale ou supérieure à ${formatPrice(BUSINESS_CONSTANTS.FREE_SHIPPING_THRESHOLD)}. En deçà, un forfait de ${formatPrice(BUSINESS_CONSTANTS.SHIPPING_COST)} est appliqué.`
      },
      {
        title: '4. Suivi Temps Réel',
        content: 'Un numéro de suivi vous permet de connaître chaque étape d\'acheminement via notre outil de suivi de commande en ligne.'
      },
      {
        title: '5. Retours & Échanges de Taille',
        content: 'Si la coupe ou la nuance ne vous donnait pas entière satisfaction, notre conciergerie organise l\'échange de taille dans la limite des stocks disponibles.'
      }
    ]
  }
};

export default function LegalPage({ onClose, type }: LegalPageProps) {
  const pageContent = content[type];

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
            Légal
          </span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-stone-100 text-stone-700 border border-stone-200 mb-3">
            <Sparkles className="w-3 h-3 text-terracotta-500" />
            {pageContent.badge}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-stone-950 mb-3">
            {pageContent.title}
          </h1>
          <p className="text-xs text-stone-500">
            Maison Stell's Hope • Document contractuel en vigueur
          </p>
        </div>

        <div className="space-y-6">
          {pageContent.sections.map((section, idx) => (
            <div
              key={idx}
              className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-2.5"
            >
              <h2 className="font-serif text-base sm:text-lg font-medium text-stone-950">
                {section.title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-3xl bg-stone-100/70 border border-stone-200/60 text-center text-xs text-stone-500">
          <p>
            Pour toute question juridique ou demande particulière, notre service conciergerie est à votre disposition par email à{' '}
            <strong className="text-stone-900">contact@stellshope.com</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}