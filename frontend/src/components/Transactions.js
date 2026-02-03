import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Transactions = ({ user }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    page: 1,
    limit: 10
  });

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users/transactions', {
        params: {
          type: filters.type || undefined,
          page: filters.page,
          limit: filters.limit
        }
      });
      
      if (response.data.success) {
        setTransactions(response.data.transactions);
      } else {
        setError('Failed to fetch transactions');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Error fetching transactions');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset to first page when filter changes
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(Math.abs(amount));
  };

  const formatBTC = (amount) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 8,
      maximumFractionDigits: 8
    }).format(Math.abs(amount));
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'deposit': return 'text-blue-400';
      case 'investment': return 'text-green-400';
      case 'profit': return 'text-green-400';
      case 'withdrawal': return 'text-red-400';
      case 'admin_adjustment': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'deposit': return '💵';
      case 'investment': return '₿';
      case 'profit': return '📈';
      case 'withdrawal': return '💸';
      case 'admin_adjustment': return '⚙️';
      default: return '📄';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'deposit': return 'Deposit';
      case 'investment': return 'Investment';
      case 'profit': return 'Profit';
      case 'withdrawal': return 'Withdrawal';
      case 'admin_adjustment': return 'Admin Adjustment';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-gray-800 rounded-lg p-4">
                <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-900 border border-red-800 text-red-200 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Transaction History</h1>
        <p className="text-gray-400">View all your Bitcoin investment transactions</p>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1">
            <label className="block text-gray-400 text-sm font-medium mb-2">
              Filter by Type
            </label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="deposit">Deposit</option>
              <option value="investment">Investment</option>
              <option value="profit">Profit</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="admin_adjustment">Admin Adjustment</option>
            </select>
          </div>
          
          <div>
            <button
              onClick={() => setFilters({ type: '', page: 1, limit: 10 })}
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-white text-xl font-semibold mb-2">No Transactions Found</h3>
            <p className="text-gray-400">
              {filters.type 
                ? `No ${getTypeLabel(filters.type)} transactions found.` 
                : 'You haven\'t made any transactions yet. Start investing in Bitcoin today!'}
            </p>
            {filters.type && (
              <button
                onClick={() => setFilters({ type: '', page: 1, limit: 10 })}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                View All Transactions
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Date & Time</th>
                    <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Type</th>
                    <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Description</th>
                    <th className="text-right text-gray-400 text-sm font-medium py-3 px-4">Amount</th>
                    <th className="text-right text-gray-400 text-sm font-medium py-3 px-4">BTC Amount</th>
                    <th className="text-right text-gray-400 text-sm font-medium py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction._id} className="border-t border-gray-700 hover:bg-gray-700/50">
                      <td className="py-4 px-4">
                        <div className="text-white font-medium">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {new Date(transaction.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getTypeIcon(transaction.type)}</span>
                          <span className={`font-medium ${getTypeColor(transaction.type)}`}>
                            {getTypeLabel(transaction.type)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-white">{transaction.description}</div>
                        {transaction.adminNote && (
                          <div className="text-gray-400 text-sm mt-1">
                            Note: {transaction.adminNote}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className={`font-medium ${transaction.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="text-white">
                          {transaction.btcAmount !== 0 && (
                            <>
                              {transaction.btcAmount >= 0 ? '+' : ''}{formatBTC(transaction.btcAmount)}
                              <div className="text-gray-400 text-sm">
                                @ {formatCurrency(transaction.btcPrice)}
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          transaction.status === 'completed' 
                            ? 'bg-green-900 text-green-300' 
                            : transaction.status === 'pending'
                            ? 'bg-yellow-900 text-yellow-300'
                            : 'bg-red-900 text-red-300'
                        }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border-t border-gray-700">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-gray-400 text-sm">Total Deposits</div>
                <div className="text-2xl font-bold text-blue-400">
                  {formatCurrency(
                    transactions
                      .filter(t => t.type === 'deposit')
                      .reduce((sum, t) => sum + t.amount, 0)
                  )}
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-gray-400 text-sm">Total Investments</div>
                <div className="text-2xl font-bold text-green-400">
                  {formatCurrency(
                    transactions
                      .filter(t => t.type === 'investment')
                      .reduce((sum, t) => sum + t.amount, 0)
                  )}
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-gray-400 text-sm">Current BTC Holdings</div>
                <div className="text-2xl font-bold text-yellow-400">
                  {formatBTC(
                    transactions
                      .filter(t => ['investment', 'profit', 'admin_adjustment'].includes(t.type))
                      .reduce((sum, t) => sum + t.btcAmount, 0)
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Transactions;