import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, Package, TrendingDown, TrendingUp } from 'lucide-react';
import { products } from '../../data/products';

interface AdminInventoryProps {
  onNavigate: (page: string) => void;
}

export default function AdminInventory({ onNavigate }: AdminInventoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');

  // Mock stock data
  const inventory = products.map(product => ({
    ...product,
    stock: Math.floor(Math.random() * 50) + 1,
    reserved: Math.floor(Math.random() * 10),
    reorderLevel: 5,
    supplier: 'Fournisseur ' + Math.floor(Math.random() * 3 + 1)
  }));

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStock = stockFilter === 'all' || 
                        (stockFilter === 'low' && item.stock <= item.reorderLevel) ||
                        (stockFilter === 'out' && item.stock === 0);
    return matchesSearch && matchesStock;
  });

  const getStockStatus = (stock: number, reorderLevel: number) => {
    if (stock === 0) return { label: 'Rupture', color: 'bg-red-100 text-red-800' };
    if (stock <= reorderLevel) return { label: 'Stock Faible', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'En Stock', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Stocks</h1>
        <div className="text-sm text-gray-500">
          {filteredInventory.length} produit{filteredInventory.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="text-2xl font-bold text-gray-900">{inventory.length}</div>
          <div className="text-sm text-gray-600">Produits Total</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="text-2xl font-bold text-green-600">
            {inventory.filter(item => item.stock > item.reorderLevel).length}
          </div>
          <div className="text-sm text-gray-600">En Stock</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {inventory.filter(item => item.stock <= item.reorderLevel && item.stock > 0).length}
          </div>
          <div className="text-sm text-gray-600">Stock Faible</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="text-2xl font-bold text-red-600">
            {inventory.filter(item => item.stock === 0).length}
          </div>
          <div className="text-sm text-gray-600">Rupture</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="text-2xl font-bold text-blue-600">
            {inventory.reduce((sum, item) => sum + item.stock, 0)}
          </div>
          <div className="text-sm text-gray-600">Unités Total</div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
          <div className="ml-3">
            <h3 className="text-sm font-semibold text-yellow-800">Alertes Stock</h3>
            <p className="text-sm text-yellow-700 mt-1">
              {inventory.filter(item => item.stock <= item.reorderLevel).length} produits ont un stock faible
            </p>
          </div>
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
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les stocks</option>
              <option value="low">Stock faible</option>
              <option value="out">Rupture</option>
            </select>
            <button className="border rounded-lg px-3 py-2 hover:bg-gray-50 flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filtres</span>
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Réservé</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disponible</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seuil</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fournisseur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInventory.map((item) => {
                const status = getStockStatus(item.stock, item.reorderLevel);
                const available = item.stock - item.reserved;
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded mr-4"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">ID: {item.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">{item.stock}</span>
                        {item.stock <= item.reorderLevel && (
                          <TrendingDown className="w-4 h-4 text-red-500 ml-2" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.reserved}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${available > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {available}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.reorderLevel}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.supplier}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                          Réapprovisionner
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                          Modifier
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}