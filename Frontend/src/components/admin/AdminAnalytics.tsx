import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from 'lucide-react';

interface AdminAnalyticsProps {
  onNavigate: (page: string) => void;
}

export default function AdminAnalytics({ onNavigate }: AdminAnalyticsProps) {
  const metrics = [
    { title: 'Revenus', value: '12,450€', change: '+15%', trend: 'up', icon: DollarSign },
    { title: 'Commandes', value: '156', change: '+12%', trend: 'up', icon: ShoppingCart },
    { title: 'Clients', value: '89', change: '+8%', trend: 'up', icon: Users },
    { title: 'Taux Conversion', value: '3.2%', change: '-2%', trend: 'down', icon: TrendingUp }
  ];

  const topProducts = [
    { name: 'Chemise Oxford Premium', sales: 45, revenue: '3,595€' },
    { name: 'Robe Midi Évasée', sales: 38, revenue: '4,936€' },
    { name: 'Jean Slim Stretch', sales: 32, revenue: '2,877€' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <div className="flex space-x-2">
          <select className="border rounded-lg px-3 py-2 text-sm">
            <option>7 derniers jours</option>
            <option>30 derniers jours</option>
            <option>3 derniers mois</option>
          </select>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.title} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <metric.icon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              {metric.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
              </span>
              <span className="text-sm text-gray-500 ml-1">vs mois dernier</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventes par Jour</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[120, 150, 180, 140, 200, 160, 190].map((height, index) => (
              <div key={index} className="flex-1 bg-blue-100 rounded-t flex items-end justify-center">
                <div 
                  className="w-full bg-blue-500 rounded-t flex items-end justify-center text-white text-xs font-medium pb-2"
                  style={{ height: `${(height / 200) * 100}%` }}
                >
                  {height}€
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
              <span key={day}>{day}</span>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Produits les Plus Vendus</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                    <Package className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} ventes</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{product.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sources de Trafic</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl font-bold text-blue-600">45%</span>
            </div>
            <p className="font-medium text-gray-900">Direct</p>
            <p className="text-sm text-gray-500">2,340 visiteurs</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl font-bold text-green-600">30%</span>
            </div>
            <p className="font-medium text-gray-900">Réseaux Sociaux</p>
            <p className="text-sm text-gray-500">1,560 visiteurs</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl font-bold text-purple-600">25%</span>
            </div>
            <p className="font-medium text-gray-900">Google</p>
            <p className="text-sm text-gray-500">1,300 visiteurs</p>
          </div>
        </div>
      </div>
    </div>
  );
}