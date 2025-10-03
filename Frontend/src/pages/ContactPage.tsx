import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

interface ContactPageProps {
  onClose: () => void;
}

export default function ContactPage({ onClose }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message envoyé ! Nous vous répondrons sous 24h.');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6">
        <button onClick={onClose} className="mb-6 text-gray-600 hover:text-black">
          ← Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h1 className="text-3xl font-bold mb-8">Contactez-nous</h1>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-rose-300 mt-1" />
                <div>
                  <h3 className="font-semibold">Adresse</h3>
                  <p className="text-gray-600">123 Rue de la Mode<br />75001 Paris, France</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="w-6 h-6 text-rose-300 mt-1" />
                <div>
                  <h3 className="font-semibold">Téléphone</h3>
                  <p className="text-gray-600">+33 1 23 45 67 89</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="w-6 h-6 text-rose-300 mt-1" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-600">contact@stellshope.fr</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="w-6 h-6 text-rose-300 mt-1" />
                <div>
                  <h3 className="font-semibold">Horaires</h3>
                  <p className="text-gray-600">
                    Lun-Ven: 9h-19h<br />
                    Sam: 10h-18h<br />
                    Dim: Fermé
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom complet</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-rose-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-rose-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Sujet</label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-rose-300"
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="commande">Question sur une commande</option>
                  <option value="produit">Question sur un produit</option>
                  <option value="retour">Retour/Échange</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-rose-300"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded hover:bg-gray-900 flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Envoyer le message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}