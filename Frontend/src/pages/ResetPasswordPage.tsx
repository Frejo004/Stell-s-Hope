import { useState } from 'react';
import { Eye, EyeOff, Lock, CheckCircle2, ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Logo from '../components/Logo';
import { authService } from '../services/authService';

interface ResetPasswordPageProps {
  onClose?: () => void;
}

export default function ResetPasswordPage({ onClose: _onClose }: ResetPasswordPageProps) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [formData, setFormData] = useState({
    password: '',
    password_confirmation: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const { addToast } = useToast();
  const navigate = useNavigate();

  const passwordStrength = (pwd: string) => {
    if (pwd.length === 0) return null;
    if (pwd.length < 6) return { level: 'Faible', color: 'bg-red-400', width: 'w-1/4' };
    if (pwd.length < 8) return { level: 'Modéré', color: 'bg-amber-400', width: 'w-2/4' };
    if (!/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) return { level: 'Bon', color: 'bg-terracotta-400', width: 'w-3/4' };
    return { level: 'Optimal', color: 'bg-emerald-500', width: 'w-full' };
  };

  const strength = passwordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (formData.password !== formData.password_confirmation) {
      setErrors({ password_confirmation: ['Les mots de passe ne correspondent pas'] });
      return;
    }

    if (formData.password.length < 8) {
      setErrors({ password: ['Le mot de passe doit contenir au moins 8 caractères'] });
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({
        email,
        token,
        password: formData.password,
        password_confirmation: formData.password_confirmation
      });
      setIsSuccess(true);
      addToast({ type: 'success', message: 'Mot de passe réinitialisé avec succès !', duration: 3000 });
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        addToast({ type: 'error', message: 'Lien invalide ou expiré. Veuillez renouveler votre demande.', duration: 4000 });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen flex bg-[#FAF9F6] text-stone-900 selection:bg-stone-900 selection:text-white lg:overflow-hidden">
      {/* ── Panneau gauche ── */}
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
          {isSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h1 className="font-serif text-3xl font-medium text-stone-900 mb-3">Mot de passe réinitialisé</h1>
              <p className="text-stone-500 text-sm mb-8 leading-relaxed">
                Votre nouveau mot de passe a été validé avec succès. Vous pouvez à présent vous identifier en toute sécurité.
              </p>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full py-4 px-6 rounded-2xl bg-stone-950 text-white font-medium text-sm tracking-wide hover:bg-stone-800 transition-all duration-200 shadow-card-luxury"
              >
                Se connecter avec le nouveau mot de passe
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-widest uppercase bg-stone-100 text-stone-700 border border-stone-200/80 mb-4">
                  <Sparkles className="w-3 h-3 text-terracotta-500" />
                  Nouveau code d'accès
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-stone-900 mb-2">
                  Créer un mot de passe
                </h1>
                <p className="text-stone-500 text-sm leading-relaxed">
                  Choisissez une clé sécurisée d'au moins 8 caractères avec majuscules et chiffres.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold tracking-wide uppercase text-stone-600 mb-1.5">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Minimum 8 caractères"
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
                      aria-label="Afficher le mot de passe"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {strength && (
                    <div className="mt-2.5">
                      <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1">Force : <span className="font-semibold text-stone-900">{strength.level}</span></p>
                    </div>
                  )}
                  {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password[0]}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-wide uppercase text-stone-600 mb-1.5">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      required
                      value={formData.password_confirmation}
                      onChange={(e) => setFormData(prev => ({ ...prev, password_confirmation: e.target.value }))}
                      placeholder="Répétez le mot de passe"
                      className={`w-full pl-11 pr-12 py-3.5 bg-white border rounded-2xl text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all duration-200 shadow-sm ${
                        errors.password_confirmation
                          ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                          : 'border-stone-200 focus:border-stone-950 focus:ring-4 focus:ring-stone-950/5'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors p-1"
                      aria-label="Afficher le mot de passe"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formData.password_confirmation && (
                    <p className={`text-[11px] mt-1 font-medium ${
                      formData.password === formData.password_confirmation ? 'text-emerald-600' : 'text-red-500'
                    }`}>
                      {formData.password === formData.password_confirmation
                        ? '✓ Les mots de passe concordent parfaitement'
                        : '✗ Les mots de passe ne correspondent pas'}
                    </p>
                  )}
                  {errors.password_confirmation && (
                    <p className="mt-1 text-xs text-red-600">{errors.password_confirmation[0]}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-4 px-6 rounded-2xl bg-stone-950 text-white font-medium text-sm tracking-wide hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-card-luxury flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <span>Mettre à jour mon mot de passe</span>
                  )}
                </button>
              </form>
            </>
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
          <p>© {new Date().getFullYear()} Stell's Hope. Tous droits réservés.</p>
        </div>
      </div>

      {/* ── Panneau droit — Visuel ── */}
      <div className="hidden lg:block lg:w-[48%] relative overflow-hidden bg-stone-900">
        <img
          src="https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg"
          alt="Atelier Stell's Hope"
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-stone-950/10" />
        <div className="absolute bottom-10 left-10 right-10">
          <div className="glass-card p-8 rounded-3xl border border-white/15 bg-stone-950/40 backdrop-blur-xl text-white shadow-2xl">
            <div className="flex items-center gap-2 text-rose-300 text-xs tracking-widest uppercase font-semibold mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Chiffrement certifié</span>
            </div>
            <blockquote className="font-serif text-xl italic text-white/95 leading-relaxed">
              « Votre sécurité est le garant de notre relation de confiance. »
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}

