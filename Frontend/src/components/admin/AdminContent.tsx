import React, { useState } from 'react';
import { Save, Edit, Eye, FileText } from 'lucide-react';

interface AdminContentProps {
  onNavigate: (page: string) => void;
}

export default function AdminContent({ onNavigate }: AdminContentProps) {
  const [activeTab, setActiveTab] = useState('pages');

  const pages = [
    { id: '1', title: 'À Propos', slug: 'about', status: 'published', updated: '2024-01-15' },
    { id: '2', title: 'Contact', slug: 'contact', status: 'published', updated: '2024-01-10' },
    { id: '3', title: 'FAQ', slug: 'faq', status: 'published', updated: '2024-01-08' },
    { id: '4', title: 'CGV', slug: 'cgv', status: 'published', updated: '2024-01-05' },
    { id: '5', title: 'Politique de Confidentialité', slug: 'privacy', status: 'draft', updated: '2024-01-03' }
  ];

  const banners = [
    { id: '1', title: 'Hero Principal', position: 'homepage-hero', status: 'active', image: 'hero-main.jpg' },
    { id: '2', title: 'Promo Été', position: 'homepage-promo', status: 'active', image: 'summer-sale.jpg' },
    { id: '3', title: 'Collection Automne', position: 'category-banner', status: 'inactive', image: 'autumn-collection.jpg' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestion du Contenu</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <FileText className="w-4 h-4" />
          <span>Nouvelle Page</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="text-2xl font-bold text-gray-900">{pages.length}</div>
          <div className="text-sm text-gray-600">Pages Total</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="text-2xl font-bold text-green-600">
            {pages.filter(p => p.status === 'published').length}
          </div>
          <div className="text-sm text-gray-600">Publiées</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="text-2xl font-bold text-blue-600">{banners.length}</div>
          <div className="text-sm text-gray-600">Bannières</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('pages')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pages'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Pages Statiques
          </button>
          <button
            onClick={() => setActiveTab('banners')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'banners'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Bannières
          </button>
        </nav>
      </div>

      {activeTab === 'pages' && (
        <div className="space-y-6">
          {/* Pages Table */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Page</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dernière MAJ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pages.map((page) => (
                    <tr key={page.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-gray-400 mr-3" />
                          <div className="text-sm font-medium text-gray-900">{page.title}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">/{page.slug}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          page.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {page.status === 'published' ? 'Publié' : 'Brouillon'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(page.updated).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Editor Preview */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Éditeur de Contenu</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                <input
                  type="text"
                  placeholder="Titre de la page"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contenu</label>
                <textarea
                  rows={8}
                  placeholder="Contenu de la page..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Sauvegarder</span>
                </button>
                <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
                  Aperçu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'banners' && (
        <div className="space-y-6">
          {/* Banners Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((banner) => (
              <div key={banner.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="h-32 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">{banner.image}</span>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{banner.title}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      banner.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {banner.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{banner.position}</p>
                  <div className="flex space-x-2">
                    <button className="flex-1 text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Modifier
                    </button>
                    <button className="flex-1 text-gray-600 hover:text-gray-800 text-sm font-medium">
                      Prévisualiser
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}