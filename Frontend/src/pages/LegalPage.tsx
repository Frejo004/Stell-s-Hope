;

interface LegalPageProps {
  onClose: () => void;
  type: 'cgv' | 'privacy' | 'shipping';
}

const content = {
  // CGV : Ajout d'une icône pour une identification visuelle rapide.
  cgv: {
    title: 'Conditions Générales de Vente',
    sections: [
      {
        title: '1. Objet',
        content: 'Les présentes conditions générales de vente régissent les relations contractuelles entre Stell\'s Hope et ses clients.'
      },
      {
        title: '2. Commandes',
        content: 'Toute commande implique l\'acceptation pleine et entière des présentes conditions générales de vente.'
      },
      {
        title: '3. Prix',
        content: 'Les prix sont indiqués en euros TTC. Stell\'s Hope se réserve le droit de modifier ses prix à tout moment.'
      },
      {
        title: '4. Paiement',
        content: 'Le paiement s\'effectue par carte bancaire ou PayPal. La commande n\'est validée qu\'après encaissement.'
      },
      {
        title: '5. Livraison',
        content: 'Les délais de livraison sont de 2-3 jours ouvrés en France métropolitaine.'
      },
      {
        title: '6. Droit de rétractation',
        content: 'Vous disposez d\'un délai de 30 jours pour retourner vos articles sans justification.'
      }
    ]
  },
  // Politique de confidentialité : Ajout d'une icône pour renforcer la confiance.
  privacy: {
    title: 'Politique de Confidentialité',
    sections: [
      {
        title: '1. Collecte des données',
        content: 'Nous collectons uniquement les données nécessaires au traitement de vos commandes et à l\'amélioration de nos services.'
      },
      {
        title: '2. Utilisation des données',
        content: 'Vos données sont utilisées pour traiter vos commandes, vous contacter et personnaliser votre expérience.'
      },
      {
        title: '3. Protection des données',
        content: 'Nous mettons en œuvre toutes les mesures techniques et organisationnelles pour protéger vos données.'
      },
      {
        title: '4. Vos droits',
        content: 'Vous disposez d\'un droit d\'accès, de rectification et de suppression de vos données personnelles.'
      },
      {
        title: '5. Cookies',
        content: 'Notre site utilise des cookies pour améliorer votre navigation et analyser notre trafic.'
      }
    ]
  },
  // Livraison & Retours : Ajout d'une icône pour une meilleure clarté.
  shipping: {
    title: 'Livraison & Retours',
    sections: [
      {
        title: '1. Zones de livraison',
        content: 'Nous livrons en France métropolitaine, DOM-TOM et dans toute l\'Europe.'
      },
      {
        title: '2. Délais de livraison',
        content: 'France : 2-3 jours ouvrés, Europe : 5-7 jours ouvrés, International : 7-14 jours ouvrés.'
      },
      {
        title: '3. Frais de livraison',
        content: 'Livraison gratuite dès 100€, sinon 5,99€ en France, 9,99€ en Europe.'
      },
      {
        title: '4. Retours gratuits',
        content: '30 jours pour retourner vos articles. Retours gratuits en France métropolitaine.'
      },
      {
        title: '5. Échanges',
        content: 'Possibilité d\'échange de taille ou couleur sous 30 jours.'
      }
    ]
  }
};

export default function LegalPage({ onClose, type }: LegalPageProps) {
  const pageContent = content[type];

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6 sm:p-8">
        <button onClick={onClose} className="mb-8 text-gray-600 hover:text-black transition-colors">
          ← Retour
        </button>

        <div className="prose max-w-none prose-h1:font-bold prose-h1:text-3xl prose-h2:font-semibold prose-h2:text-xl">
          <div className="flex items-center mb-8">
            {type === 'cgv' && <FileText className="w-8 h-8 mr-4 text-rose-400" />}
            {type === 'privacy' && <Shield className="w-8 h-8 mr-4 text-rose-400" />}
            {type === 'shipping' && <Truck className="w-8 h-8 mr-4 text-rose-400" />}
            <h1>{pageContent.title}</h1>
          </div>
          
          <div className="space-y-8">
            {pageContent.sections.map((section, index) => (
              <div key={index}>
                <h2 className="mb-3">{section.title}</h2>
                <p className="text-gray-700 leading-relaxed mt-0">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Contact</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>Pour toute question, n'hésitez pas à nous contacter :</p>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-500" /> <strong>contact@stellshope.fr</strong>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-gray-500" /> <strong>+33 1 23 45 67 89</strong>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}