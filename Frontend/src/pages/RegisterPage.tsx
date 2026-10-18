import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

interface RegisterPageProps {
  onClose?: () => void;
}

export default function RegisterPage({ onClose }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [accepted, setAccepted] = useState(false);
  const { register, loading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (formData.password !== formData.password_confirmation) {
      setErrors({ password_confirmation: ['Les mots de passe ne correspondent pas'] });
      return;
    }

    try {
      await register(formData);
      addToast({ type: 'success', message: 'Compte créé ! Bienvenue chez Stell\'s Hope', duration: 3000 });
      if (onClose) {
        onClose();
      } else {
        navigate('/');
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        addToast({ type: 'error', message: 'Erreur lors de la création du compte', duration: 4000 });
      }
    }
  };

  return (
    <div className="min-h-screen lg:h-screen flex bg-[#FAF9F6] text-stone-900 selection:bg-stone-900 selection:text-white lg:overflow-hidden">
      {/* ── Panneau gauche — Formulaire d'inscription ── */}
      <div className="w-full lg:w-[54%] flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-y-auto">
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

        {/* Center Container */}
        <div className="my-auto py-8 max-w-md w-full mx-auto">
          {/* Badge & Title */}
          <div className="mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-widest uppercase bg-stone-100 text-stone-700 border border-stone-200/80 mb-3">
              <Sparkles className="w-3 h-3 text-terracotta-500" />
              Rejoindre la Maison
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-stone-900 mb-2">
              Créer votre compte
            </h1>
            <p className="text-stone-500 text-sm leading-relaxed">
              Bénéficiez du suivi de commandes en direct, de vos favoris synchronisés et d'attentions exclusives.
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Prénom & Nom */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold tracking-wide uppercase text-stone-600 mb-1.5">
                  Prénom
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData(p => ({ ...p, first_name: e.target.value }))}
                    placeholder="Jean"
                    className={`w-full pl-10 pr-3 py-3 bg-white border rounded-2xl text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all duration-200 shadow-sm ${
                      errors.first_name
                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                        : 'border-stone-200 focus:border-stone-950 focus:ring-4 focus:ring-stone-950/5'
                    }`}
                  />
                </div>
                {errors.first_name?.[0] && (
                  <p className="mt-1 text-xs text-red-600">{errors.first_name[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wide uppercase text-stone-600 mb-1.5">
                  Nom
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={(e) => setFormData(p => ({ ...p, last_name: e.target.value }))}
                    placeholder="Dupont"
                    className={`w-full pl-10 pr-3 py-3 bg-white border rounded-2xl text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all duration-200 shadow-sm ${
                      errors.last_name
                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                        : 'border-stone-200 focus:border-stone-950 focus:ring-4 focus:ring-stone-950/5'
                    }`}
                  />
                </div>
                {errors.last_name?.[0] && (
                  <p className="mt-1 text-xs text-red-600">{errors.last_name[0]}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold tracking-wide uppercase text-stone-600 mb-1.5">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                  placeholder="nom@exemple.com"
                  className={`w-full pl-10 pr-4 py-3 bg-white border rounded-2xl text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all duration-200 shadow-sm ${
                    errors.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                      : 'border-stone-200 focus:border-stone-950 focus:ring-4 focus:ring-stone-950/5'
                  }`}
                />
              </div>
              {errors.email?.[0] && (
                <p className="mt-1 text-xs text-red-600">{errors.email[0]}</p>
              )}
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-xs font-semibold tracking-wide uppercase text-stone-600 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                  placeholder="Minimum 8 caractères"
                  className={`w-full pl-10 pr-11 py-3 bg-white border rounded-2xl text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all duration-200 shadow-sm ${
                    errors.password
                      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                      : 'border-stone-200 focus:border-stone-950 focus:ring-4 focus:ring-stone-950/5'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors p-1"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password?.[0] && (
                <p className="mt-1 text-xs text-red-600">{errors.password[0]}</p>
              )}
            </div>

            {/* Confirmation Mot de passe */}
            <div>
              <label className="block text-xs font-semibold tracking-wide uppercase text-stone-600 mb-1.5">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={formData.password_confirmation}
                  onChange={(e) => setFormData(p => ({ ...p, password_confirmation: e.target.value }))}
                  placeholder="Répétez votre mot de passe"
                  className={`w-full pl-10 pr-11 py-3 bg-white border rounded-2xl text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all duration-200 shadow-sm ${
                    errors.password_confirmation
                      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                      : 'border-stone-200 focus:border-stone-950 focus:ring-4 focus:ring-stone-950/5'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors p-1"
                  aria-label={showConfirm ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password_confirmation?.[0] && (
                <p className="mt-1 text-xs text-red-600">{errors.password_confirmation[0]}</p>
              )}
            </div>

            {/* CGV Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group pt-1">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  required
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                  accepted ? 'bg-stone-950 border-stone-950 text-white' : 'border-stone-300 bg-white group-hover:border-stone-400'
                }`}>
                  {accepted && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-xs text-stone-600 leading-relaxed">
                J'accepte les{' '}
                <Link to="/cgv" className="font-semibold text-stone-900 hover:text-terracotta-600 underline underline-offset-2">
                  conditions générales
                </Link>{' '}
                et la{' '}
                <Link to="/privacy" className="font-semibold text-stone-900 hover:text-terracotta-600 underline underline-offset-2">
                  politique de confidentialité
                </Link>
                .
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !accepted}
              className="w-full mt-3 py-3.5 px-6 rounded-2xl bg-stone-950 text-white font-medium text-sm tracking-wide hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-card-luxury flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Création en cours...</span>
                </>
              ) : (
                <span>Rejoindre Stell's Hope</span>
              )}
            </button>
          </form>

          {/* Lien connexion */}
          <div className="mt-6 p-4 rounded-2xl bg-stone-100/70 border border-stone-200/60 text-center">
            <p className="text-xs text-stone-600">
              Déjà membre de l'Atelier ?{' '}
              <Link
                to="/login"
                className="font-semibold text-stone-950 hover:text-terracotta-600 underline underline-offset-4 transition-colors"
              >
                Se connecter à mon compte
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
      <div className="hidden lg:block lg:w-[46%] relative overflow-hidden bg-stone-900">
        <img
          src="https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg"
          alt="Collection Stell's Hope"
          className="w-full h-full object-cover object-center opacity-85 scale-105 hover:scale-100 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-stone-950/10" />

        <div className="absolute bottom-10 left-10 right-10">
          <div className="glass-card p-8 rounded-3xl border border-white/15 bg-stone-950/40 backdrop-blur-xl text-white shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-300 text-xs tracking-widest uppercase font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Communauté Stell's Hope</span>
            </div>
            <blockquote className="font-serif text-2xl font-normal leading-relaxed italic text-white/95">
              « Chaque création raconte une histoire, celle de l'audace et de la modernité. »
            </blockquote>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Expédition suivie & emballage soigné</span>
              </div>
              <span className="font-medium text-white/90">L'Excellence au quotidien</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

