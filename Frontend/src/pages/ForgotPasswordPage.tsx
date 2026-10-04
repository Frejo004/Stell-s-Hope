import { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { authService } from '../services/authService';

interface ForgotPasswordPageProps {
  onClose: () => void;
}

export default function ForgotPasswordPage({ onClose }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await authService.forgotPassword({ email });
      setEmailSent(true);
    } catch (err: any) {
      if (err.response?.data?.errors?.email) {
        setError(err.response.data.errors.email[0]);
      } else {
        addToast({ type: 'error', message: 'Erreur lors de l\'envoi de l\'email', duration: 4000 });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-white">
      {/* ── Panneau gauche ── */}
      <div className="w-full lg:w-1/2 overflow-y-auto bg-gray-50">
        <div className="min-h-full flex items-center justify-center p-8">
          <div className="w-full max-w-md">

            <div className="mb-10 text-center">
              <button onClick={() => navigate('/')} className="inline-block">
                <Logo className="h-8" />
              </button>
            </div>

            {!emailSent ? (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-light text-gray-900 mb-2">Mot de passe oublié</h1>
                  <p className="text-gray-500 text-sm">
                    Saisissez votre email et nous vous enverrons un lien de réinitialisation.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <Input
                    label="Adresse email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    leftIcon={<Mail className="w-4 h-4" />}
                    error={error}
                  />
                  <Button type="submit" fullWidth size="lg" loading={isLoading}>
                    Envoyer le lien
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center animate-fade-up">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-3">Vérifiez votre email</h1>
                <p className="text-gray-500 text-sm mb-2">
                  Nous avons envoyé un lien de réinitialisation à
                </p>
                <p className="font-semibold text-gray-900 mb-8">{email}</p>
                <p className="text-xs text-gray-400 mb-6">
                  Vérifiez vos spams si vous ne le recevez pas dans les 5 minutes.
                </p>
                <button
                  onClick={() => setEmailSent(false)}
                  className="text-sm text-rose-500 hover:text-rose-600 font-medium hover:underline"
                >
                  Renvoyer l'email
                </button>
              </div>
            )}

            <div className="mt-8 text-center">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Panneau droit ── */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg"
          alt="Stell's Hope"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>
    </div>
  );
}
