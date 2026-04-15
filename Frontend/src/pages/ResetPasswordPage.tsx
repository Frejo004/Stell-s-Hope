import { useState } from 'react';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Logo from '../components/Logo';
import { authService } from '../services/authService';

interface ResetPasswordPageProps {
  onClose: () => void;
}

export default function ResetPasswordPage({ onClose }: ResetPasswordPageProps) {
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
    if (pwd.length < 6) return { level: 'faible', color: 'bg-red-400', width: 'w-1/4' };
    if (pwd.length < 8) return { level: 'moyen', color: 'bg-orange-400', width: 'w-2/4' };
    if (!/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) return { level: 'bien', color: 'bg-yellow-400', width: 'w-3/4' };
    return { level: 'fort', color: 'bg-green-500', width: 'w-full' };
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
        addToast({ type: 'error', message: 'Lien invalide ou expiré. Veuillez recommencer.', duration: 4000 });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Panel */}
      <div className="w-full lg:w-1/2 bg-gray-50 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <button onClick={() => navigate('/')} className="inline-block">
                <Logo className="h-8" />
              </button>
            </div>

            {isSuccess ? (
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-normal text-gray-800 mb-3">Mot de passe mis à jour !</h1>
                <p className="text-gray-500 text-sm mb-8">
                  Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-all font-medium"
                >
                  Se connecter
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-normal text-gray-800 mb-2">Nouveau mot de passe</h1>
                  <p className="text-gray-500 text-sm">
                    Choisissez un mot de passe sécurisé d'au moins 8 caractères.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nouveau mot de passe */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${errors.password ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="Minimum 8 caractères"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {/* Indicateur de force */}
                    {strength && (
                      <div className="mt-2">
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Force : <span className="font-medium">{strength.level}</span></p>
                      </div>
                    )}
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password[0]}</p>}
                  </div>

                  {/* Confirmation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        required
                        value={formData.password_confirmation}
                        onChange={(e) => setFormData(prev => ({ ...prev, password_confirmation: e.target.value }))}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${errors.password_confirmation ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="Répétez votre mot de passe"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {/* Indicateur de correspondance */}
                    {formData.password_confirmation && (
                      <p className={`text-xs mt-1 ${formData.password === formData.password_confirmation ? 'text-green-600' : 'text-red-500'}`}>
                        {formData.password === formData.password_confirmation ? '✓ Les mots de passe correspondent' : '✗ Les mots de passe ne correspondent pas'}
                      </p>
                    )}
                    {errors.password_confirmation && <p className="mt-1 text-sm text-red-600">{errors.password_confirmation[0]}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Réinitialisation...
                      </div>
                    ) : (
                      'Réinitialiser le mot de passe'
                    )}
                  </button>
                </form>
              </>
            )}

            <div className="mt-8 text-center">
              <Link to="/login" className="text-gray-600 hover:text-orange-500 text-sm transition-colors">
                ← Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:block lg:w-1/2 bg-white">
        <div className="h-full flex items-center justify-center p-8">
          <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden">
            <img
              src="https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg"
              alt="Reset password"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
