import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardStats();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'transactions') {
      fetchTransactions();
    }
  }, [activeTab]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/dashboard');
      if (response.data.success) {
        setStats(response.data.stats);
      } else {
        setError('Failed to fetch dashboard stats');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Error fetching dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/users');
      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        setError('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/transactions');
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
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatBTC = (amount) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 8,
      maximumFractionDigits: 8
    }).format(amount);
  };

  const handleUserStatusToggle = async (userId, currentStatus) => {
    try {
      const response = await axios.put(`/api/admin/users/${userId}/status`, {
        isActive: !currentStatus
      });
      
      if (response.data.success) {
        fetchUsers(); // Refresh user list
      } else {
        setError('Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      setError('Error updating user status');
    }
  };

  const handleBalanceAdjustment = async (userId, amount, type, description) => {
    try {
      const response = await axios.put(`/api/admin/users/${userId}/balance`, {
        amount: parseFloat(amount),
        type,
        description
      });
      
      if (response.data.success) {
        fetchUsers(); // Refresh user list
        setError(''); // Clear any previous errors
      } else {
        setError(response.data.message || 'Failed to adjust balance');
      }
    } catch (error) {
      console.error('Error adjusting balance:', error);
      setError('Error adjusting balance');
    }
  };

  const handleBTCAdjustment = async (userId, amount, type, description) => {
    try {
      const response = await axios.put(`/api/admin/users/${userId}/btc-balance`, {
        amount: parseFloat(amount),
        type,
        description
      });
      
      if (response.data.success) {
        fetchUsers(); // Refresh user list
        setError(''); // Clear any previous errors
      } else {
        setError(response.data.message || 'Failed to adjust BTC balance');
      }
    } catch (error) {
      console.error('Error adjusting BTC balance:', error);
      setError('Error adjusting BTC balance');
    }
  };

  if (loading && activeTab === 'dashboard') {
    return (
      <div className="admin-container loading-container">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-800 rounded-lg p-6">
                <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Page Header */}
      <div className="admin-header">
        <h1 className="admin-title">Admin Panel</h1>
        <p className="admin-subtitle">Manage users, transactions, and platform statistics</p>
      </div>

      {/* Navigation Tabs */}
      <div className="tab-nav">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: '📊' },
          { id: 'users', label: 'Users', icon: '👥' },
          { id: 'transactions', label: 'Transactions', icon: '💰' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && stats && (
        <div className="stats-grid">
          {/* Total Users */}
          <div className="stat-card">
            <div className="stat-header">
              <div>
                <div className="stat-label">Total Users</div>
                <div className="stat-value">{stats.totalUsers}</div>
              </div>
              <div className="stat-icon bg-blue-500 text-white">👥</div>
            </div>
          </div>

          {/* Active Users */}
          <div className="stat-card">
            <div className="stat-header">
              <div>
                <div className="stat-label">Active Users</div>
                <div className="stat-value">{stats.activeUsers}</div>
              </div>
              <div className="stat-icon bg-green-500 text-white">✅</div>
            </div>
          </div>

          {/* Total Transactions */}
          <div className="stat-card">
            <div className="stat-header">
              <div>
                <div className="stat-label">Total Transactions</div>
                <div className="stat-value">{stats.totalTransactions}</div>
              </div>
              <div className="stat-icon bg-yellow-500 text-white">💰</div>
            </div>
          </div>

          {/* Total Volume */}
          <div className="stat-card">
            <div className="stat-header">
              <div>
                <div className="stat-label">Total Volume</div>
                <div className="stat-value">
                  {formatCurrency(stats.totalDeposits + stats.totalInvestments)}
                </div>
              </div>
              <div className="stat-icon bg-purple-500 text-white">📈</div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="user-management">
          <div className="user-header">
            <h3 className="user-title">User Management</h3>
            <p className="user-subtitle">Manage user accounts and balances</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="user-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="user-name">{user.username}</div>
                          <div className="user-id">ID: {user._id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-white">{user.email}</div>
                    </td>
                    <td>
                      <div className="text-white font-medium">
                        {formatCurrency(user.balance)}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {formatBTC(user.btcBalance)} BTC
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${user.isActive ? 'status-active' : 'status-inactive'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="user-actions">
                        <button
                          onClick={() => handleUserStatusToggle(user._id, user.isActive)}
                          className={`action-btn ${user.isActive ? 'danger' : 'secondary'}`}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        
                        {/* Balance Adjustment Buttons */}
                        <button
                          onClick={() => handleBalanceAdjustment(user._id, 100, 'add', 'Admin adjustment')}
                          className="action-btn primary"
                        >
                          +$100
                        </button>
                        <button
                          onClick={() => handleBalanceAdjustment(user._id, 50, 'subtract', 'Admin adjustment')}
                          className="action-btn danger"
                        >
                          -$50
                        </button>

                        {/* BTC Adjustment Buttons */}
                        <button
                          onClick={() => handleBTCAdjustment(user._id, 0.01, 'add', 'Admin BTC adjustment')}
                          className="action-btn warning"
                        >
                          +0.01 BTC
                        </button>
                        <button
                          onClick={() => handleBTCAdjustment(user._id, 0.005, 'subtract', 'Admin BTC adjustment')}
                          className="action-btn purple"
                        >
                          -0.005 BTC
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="transaction-management">
          <div className="transaction-header">
            <h3 className="transaction-title">Transaction Management</h3>
            <p className="transaction-subtitle">View and manage all platform transactions</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>User</th>
                  <th>Type</th>
                  <th className="text-right">Amount</th>
                  <th className="text-right">BTC Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>
                      <div className="transaction-date">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </div>
                      <div className="transaction-time">
                        {new Date(transaction.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td>
                      <div className="text-white">{transaction.user.username}</div>
                      <div className="text-gray-400 text-sm">{transaction.user.email}</div>
                    </td>
                    <td>
                      <span className={`transaction-type ${
                        transaction.type === 'deposit' ? 'type-deposit' :
                        transaction.type === 'investment' ? 'type-investment' :
                        transaction.type === 'withdrawal' ? 'type-withdrawal' :
                        'type-other'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className={`transaction-amount ${
                        transaction.amount >= 0 ? 'amount-positive' : 'amount-negative'
                      }`}>
                        {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="text-white">
                        {transaction.btcAmount !== 0 && (
                          <>
                            {transaction.btcAmount >= 0 ? '+' : ''}{formatBTC(transaction.btcAmount)}
                            <div className="transaction-price">
                              @ {formatCurrency(transaction.btcPrice)}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`transaction-status ${
                        transaction.status === 'completed' ? 'status-completed' :
                        transaction.status === 'pending' ? 'status-pending' :
                        'status-failed'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;