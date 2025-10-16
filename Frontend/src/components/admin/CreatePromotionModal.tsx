import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CreatePromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function CreatePromotionModal({ isOpen, onClose, onSubmit }: CreatePromotionModalProps) {
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    min_amount: '',
    max_uses: '',
    starts_at: '',
    expires_at: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      code: '',
      type: 'percentage',
      value: '',
      min_amount: '',
      max_uses: '',
      starts_at: '',
      expires_at: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Nouvelle Promotion</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Code</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full border rounded px-3 py-2"
            >
              <option value="percentage">Pourcentage</option>
              <option value="fixed">Montant fixe</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Valeur {formData.type === 'percentage' ? '(%)' : '(€)'}
            </label>
            <input
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({...formData, value: e.target.value})}
              className="w-full border rounded px-3 py-2"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Montant minimum (€)</label>
            <input
              type="number"
              value={formData.min_amount}
              onChange={(e) => setFormData({...formData, min_amount: e.target.value})}
              className="w-full border rounded px-3 py-2"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Utilisations max</label>
            <input
              type="number"
              value={formData.max_uses}
              onChange={(e) => setFormData({...formData, max_uses: e.target.value})}
              className="w-full border rounded px-3 py-2"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date de début</label>
            <input
              type="datetime-local"
              value={formData.starts_at}
              onChange={(e) => setFormData({...formData, starts_at: e.target.value})}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date de fin</label>
            <input
              type="datetime-local"
              value={formData.expires_at}
              onChange={(e) => setFormData({...formData, expires_at: e.target.value})}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}