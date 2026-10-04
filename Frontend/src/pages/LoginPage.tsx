import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

interface LoginPageProps {
  onClose: () => void;
}

export default function LoginPage({ onClose }: LoginPageProps) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const { login, loading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirection après login vers la page d'origine si disponible
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
      } else {
        onClose();
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
    <div className="h-screen flex overflow-hidden bg-white">
      {/* ── Panneau gauche — formulaire ── */}
      <div className="w-full lg:w-1/2 overflow-y-auto bg-gray-50">
        <div className="min-h-full flex items-center justify-center p-8">
          <div className="w-full max-w-md">

            {/* Logo */}
            <div className="mb-10 text-center">
              <button onClick={() => navigate('/')} className="inline-block">
                <Logo className="h-8" />
              </button>
            </div>

            {/* Titre */}
            <div className="mb-8">
              <h1 className="text-3xl font-light text-gray-900 mb-2">Connexion</h1>
              <p className="text-gray-500 text-sm">
                Accédez à votre espace personnel et découvrez nos collections.
              </p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Adresse email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                placeholder="votre@email.com"
                leftIcon={<Mail className="w-4 h-4" />}
                error={errors.email?.[0]}
              />

              <Input
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                placeholder="Votre mot de passe"
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-gray-600 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                error={errors.password?.[0]}
              />

              <div className="flex items-center justify-end">
                <Link to="/forgot-password" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button type="submit" fullWidth size="lg" loading={loading}>
                Se connecter
              </Button>
            </form>

            {/* Séparateur */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">OU</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Lien inscription */}
            <p className="text-center text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <Link to="/register" className="font-semibold text-gray-900 hover:text-rose-500 transition-colors">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ── Panneau droit — image ── */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg"
          alt="Mode Stell's Hope"
          className="w-full h-full object-cover"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <p className="text-2xl font-light leading-snug">"La mode, c'est ce qui se démode."</p>
          <p className="text-sm text-white/70 mt-2">— Coco Chanel</p>
        </div>
      </div>
    </div>
  );
}
