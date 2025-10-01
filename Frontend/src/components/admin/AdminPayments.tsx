import React, { useState } from 'react';
import { Plus, Edit, Search, Filter, CreditCard, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

interface AdminPaymentsProps {
  onNavigate: (page: string) => void;
}

export default function AdminPayments({ onNavigate }: AdminPaymentsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const paymentMethods = [
    {
      id: '1',
      name: 'Carte Bancaire',
      provider: 'Stripe',
      type: 'card',
      status: 'active',
      fees: 2.9,
      transactions: 1245,
      volume: 45678.90
    },
    {
      id: '2',
      name: 'PayPal',
      provider: 'PayPal',
      type: 'wallet',
      status: 'active',
      fees: 3.4,
      transactions: 567,
      volume: 18234.50
    },
    {
      id: '3',
      name: 'Virement Bancaire',
      provider: 'Manuel',
      type: 'transfer',
      status: 'active',
      fees: 0,
      transactions: 89,
      volume: 12456.00
    },
    {
      id: '4',
      name: 'Apple Pay',
      provider: 'Stripe',
      type: 'wallet',
      status: 'inactive',
      fees: 2.9,
      transactions: 23,
      volume: 890.00
    }
  ];

  const transactions = [
    {
      id: 'TXN001',
      orderId: 'CMD001',
      amount: 89.90,
      method: 'Carte Bancaire',
      status: 'completed',
      customer: 'Sophie Martin',
      date: '2024-01-15T14:30:00',
      fees: 2.61
    },
    {
      id: 'TXN002',
      orderId: 'CMD002',
      amount: 156.50,
      method: 'PayPal',
      status: 'completed',
      customer: 'Marc Dubois',
      date: '2024-01-15T12:15:00',
      fees: 5.32
    },
    {
      id: 'TXN003',
      orderId: 'CMD003',
      amount: 234.00,
      method: 'Virement',
      status: 'pending',
      customer: 'Emma Rousseau',
      date: '2024-01-15T10:45:00',
      fees: 0
    },
    {
      id: 'TXN004',
      orderId: 'CMD004',
      amount: 67.80,
      method: 'Carte Bancaire',
      status: 'failed',
      customer: 'Pierre Leroy',
      date: '2024-01-15T09:20:00',
      fees: 0
    }
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'card': return <CreditCard className="w-5 h-5" />;
      case 'wallet': return <DollarSign className="w-5 h-5" />;
      case 'transfer': return <TrendingUp className="w-5 h-5" />;
      default: return <CreditCard className="w-5 h-5" />;
    }
  };

  const totalVolume = paymentMethods.reduce((sum, method) => sum + method.volume, 0);
  const totalTransactions = paymentMethods.reduce((sum, method) => sum + method.transactions, 0);
  const totalFees = transactions.reduce((sum, txn) => sum + txn.fees, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Paiements</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Nouveau Mode</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="text-2xl font-bold text-gray-900">{totalVolume.toLocaleString('fr-FR')}€</div>
          <div className="text-sm text-gray-600">Volume Total</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="text-2xl font-bold text-green-600">{totalTransactions}</div>
          <div className="text-sm text-gray-600">Transactions</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="text-2xl font-bold text-blue-600">{totalFees.toFixed(2)}€</div>
          <div className="text-sm text-gray-600">Frais Total</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="text-2xl font-bold text-purple-600">
            {((transactions.filter(t => t.status === 'completed').length / transactions.length) * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Taux de Succès</div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Modes de Paiement</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      {getMethodIcon(method.type)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{method.name}</h3>
                      <p className="text-sm text-gray-500">{method.provider}</p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Statut:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      method.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {method.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Frais:</span>
                    <span className="font-medium">{method.fees}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Transactions:</span>
                    <span className="font-medium">{method.transactions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Volume:</span>
                    <span className="font-medium">{method.volume.toLocaleString('fr-FR')}€</span>
                  </div>
                </div>
              </div>
            ))}
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
                placeholder="Rechercher par commande ou client..."
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
              <option value="completed">Complétées</option>
              <option value="pending">En attente</option>
              <option value="failed">Échouées</option>
              <option value="refunded">Remboursées</option>
            </select>
            <button className="border rounded-lg px-3 py-2 hover:bg-gray-50 flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filtres</span>
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Transactions Récentes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Frais</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">#{transaction.id}</div>
                      <div className="text-sm text-gray-500">Commande: {transaction.orderId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{transaction.customer}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{transaction.amount}€</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{transaction.method}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{transaction.fees.toFixed(2)}€</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                        {transaction.status === 'completed' ? 'Complétée' :
                         transaction.status === 'pending' ? 'En attente' :
                         transaction.status === 'failed' ? 'Échouée' : 'Remboursée'}
                      </span>
                      {transaction.status === 'failed' && (
                        <AlertCircle className="w-4 h-4 text-red-500 ml-2" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(transaction.date).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}