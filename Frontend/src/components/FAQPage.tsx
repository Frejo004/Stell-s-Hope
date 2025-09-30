import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQPageProps {
  onClose: () => void;
}

const faqs = [
  {
    category: 'Commandes',
    questions: [
      {
        q: 'Comment passer une commande ?',
        a: 'Ajoutez vos articles au panier, créez un compte ou connectez-vous, puis suivez les étapes de commande.'
      },
      {
        q: 'Puis-je modifier ma commande ?',
        a: 'Vous pouvez modifier votre commande dans les 2h suivant la validation, en nous contactant.'
      },
      {
        q: 'Comment suivre ma commande ?',
        a: 'Un email de suivi vous sera envoyé avec un numéro de tracking dès l\'expédition.'
      }
    ]
  },
  {
    category: 'Livraison',
    questions: [
      {
        q: 'Quels sont les délais de livraison ?',
        a: '2-3 jours ouvrés en France métropolitaine, 5-7 jours pour l\'international.'
      },
      {
        q: 'Quels sont les frais de livraison ?',
        a: 'Livraison gratuite dès 100€, sinon 5,99€ en France métropolitaine.'
      },
      {
        q: 'Livrez-vous à l\'international ?',
        a: 'Oui, nous livrons dans toute l\'Europe et certains pays internationaux.'
      }
    ]
  },
  {
    category: 'Retours',
    questions: [
      {
        q: 'Comment retourner un article ?',
        a: 'Vous avez 30 jours pour retourner un article. Contactez-nous pour obtenir une étiquette de retour.'
      },
      {
        q: 'Les retours sont-ils gratuits ?',
        a: 'Oui, les retours sont gratuits en France métropolitaine.'
      },
      {
        q: 'Quand serai-je remboursé ?',
        a: 'Le remboursement est effectué sous 5-7 jours après réception du retour.'
      }
    ]
  },
  {
    category: 'Produits',
    questions: [
      {
        q: 'Comment choisir ma taille ?',
        a: 'Consultez notre guide des tailles disponible sur chaque fiche produit.'
      },
      {
        q: 'Comment entretenir mes vêtements ?',
        a: 'Les instructions d\'entretien sont indiquées sur l\'étiquette et la fiche produit.'
      },
      {
        q: 'Vos produits sont-ils éco-responsables ?',
        a: 'Oui, nous utilisons des matières biologiques et des processus de production éthiques.'
      }
    ]
  }
];

export default function FAQPage({ onClose }: FAQPageProps) {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        <button onClick={onClose} className="mb-6 text-gray-600 hover:text-black">
          ← Retour
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Questions Fréquentes</h1>
          <p className="text-gray-600">
            Trouvez rapidement les réponses à vos questions les plus courantes
          </p>
        </div>

        <div className="space-y-8">
          {faqs.map((category, categoryIndex) => (
            <div key={category.category}>
              <h2 className="text-xl font-bold mb-4 text-rose-300">
                {category.category}
              </h2>
              <div className="space-y-2">
                {category.questions.map((faq, faqIndex) => {
                  const itemId = `${categoryIndex}-${faqIndex}`;
                  const isOpen = openItems.includes(itemId);
                  
                  return (
                    <div key={itemId} className="border rounded-lg">
                      <button
                        onClick={() => toggleItem(itemId)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                      >
                        <span className="font-medium">{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4">
                          <p className="text-gray-600">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold mb-2">Vous ne trouvez pas votre réponse ?</h3>
          <p className="text-gray-600 mb-4">
            Notre équipe est là pour vous aider
          </p>
          <button
            onClick={onClose}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900"
          >
            Nous contacter
          </button>
        </div>
      </div>
    </div>
  );
}