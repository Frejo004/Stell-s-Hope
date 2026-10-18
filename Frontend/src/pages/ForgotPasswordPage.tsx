import { useState } from 'react';
import { Mail, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { authService } from '../services/authService';

interface ForgotPasswordPageProps {
  onClose?: () => void;
}

export default function ForgotPasswordPage({ onClose: _onClose }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await authService.forgotPassword({ email });
      setEmailSent(true);
    } catch (err: any) {
      if (err.response?.data?.errors?.email) {
        setError(err.response.data.errors.email[0]);
      } else {
        addToast({ type: 'error', message: 'Erreur lors de l\'envoi de l\'email', duration: 4000 });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen flex bg-[#FAF9F6] text-stone-900 selection:bg-stone-900 selection:text-white lg:overflow-hidden">
      {/* ── Panneau gauche — Formulaire ── */}
      <div className="w-full lg:w-[52%] flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-y-auto">
        <div className="flex items-center justify-between">
          <Link
            to="/login"
            className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-stone-500 hover:text-stone-950 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Retour à la connexion</span>
          </Link>
          <Logo className="h-7" />
        </div>

        <div className="my-auto py-10 max-w-md w-full mx-auto">
          {!emailSent ? (
            <>
              <div className="mb-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-widest uppercase bg-stone-100 text-stone-700 border border-stone-200/80 mb-4">
                  <Sparkles className="w-3 h-3 text-terracotta-500" />
                  Sécurité du compte
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-stone-900 mb-2">
                  Mot de passe oublié
                </h1>
                <p className="text-stone-500 text-sm leading-relaxed">
                  Saisissez l'adresse email associée à votre compte. Nous vous transmettrons les instructions sécurisées pour créer un nouveau mot de passe.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold tracking-wide uppercase text-stone-600 mb-1.5">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nom@exemple.com"
                      className={`w-full pl-11 pr-4 py-3.5 bg-white border rounded-2xl text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all duration-200 shadow-sm ${
                        error
                          ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                          : 'border-stone-200 focus:border-stone-950 focus:ring-4 focus:ring-stone-950/5'
                      }`}
                    />
                  </div>
                  {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-4 px-6 rounded-2xl bg-stone-950 text-white font-medium text-sm tracking-wide hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-card-luxury flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Envoi des instructions...</span>
                    </>
                  ) : (
                    <span>Envoyer les instructions</span>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h1 className="font-serif text-3xl font-medium text-stone-900 mb-3">Vérifiez vos emails</h1>
              <p className="text-stone-500 text-sm mb-3">
                Un lien de réinitialisation sécurisé vient d'être expédié à :
              </p>
              <p className="font-semibold text-stone-900 text-base mb-6 bg-stone-100 py-2 px-4 rounded-xl inline-block">
                {email}
              </p>
              <p className="text-xs text-stone-400 mb-6 leading-relaxed">
                Pensez à vérifier votre dossier de courriers indésirables ou spams si vous ne le recevez pas sous 3 minutes.
              </p>
              <button
                type="button"
                onClick={() => setEmailSent(false)}
                className="text-xs font-semibold text-stone-900 hover:text-terracotta-600 underline underline-offset-4 transition-colors"
              >
                Renvoyer à une autre adresse
              </button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-stone-200/60 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-950 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour à l'écran de connexion</span>
            </Link>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-200/60 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} Stell's Hope. Service d'assistance client confidentiel.</p>
        </div>
      </div>

      {/* ── Panneau droit — Visuel ── */}
      <div className="hidden lg:block lg:w-[48%] relative overflow-hidden bg-stone-900">
        <img
          src="https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg"
          alt="Sécurité Stell's Hope"
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-stone-950/10" />
        <div className="absolute bottom-10 left-10 right-10">
          <div className="glass-card p-8 rounded-3xl border border-white/15 bg-stone-950/40 backdrop-blur-xl text-white shadow-2xl">
            <blockquote className="font-serif text-xl italic text-white/95 leading-relaxed">
              « La sérénité commence avec la certitude d'être accompagné avec discrétion et bienveillance. »
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}

