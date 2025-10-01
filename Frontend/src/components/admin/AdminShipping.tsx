import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Truck, MapPin, Clock } from 'lucide-react';

interface AdminShippingProps {
  onNavigate: (page: string) => void;
}

export default function AdminShipping({ onNavigate }: AdminShippingProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const shippingMethods = [
    {
      id: '1',
      name: 'Livraison Standard',
      carrier: 'La Poste',
      price: 4.90,
      freeThreshold: 50,
      deliveryTime: '3-5 jours',
      zones: ['France métropolitaine'],
      status: 'active',
      orders: 156
    },
    {
      id: '2',
      name: 'Livraison Express',
      carrier: 'Chronopost',
      price: 9.90,
      freeThreshold: 100,
      deliveryTime: '24-48h',
      zones: ['France métropolitaine'],
      status: 'active',
      orders: 89
    },
    {
      id: '3',
      name: 'Point Relais',
      carrier: 'Mondial Relay',
      price: 3.50,
      freeThreshold: 40,
      deliveryTime: '2-4 jours',
      zones: ['France', 'Belgique'],
      status: 'active',
      orders: 234
    },
    {
      id: '4',
      name: 'Livraison International',
      carrier: 'DHL',
      price: 15.90,
      freeThreshold: 150,
      deliveryTime: '5-10 jours',
      zones: ['Europe', 'International'],
      status: 'inactive',
      orders: 12
    }
  ];

  const zones = [
    { id: '1', name: 'France métropolitaine', countries: 1, methods: 3 },
    { id: '2', name: 'DOM-TOM', countries: 5, methods: 1 },
    { id: '3', name: 'Europe', countries: 27, methods: 2 },
    { id: '4', name: 'International', countries: 195, methods: 1 }
  ];

  const filteredMethods = shippingMethods.filter(method => {
    const matchesSearch = method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         method.carrier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || method.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Expéditions</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Nouveau Mode</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="text-2xl font-bold text-gray-900">{shippingMethods.length}</div>
          <div className="text-sm text-gray-600">Modes de Livraison</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="text-2xl font-bold text-green-600">
            {shippingMethods.filter(m => m.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600">Actifs</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="text-2xl font-bold text-blue-600">{zones.length}</div>
          <div className="text-sm text-gray-600">Zones</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="text-2xl font-bold text-purple-600">
            {shippingMethods.reduce((sum, m) => sum + m.orders, 0)}
          </div>
          <div className="text-sm text-gray-600">Commandes</div>
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
                placeholder="Rechercher par nom ou transporteur..."
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
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
            </select>
            <button className="border rounded-lg px-3 py-2 hover:bg-gray-50 flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filtres</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipping Methods */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Modes de Livraison</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {filteredMethods.map((method) => (
                <div key={method.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Truck className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{method.name}</h3>
                        <p className="text-sm text-gray-500">{method.carrier}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        method.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {method.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Prix:</span>
                      <span className="ml-2 font-medium">{method.price}€</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Gratuit dès:</span>
                      <span className="ml-2 font-medium">{method.freeThreshold}€</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-1" />
                      <span>{method.deliveryTime}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Commandes:</span>
                      <span className="ml-2 font-medium">{method.orders}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-1">
                      {method.zones.map((zone, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          {zone}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shipping Zones */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Zones de Livraison</h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                + Ajouter Zone
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {zones.map((zone) => (
                <div key={zone.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{zone.name}</h3>
                        <p className="text-sm text-gray-500">{zone.countries} pays</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <span>{zone.methods} mode{zone.methods > 1 ? 's' : ''} de livraison disponible{zone.methods > 1 ? 's' : ''}</span>
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