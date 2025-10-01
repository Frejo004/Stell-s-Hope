import React, { useState } from 'react';
import { Search, Filter, Eye, Check, X, Star } from 'lucide-react';

interface AdminReviewsProps {
  onNavigate: (page: string) => void;
}

export default function AdminReviews({ onNavigate }: AdminReviewsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const reviews = [
    { 
      id: '1', 
      customer: 'Sophie Martin', 
      product: 'Chemise Oxford Premium', 
      rating: 5, 
      comment: 'Excellente qualité, très satisfaite de mon achat !', 
      status: 'approved',
      date: '2024-01-15'
    },
    { 
      id: '2', 
      customer: 'Marc Dubois', 
      product: 'Jean Slim Stretch', 
      rating: 4, 
      comment: 'Bon produit, taille parfaite. Livraison rapide.', 
      status: 'pending',
      date: '2024-01-14'
    },
    { 
      id: '3', 
      customer: 'Emma Rousseau', 
      product: 'Robe Midi Évasée', 
      rating: 2, 
      comment: 'Déçue de la qualité, tissu trop fin à mon goût.', 
      status: 'pending',
      date: '2024-01-13'
    }
  ];

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Approuvé';
      case 'pending': return 'En attente';
      case 'rejected': return 'Rejeté';
      default: return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Modération des Avis</h1>
        <div className="text-sm text-gray-500">
          {filteredReviews.length} avis
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par client ou produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="approved">Approuvés</option>
              <option value="rejected">Rejetés</option>
            </select>
            <button className="border rounded-lg px-3 py-2 hover:bg-gray-50 flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filtres</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {review.customer.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{review.customer}</h3>
                    <p className="text-sm text-gray-500">{review.product}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${
                          i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{review.comment}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(review.status)}`}>
                      {getStatusLabel(review.status)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(review.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  
                  {review.status === 'pending' && (
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
                        <Check className="w-4 h-4" />
                        <span>Approuver</span>
                      </button>
                      <button className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
                        <X className="w-4 h-4" />
                        <span>Rejeter</span>
                      </button>
                    </div>
                  )}
                  
                  <button className="text-blue-600 hover:text-blue-800">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="text-2xl font-bold text-gray-900">{reviews.length}</div>
          <div className="text-sm text-gray-600">Total Avis</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {reviews.filter(r => r.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-600">En Attente</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="text-2xl font-bold text-green-600">
            {reviews.filter(r => r.status === 'approved').length}
          </div>
          <div className="text-sm text-gray-600">Approuvés</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="text-2xl font-bold text-blue-600">
            {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Note Moyenne</div>
        </div>
      </div>
    </div>
  );
}