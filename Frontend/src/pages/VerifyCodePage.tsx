import { useState, useRef, useEffect } from 'react';
import { ShieldCheck, ArrowLeft, Sparkles, RefreshCw } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

interface VerifyCodePageProps {
  onClose?: () => void;
}

export default function VerifyCodePage({ onClose }: VerifyCodePageProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      addToast({
        type: 'error',
        message: 'Veuillez saisir le code complet à 6 chiffres',
        duration: 3000
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      addToast({
        type: 'success',
        message: 'Code vérifié avec succès !',
        duration: 3000
      });
      if (onClose) {
        onClose();
      } else {
        navigate('/');
      }
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Code de vérification invalide ou expiré',
        duration: 4000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setTimeLeft(60);
    addToast({
      type: 'success',
      message: 'Un nouveau code de vérification vous a été envoyé.',
      duration: 3000
    });
  };

  return (
    <div className="min-h-screen flex bg-[#FAF9F6] text-stone-900 selection:bg-stone-900 selection:text-white">
      {/* ── Panneau gauche — Code ── */}
      <div className="w-full lg:w-[52%] flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-y-auto">
        <div className="flex items-center justify-between">
          <Link
            to="/login"
            className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-stone-500 hover:text-stone-950 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Retour</span>
          </Link>
          <Logo className="h-7" />
        </div>

        <div className="my-auto py-10 max-w-md w-full mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-stone-100 border border-stone-200/80 flex items-center justify-center mx-auto mb-6 text-stone-900 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-stone-800" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-widest uppercase bg-stone-100 text-stone-700 border border-stone-200/80 mb-3">
            <Sparkles className="w-3 h-3 text-terracotta-500" />
            Authentification Sécurisée
          </span>

          <h1 className="font-serif text-3xl font-medium tracking-tight text-stone-900 mb-2">
            Vérifiez votre compte
          </h1>
          <p className="text-stone-500 text-sm leading-relaxed mb-8">
            Nous avons expédié un code de sécurité à 6 chiffres par email pour confirmer votre identité.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-center gap-2 sm:gap-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-11 sm:w-13 h-14 sm:h-16 text-center text-xl sm:text-2xl font-serif font-medium bg-white border border-stone-200 rounded-2xl focus:border-stone-950 focus:ring-4 focus:ring-stone-950/5 outline-none transition-all shadow-sm"
                  placeholder="•"
                />
              ))}
            </div>

            <div className="text-center">
              {timeLeft > 0 ? (
                <p className="text-xs text-stone-500">
                  Renvoyer un nouveau code dans{' '}
                  <span className="font-semibold text-stone-900">{timeLeft}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 underline underline-offset-4 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Renvoyer le code maintenant
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || code.join('').length !== 6}
              className="w-full py-4 px-6 rounded-2xl bg-stone-950 text-white font-medium text-sm tracking-wide hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-card-luxury flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Vérification en cours...</span>
                </>
              ) : (
                <span>Confirmer le code</span>
              )}
            </button>
          </form>

          <p className="mt-8 text-xs text-stone-400">
            Vous ne trouvez pas le message ? Vérifiez vos spams ou courriers indésirables.
          </p>
        </div>

        <div className="pt-6 border-t border-stone-200/60 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} Stell's Hope. Protocole de vérification chiffré.</p>
        </div>
      </div>

      {/* ── Panneau droit — Visuel ── */}
      <div className="hidden lg:block lg:w-[48%] relative overflow-hidden bg-stone-900">
        <img
          src="https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg"
          alt="Sécurité Stell's Hope"
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-stone-950/10" />
        <div className="absolute bottom-10 left-10 right-10">
          <div className="glass-card p-8 rounded-3xl border border-white/15 bg-stone-950/40 backdrop-blur-xl text-white shadow-2xl">
            <blockquote className="font-serif text-xl italic text-white/95 leading-relaxed">
              « Votre sécurité et la confidentialité de vos échanges demeurent notre priorité absolue. »
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}