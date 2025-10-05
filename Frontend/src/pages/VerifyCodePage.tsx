import React, { useState, useRef, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

interface VerifyCodePageProps {
  onClose: () => void;
}

export default function VerifyCodePage({ onClose }: VerifyCodePageProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      addToast({
        type: 'error',
        message: 'Please enter the complete 6-digit code',
        duration: 3000
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulation de vérification
      await new Promise(resolve => setTimeout(resolve, 2000));
      addToast({
        type: 'success',
        message: 'Code verified successfully!',
        duration: 3000
      });
      onClose();
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Invalid verification code',
        duration: 4000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setTimeLeft(60);
    addToast({
      type: 'success',
      message: 'Verification code resent!',
      duration: 3000
    });
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
          


          {/* Header */}
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-3xl font-normal text-gray-800 mb-2">Vérifiez votre compte</h1>
            <p className="text-gray-500 text-sm">
              Nous avons envoyé un code de vérification à 6 chiffres à votre adresse email.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Code Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Saisissez le code de vérification
              </label>
              <div className="flex justify-center space-x-3">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="0"
                  />
                ))}
              </div>
            </div>

            {/* Timer */}
            <div className="text-center">
              {timeLeft > 0 ? (
                <p className="text-sm text-gray-500">
                  Renvoyer le code dans <span className="font-semibold text-orange-500">{timeLeft}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-sm text-orange-500 hover:text-orange-600 font-medium hover:underline"
                >
                  Renvoyer le code de vérification
                </button>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || code.join('').length !== 6}
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Vérification...
                </div>
              ) : (
                'Vérifier le code'
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-2">
              Vous n'avez pas reçu le code ? Vérifiez votre dossier spam.
            </p>
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
              src="https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg"
              alt="Security verification"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}