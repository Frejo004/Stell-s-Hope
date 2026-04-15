import { XCircle, RefreshCw, ShoppingBag, MessageCircle, ChevronRight } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Logo from '../components/Logo';

interface PaymentErrorPageProps {
  onClose?: () => void;
}

const ERROR_MESSAGES: Record<string, { title: string; description: string }> = {
  payment_failed: {
    title: 'Paiement refusé',
    description: 'Votre paiement n\'a pas pu être traité. Vérifiez vos informations bancaires et réessayez.'
  },
  insufficient_funds: {
    title: 'Fonds insuffisants',
    description: 'Votre compte ne dispose pas des fonds nécessaires pour cette transaction.'
  },
  card_expired: {
    title: 'Carte expirée',
    description: 'La carte utilisée est expirée. Veuillez utiliser une autre carte.'
  },
  cancelled: {
    title: 'Paiement annulé',
    description: 'Vous avez annulé le paiement. Votre commande est en attente.'
  },
  default: {
    title: 'Erreur de paiement',
    description: 'Une erreur inattendue s\'est produite lors du traitement de votre paiement.'
  }
};

export default function PaymentErrorPage({ onClose }: PaymentErrorPageProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const errorCode = searchParams.get('error') || 'default';
  const orderId = searchParams.get('order_id');

  const error = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.default;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header minimal */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="inline-block">
          <Logo className="h-7" />
        </button>
        {orderId && (
          <span className="text-sm text-gray-500">Commande #{orderId}</span>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-lg w-full">
          {/* Icône erreur */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{error.title}</h1>
            <p className="text-gray-500 text-lg leading-relaxed">{error.description}</p>
          </div>

          {/* Votre commande est sauvegardée */}
          {orderId && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-800">Votre commande est sauvegardée</p>
                <p className="text-sm text-blue-600 mt-0.5">
                  La commande #{orderId} est en attente de paiement. Vous pouvez réessayer sans repasser votre commande.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            {/* Réessayer le paiement */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-between bg-black text-white px-6 py-4 rounded-xl font-semibold hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl group"
            >
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5" />
                <span>Réessayer le paiement</span>
              </div>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Continuer les achats */}
            <button
              onClick={() => navigate('/boutique')}
              className="w-full flex items-center justify-between bg-white text-gray-800 px-6 py-4 rounded-xl font-semibold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-gray-500" />
                <span>Continuer mes achats</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Contacter le support */}
            <button
              onClick={() => navigate('/contact')}
              className="w-full flex items-center justify-between bg-white text-gray-600 px-6 py-4 rounded-xl font-medium border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-gray-400" />
                <span>Contacter le support</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Aide */}
          <div className="mt-8 p-4 bg-white rounded-xl border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Causes fréquentes d'un paiement refusé</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 mt-0.5">•</span>
                Informations de carte incorrectes (numéro, date, CVV)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 mt-0.5">•</span>
                Plafond de paiement en ligne atteint
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 mt-0.5">•</span>
                Paiement bloqué par votre banque (contactez-la)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 mt-0.5">•</span>
                Solde insuffisant sur votre Mobile Money
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
