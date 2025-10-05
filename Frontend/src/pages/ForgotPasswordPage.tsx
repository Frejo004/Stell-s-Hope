import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

interface ForgotPasswordPageProps {
  onClose: () => void;
}

export default function ForgotPasswordPage({ onClose }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulation d'envoi d'email
      await new Promise(resolve => setTimeout(resolve, 2000));
      setEmailSent(true);
      addToast({
        type: 'success',
        message: 'Email de récupération envoyé !',
        duration: 3000
      });
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Erreur lors de l\'envoi de l\'email',
        duration: 4000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 bg-gray-50 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 text-center">
            <button onClick={() => navigate('/')} className="inline-block">
              <Logo className="h-8" />
            </button>
          </div>
          


          {!emailSent ? (
            <>
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-normal text-gray-800 mb-2">Mot de passe oublié</h1>
                <p className="text-gray-500 text-sm">
                  Saisissez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Envoi...
                    </div>
                  ) : (
                    'Envoyer le lien'
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-3xl font-normal text-gray-800 mb-2">Vérifiez votre email</h1>
                <p className="text-gray-500 text-sm mb-8">
                  Nous avons envoyé un lien de réinitialisation à <strong>{email}</strong>
                </p>
                <button
                  onClick={() => setEmailSent(false)}
                  className="text-orange-500 hover:text-orange-600 font-medium hover:underline"
                >
                  Vous n'avez pas reçu l'email ? Réessayer
                </button>
              </div>
            </>
          )}

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <Link 
              to="/login" 
              className="text-gray-600 hover:text-orange-500 text-sm transition-colors"
            >
              ← Retour à la connexion
            </Link>
          </div>
        </div>
      </div>

      {/* Right Panel - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-white">
        <div className="h-full flex items-center justify-center p-8">
          <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
            <img
              src="https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg"
              alt="Forgot password illustration"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}