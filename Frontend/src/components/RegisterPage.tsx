import React, { useState } from 'react';
import { Mail, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface RegisterPageProps {
  onClose: () => void;
}

export default function RegisterPage({ onClose }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const { register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData);
      onClose();
    } catch (error) {
      console.error('Erreur inscription:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-md mx-auto p-6 min-h-screen flex flex-col justify-center">
        <button onClick={onClose} className="mb-8 flex items-center text-gray-600 hover:text-black">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Inscription</h1>
          <p className="text-gray-600">Créez votre compte</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Prénom</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nom</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-300"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-300"
                placeholder="votre@email.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 disabled:opacity-50"
          >
            {isLoading ? 'Inscription...' : 'Créer mon compte'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <div className="text-gray-600">
            Déjà un compte ?{' '}
            <button className="text-rose-300 hover:underline">
              Se connecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}