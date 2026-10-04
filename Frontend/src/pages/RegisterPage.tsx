import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

interface RegisterPageProps {
  onClose: () => void;
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
      onClose();
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        addToast({ type: 'error', message: 'Erreur lors de la création du compte', duration: 4000 });
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
              <h1 className="text-3xl font-light text-gray-900 mb-2">Rejoignez Stell's Hope</h1>
              <p className="text-gray-500 text-sm">
                Créez votre compte et découvrez notre collection exclusive.
              </p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Prénom"
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={(e) => setFormData(p => ({ ...p, first_name: e.target.value }))}
                  placeholder="Jean"
                  leftIcon={<User className="w-4 h-4" />}
                  error={errors.first_name?.[0]}
                />
                <Input
                  label="Nom"
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={(e) => setFormData(p => ({ ...p, last_name: e.target.value }))}
                  placeholder="Dupont"
                  leftIcon={<User className="w-4 h-4" />}
                  error={errors.last_name?.[0]}
                />
              </div>

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
                placeholder="Minimum 8 caractères"
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-gray-600 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                error={errors.password?.[0]}
              />

              <Input
                label="Confirmer le mot de passe"
                type={showConfirm ? 'text' : 'password'}
                required
                value={formData.password_confirmation}
                onChange={(e) => setFormData(p => ({ ...p, password_confirmation: e.target.value }))}
                placeholder="Répétez votre mot de passe"
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="hover:text-gray-600 transition-colors">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                error={errors.password_confirmation?.[0]}
              />

              {/* CGV */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    required
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${accepted ? 'bg-black border-black' : 'border-gray-300 group-hover:border-gray-400'}`}>
                    {accepted && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-600 leading-relaxed">
                  J'accepte les{' '}
                  <Link to="/cgv" className="font-medium text-gray-900 hover:text-rose-500 underline underline-offset-2">
                    conditions générales
                  </Link>{' '}
                  et la{' '}
                  <Link to="/privacy" className="font-medium text-gray-900 hover:text-rose-500 underline underline-offset-2">
                    politique de confidentialité
                  </Link>
                </span>
              </label>

              <Button type="submit" fullWidth size="lg" loading={loading}>
                Créer mon compte
              </Button>
            </form>

            {/* Lien connexion */}
            <p className="mt-6 text-center text-sm text-gray-600">
              Déjà un compte ?{' '}
              <Link to="/login" className="font-semibold text-gray-900 hover:text-rose-500 transition-colors">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ── Panneau droit — image ── */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg"
          alt="Collection Stell's Hope"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <p className="text-2xl font-light leading-snug">Rejoignez une communauté de passionnés de mode.</p>
          <p className="text-sm text-white/70 mt-2">Stell's Hope — Mode & Style</p>
        </div>
      </div>
    </div>
  );
}
