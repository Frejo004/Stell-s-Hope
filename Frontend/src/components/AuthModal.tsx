import { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import Logo from './Logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const { login, register, loading } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register({
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          password: formData.password,
          password_confirmation: formData.password,
        });
      }
      onClose();
    } catch (error: any) {
      if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg(mode === 'login' ? 'Identifiants invalides' : 'Erreur lors de la création');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 transition-all">
      <div
        className="bg-[#FAF9F6] border border-stone-200/80 rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md relative overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-stone-900"
        role="dialog"
        aria-modal="true"
      >
        {/* Top subtle bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-stone-900 via-rose-300 to-terracotta-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Branding */}
        <div className="text-center mb-6">
          <Logo className="h-6 mx-auto mb-2" />
          <p className="text-xs text-stone-500 tracking-wide uppercase font-semibold">
            Atelier & Maroquinerie
          </p>
        </div>

        {/* Mode Switcher Pills */}
        <div className="flex p-1 bg-stone-200/60 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
              mode === 'login'
                ? 'bg-white text-stone-950 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Se connecter
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
              mode === 'register'
                ? 'bg-white text-stone-950 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Créer un compte
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold tracking-wide uppercase text-stone-600 mb-1">
                  Prénom
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Jean"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-950 focus:ring-2 focus:ring-stone-950/5 transition-all shadow-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-wide uppercase text-stone-600 mb-1">
                  Nom
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Dupont"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-950 focus:ring-2 focus:ring-stone-950/5 transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold tracking-wide uppercase text-stone-600 mb-1">
              Adresse email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="votre@email.com"
                className="w-full pl-10 pr-3 py-3 bg-white border border-stone-200 rounded-2xl text-xs text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-950 focus:ring-2 focus:ring-stone-950/5 transition-all shadow-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-semibold tracking-wide uppercase text-stone-600">
                Mot de passe
              </label>
              {mode === 'login' && (
                <Link
                  to="/forgot-password"
                  onClick={onClose}
                  className="text-[11px] text-stone-500 hover:text-stone-950 underline underline-offset-2"
                >
                  Oublié ?
                </Link>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-3 bg-white border border-stone-200 rounded-2xl text-xs text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-950 focus:ring-2 focus:ring-stone-950/5 transition-all shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors p-1"
                aria-label="Afficher le mot de passe"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-2xl bg-stone-950 text-white font-medium text-xs tracking-wider uppercase hover:bg-stone-800 disabled:opacity-50 transition-all duration-200 shadow-card-luxury flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Traitement...</span>
              </>
            ) : (
              <>
                <span>{mode === 'login' ? 'Accéder à mon compte' : 'Rejoindre l\'Atelier'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-stone-200/60 text-center">
          <p className="text-[11px] text-stone-500">
            {mode === 'login' ? (
              <>
                Nouveau chez Stell's Hope ?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMsg(''); }}
                  className="font-semibold text-stone-900 hover:text-terracotta-600 underline underline-offset-2"
                >
                  Créer un compte
                </button>
              </>
            ) : (
              <>
                Déjà client ?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(''); }}
                  className="font-semibold text-stone-900 hover:text-terracotta-600 underline underline-offset-2"
                >
                  Se connecter
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}