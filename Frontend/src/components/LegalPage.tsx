import React from 'react';

interface LegalPageProps {
  onClose: () => void;
  type: 'cgv' | 'privacy' | 'shipping';
}

const content = {
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
      <div className="max-w-4xl mx-auto p-6">
        <button onClick={onClose} className="mb-6 text-gray-600 hover:text-black">
          ← Retour
        </button>

        <div className="prose max-w-none">
          <h1 className="text-3xl font-bold mb-8">{pageContent.title}</h1>
          
          <div className="space-y-6">
            {pageContent.sections.map((section, index) => (
              <div key={index}>
                <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
                <p className="text-gray-700 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Contact</h3>
            <p className="text-sm text-gray-600">
              Pour toute question concernant ces conditions, contactez-nous à :<br />
              <strong>contact@stellshope.fr</strong> ou <strong>+33 1 23 45 67 89</strong>
            </p>
            <p className="text-xs text-gray-500 mt-4">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}