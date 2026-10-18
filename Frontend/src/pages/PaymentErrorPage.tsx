import { XCircle, RefreshCw, ShoppingBag, MessageCircle, ArrowRight, ShieldAlert } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Logo from '../components/Logo';

interface PaymentErrorPageProps {
  onClose?: () => void;
}

const ERROR_MESSAGES: Record<string, { title: string; description: string }> = {
  payment_failed: {
    title: 'Règlement Non Finalisé',
    description: 'La transaction n\'a pas pu aboutir auprès de l\'émetteur bancaire ou de votre opérateur Mobile Money. Vos articles demeurent réservés.'
  },
  insufficient_funds: {
    title: 'Solde ou Provision Insuffisante',
    description: 'Le solde disponible sur votre compte ou portefeuille Mobile Money ne permet pas de valider ce montant.'
  },
  card_expired: {
    title: 'Carte Bancaire Expirée',
    description: 'La date de validité de votre carte est dépassée. Nous vous invitons à renseigner un autre moyen de paiement.'
  },
  cancelled: {
    title: 'Paiement Interrompu',
    description: 'L\'opération a été interrompue avant confirmation. Votre sélection reste soigneusement conservée dans votre commande.'
  },
  default: {
    title: 'Difficulté lors du Règlement',
    description: 'Une interruption technique est survenue lors du traitement sécurisé par la passerelle Moneroo. Veuillez réitérer votre tentative.'
  }
};

export default function PaymentErrorPage({ onClose: _onClose }: PaymentErrorPageProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const errorCode = searchParams.get('error') || 'default';
  const orderId = searchParams.get('order_id');

  const error = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.default;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 font-sans flex flex-col antialiased selection:bg-rose-100 selection:text-stone-900">
      {/* ─── En-tête Haute Couture Minimal ─── */}
      <header className="bg-white/80 backdrop-blur-md border-b border-stone-200/80 px-6 sm:px-12 py-5 flex items-center justify-between sticky top-0 z-40">
        <button onClick={() => navigate('/')} className="inline-block transition-opacity hover:opacity-80">
          <Logo className="h-6 sm:h-7" />
        </button>
        {orderId && (
          <span className="text-[11px] font-mono uppercase tracking-wider px-3 py-1 bg-stone-100 rounded-full border border-stone-200 text-stone-700">
            Dossier #{orderId}
          </span>
        )}
      </header>

      {/* ─── Contenu Central ─── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="max-w-xl w-full space-y-8 animate-in fade-in duration-500">
          {/* Badge & Titre d'erreur */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-rose-50 border border-rose-200/60 flex items-center justify-center mx-auto shadow-sm">
              <XCircle className="w-10 h-10 text-rose-500" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-terracotta-600">
                Notification de Sécurité
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-normal text-stone-950 tracking-tight">
                {error.title}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed max-w-md mx-auto">
                {error.description}
              </p>
            </div>
          </div>

          {/* Bandeau de réassurance commande conservée */}
          {orderId && (
            <div className="bg-stone-50 border border-stone-200/80 rounded-3xl p-5 flex items-start gap-4 shadow-sm">
              <div className="w-9 h-9 rounded-2xl bg-stone-950 text-white flex items-center justify-center shrink-0 mt-0.5">
                <ShieldAlert className="w-4 h-4 text-terracotta-400" />
              </div>
              <div className="text-xs space-y-1">
                <p className="font-serif font-medium text-stone-950 text-sm">Votre sélection est mise de côté</p>
                <p className="text-stone-600 font-light leading-relaxed">
                  La commande #{orderId} a été enregistrée à l'atelier en attente de validation. Vous pouvez relancer le paiement sans avoir à rechoisir vos articles.
                </p>
              </div>
            </div>
          )}

          {/* Boutons d'Action */}
          <div className="space-y-3 pt-2">
            {/* Réessayer le paiement */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-between px-6 py-4 bg-stone-950 hover:bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-full shadow-md hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-3">
                <RefreshCw className="w-4 h-4 text-terracotta-400 group-hover:rotate-180 transition-transform duration-500" />
                <span>Réessayer le paiement sécurisé</span>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 group-hover:text-white transition-all" />
            </button>

            {/* Continuer les achats */}
            <button
              onClick={() => navigate('/boutique')}
              className="w-full flex items-center justify-between px-6 py-4 bg-white hover:bg-stone-50 text-stone-800 text-xs uppercase tracking-widest font-medium rounded-full border border-stone-200 shadow-2xs hover:border-stone-300 transition-all group"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 text-stone-500" />
                <span>Poursuivre ma visite en boutique</span>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-300 group-hover:translate-x-1 group-hover:text-stone-700 transition-all" />
            </button>

            {/* Contacter le service Conciergerie */}
            <button
              onClick={() => navigate('/contact')}
              className="w-full flex items-center justify-between px-6 py-3.5 bg-transparent hover:bg-stone-100 text-stone-600 text-xs font-medium rounded-full transition-all group"
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-stone-400" />
                <span>Assistance Conciergerie & Stylistes</span>
              </div>
              <span className="text-[11px] text-stone-400 font-light group-hover:text-stone-700">Nous écrire</span>
            </button>
          </div>

          {/* Guide des points à vérifier */}
          <div className="p-6 bg-white rounded-3xl border border-stone-200/80 shadow-sm space-y-3">
            <h3 className="font-serif text-sm font-medium text-stone-950">
              Vérifications usuelles en cas de refus :
            </h3>
            <ul className="space-y-2 text-xs text-stone-600 font-light">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500 mt-1.5 shrink-0" />
                <span>Confirmez le solde de votre compte Wave, Orange Money, MTN ou Moov Money.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500 mt-1.5 shrink-0" />
                <span>Vérifiez la validation de l'authentification 3D Secure (code SMS reçu de votre banque).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500 mt-1.5 shrink-0" />
                <span>Assurez-vous que le plafond d'achat en ligne de votre carte n'est pas atteint.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
