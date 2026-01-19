import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<any>({});
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
      addToast({
        type: 'success',
        message: 'Compte créé avec succès ! Bienvenue chez Stell\'s Hope',
        duration: 3000
      });
      onClose();
    } catch (error: any) {
      console.error('Erreur inscription:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        addToast({
          type: 'error',
          message: 'Erreur lors de la création du compte',
          duration: 4000
        });
      }
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 bg-gray-50 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="mb-8 text-center">
              <button onClick={() => navigate('/')} className="inline-block">
                <Logo className="h-8" />
              </button>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-normal text-gray-800 mb-2">Rejoignez Stell's Hope</h1>
              <p className="text-gray-500 text-sm">
                Créez votre compte et découvrez notre collection de mode exclusive.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${errors.first_name ? 'border-red-300' : ''
                      }`}
                    placeholder="Jean"
                  />
                  {errors.first_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.first_name[0]}</p>
                  )}
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${errors.last_name ? 'border-red-300' : ''
                      }`}
                    placeholder="Dupont"
                  />
                  {errors.last_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.last_name[0]}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${errors.email ? 'border-red-300' : ''
                    }`}
                  placeholder="votre@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all pr-12 ${errors.password ? 'border-red-300' : ''
                      }`}
                    placeholder="Votre mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password[0]}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.password_confirmation}
                    onChange={(e) => setFormData(prev => ({ ...prev, password_confirmation: e.target.value }))}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all pr-12 ${errors.password_confirmation ? 'border-red-300' : ''
                      }`}
                    placeholder="Confirmez votre mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password_confirmation && (
                  <p className="mt-1 text-sm text-red-600">{errors.password_confirmation[0]}</p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  required
                  className="mt-1 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <label className="text-sm text-gray-600">
                  J'accepte les{' '}
                  <Link to="/cgv" className="text-orange-500 hover:underline">
                    conditions générales
                  </Link>{' '}
                  et la{' '}
                  <Link to="/privacy" className="text-orange-500 hover:underline">
                    politique de confidentialité
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Création...
                  </div>
                ) : (
                  'Créer mon compte'
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <span className="text-gray-600 text-sm">Déjà un compte ? </span>
              <Link
                to="/login"
                className="text-orange-500 hover:text-orange-600 font-medium hover:underline"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-white">
        <div className="h-full flex items-center justify-center p-8">
          <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
            <img
              src="https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg"
              alt="Fashion collection"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </div >
  );
}