import React, { useState } from 'react';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';

interface AdminCategoriesProps {
  onNavigate: (page: string) => void;
}

export default function AdminCategories({ onNavigate }: AdminCategoriesProps) {
  const [categories] = useState([
    { id: '1', name: 'Homme', slug: 'homme', products: 3, status: 'active' },
    { id: '2', name: 'Femme', slug: 'femme', products: 2, status: 'active' },
    { id: '3', name: 'Unisexe', slug: 'unisexe', products: 1, status: 'active' }
  ]);

  const [attributes] = useState([
    { id: '1', name: 'Tailles', type: 'size', values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
    { id: '2', name: 'Couleurs', type: 'color', values: ['Blanc', 'Noir', 'Bleu marine', 'Rose poudré'] },
    { id: '3', name: 'Types', type: 'type', values: ['Hauts', 'Bas', 'Accessoires'] }
  ]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Catégories & Attributs</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Nouvelle Catégorie</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
          <div className="text-sm text-gray-600">Catégories</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="text-2xl font-bold text-blue-600">{attributes.length}</div>
          <div className="text-sm text-gray-600">Attributs</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="text-2xl font-bold text-green-600">
            {categories.reduce((sum, cat) => sum + cat.products, 0)}
          </div>
          <div className="text-sm text-gray-600">Produits Total</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Catégories</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Tag className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.products} produits</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Actif
                    </span>
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Attributes */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Attributs</h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                + Ajouter
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {attributes.map((attribute) => (
                <div key={attribute.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{attribute.name}</h3>
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {attribute.values.map((value, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}