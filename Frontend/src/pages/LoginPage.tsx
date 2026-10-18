import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../components/Logo';

interface LoginPageProps {
  onClose?: () => void;
}

export default function LoginPage({ onClose }: LoginPageProps) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const { login, loading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      const user = await login(formData.email, formData.password);
      addToast({ type: 'success', message: `Bienvenue ${user.first_name} !`, duration: 3000 });
      if (user.is_admin) {
        navigate('/admin');
      } else if (from) {
        navigate(from);
      } else if (onClose) {
        onClose();
      } else {
        navigate('/');
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        addToast({ type: 'error', message: 'Email ou mot de passe incorrect', duration: 4000 });
      }
    }
  };

  return (
    <div className="min-h-screen lg:h-screen flex bg-[#FAF9F6] text-stone-900 selection:bg-stone-900 selection:text-white lg:overflow-hidden">
      {/* ── Panneau gauche — Formulaire éditorial ── */}
      <div className="w-full lg:w-[52%] flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-stone-500 hover:text-stone-950 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Retour à l'Atelier</span>
          </Link>
          <Logo className="h-7" />
        </div>

        {/* Center Card */}
        <div className="my-auto py-10 max-w-md w-full mx-auto">
          {/* Badge & Title */}
          <div className="mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-widest uppercase bg-stone-100 text-stone-700 border border-stone-200/80 mb-4">
              <Sparkles className="w-3 h-3 text-terracotta-500" />
              Espace Privilège
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-stone-900 mb-2">
              Bon retour parmi nous
            </h1>
            <p className="text-stone-500 text-sm leading-relaxed">
              Connectez-vous pour retrouver votre panier, vos commandes et vos avantages exclusifs.
            </p>
          </div>

          {/* Formulaire */}
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
                  value={formData.email}
                  onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                  placeholder="nom@exemple.com"
                  className={`w-full pl-11 pr-4 py-3.5 bg-white border rounded-2xl text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all duration-200 shadow-sm ${
                    errors.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                      : 'border-stone-200 focus:border-stone-950 focus:ring-4 focus:ring-stone-950/5'
                  }`}
                />
              </div>
              {errors.email?.[0] && (
                <p className="mt-1.5 text-xs text-red-600">{errors.email[0]}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold tracking-wide uppercase text-stone-600">
                  Mot de passe
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-stone-500 hover:text-stone-950 underline underline-offset-4 transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••••••"
                  className={`w-full pl-11 pr-12 py-3.5 bg-white border rounded-2xl text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all duration-200 shadow-sm ${
                    errors.password
                      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                      : 'border-stone-200 focus:border-stone-950 focus:ring-4 focus:ring-stone-950/5'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors p-1"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password?.[0] && (
                <p className="mt-1.5 text-xs text-red-600">{errors.password[0]}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-4 px-6 rounded-2xl bg-stone-950 text-white font-medium text-sm tracking-wide hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-card-luxury flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <span>Se connecter à mon compte</span>
              )}
            </button>
          </form>

          {/* Séparateur élégant */}
          <div className="my-8 flex items-center gap-3">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">ou</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          {/* Inscription */}
          <div className="p-4 rounded-2xl bg-stone-100/70 border border-stone-200/60 text-center">
            <p className="text-xs text-stone-600">
              Vous découvrez Stell's Hope ?{' '}
              <Link
                to="/register"
                className="font-semibold text-stone-950 hover:text-terracotta-600 underline underline-offset-4 transition-colors"
              >
                Créer un compte privilège
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-stone-200/60 flex flex-wrap items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} Stell's Hope. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-stone-600 transition-colors">Confidentialité</Link>
            <Link to="/cgv" className="hover:text-stone-600 transition-colors">Conditions générales</Link>
          </div>
        </div>
      </div>

      {/* ── Panneau droit — Vitrine Haute Couture ── */}
      <div className="hidden lg:block lg:w-[48%] relative overflow-hidden bg-stone-900">
        <img
          src="https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg"
          alt="Collection Élégance Stell's Hope"
          className="w-full h-full object-cover object-center opacity-85 scale-105 hover:scale-100 transition-transform duration-1000 ease-out"
        />
        {/* Soft Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-stone-950/10" />

        {/* Carte flottante en bas */}
        <div className="absolute bottom-10 left-10 right-10">
          <div className="glass-card p-8 rounded-3xl border border-white/15 bg-stone-950/40 backdrop-blur-xl text-white shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-300 text-xs tracking-widest uppercase font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Collection Signature</span>
            </div>
            <blockquote className="font-serif text-2xl font-normal leading-relaxed italic text-white/95">
              « L'élégance n'est pas de se faire remarquer, mais de rester gravé dans les mémoires. »
            </blockquote>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Matières nobles & finitions soignées</span>
              </div>
              <span className="font-medium text-white/90">Atelier Stell's Hope</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

