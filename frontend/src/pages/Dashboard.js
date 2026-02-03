import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ user, btcPrice }) => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPortfolio();
    
    // Fetch portfolio data every 30 seconds
    const interval = setInterval(fetchPortfolio, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users/portfolio');
      if (response.data.success) {
        setPortfolio(response.data.portfolio);
      } else {
        setError('Failed to fetch portfolio data');
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      setError('Error fetching portfolio data');
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

  if (loading) {
    return (
      <div className="dashboard-container loading-container">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-800 rounded-lg p-6">
                <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">
          {error}
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="dashboard-container">
        <div className="center-message">
          No portfolio data available
        </div>
      </div>
    );
  }

  const profitLossIcon = portfolio.profitLoss >= 0 ? '▲' : '▼';

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h1 className="welcome-title">
          Welcome back, {user.username}!
        </h1>
        <p className="welcome-subtitle">
          Your Bitcoin investment portfolio
        </p>
      </div>

      {/* Portfolio Overview */}
      <div className="portfolio-grid">
        {/* Total Value */}
        <div className="portfolio-card">
          <div className="card-header">
            <div>
              <h3 className="card-label">Total Portfolio Value</h3>
              <div className="card-subtext">USD Equivalent</div>
            </div>
            <div className="card-icon green-icon">₿</div>
          </div>
          <div className="card-value">
            {formatCurrency(portfolio.totalValue)}
          </div>
        </div>

        {/* Bitcoin Balance */}
        <div className="portfolio-card">
          <div className="card-header">
            <div>
              <h3 className="card-label">Bitcoin Holdings</h3>
              <div className="card-subtext">Current Value: {formatCurrency(portfolio.portfolioValue)}</div>
            </div>
            <div className="card-icon yellow-icon">₿</div>
          </div>
          <div className="card-value">
            {formatBTC(portfolio.btcBalance)}
          </div>
        </div>

        {/* Profit/Loss */}
        <div className="portfolio-card">
          <div className="card-header">
            <div>
              <h3 className="card-label">Unrealized P&L</h3>
              <div className="card-subtext">{portfolio.profitLossPercentage >= 0 ? '+' : ''}{portfolio.profitLossPercentage.toFixed(2)}%</div>
            </div>
            <div className={`card-icon ${portfolio.profitLoss >= 0 ? 'green-icon' : 'red-icon'}`}>{profitLossIcon}</div>
          </div>
          <div className={`card-value ${portfolio.profitLoss >= 0 ? 'profit-loss-positive' : 'profit-loss-negative'}`}>
            {formatCurrency(portfolio.profitLoss)}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-grid">
        {/* Deposit Funds */}
        <div className="action-card">
          <h3 className="action-title">Add Funds</h3>
          <p className="action-description">Deposit money to your account to start investing.</p>
          <div className="action-buttons">
            <button className="action-btn">
              Deposit Funds
            </button>
            <p className="mini-text">Minimum deposit: $10</p>
          </div>
        </div>

        {/* Current BTC Price */}
        <div className="action-card">
          <h3 className="action-title">Current Bitcoin Price</h3>
          <div className="text-3xl font-bold text-white mb-2">
            {formatCurrency(btcPrice)}
          </div>
          <p className="action-description">Live market price</p>
          <div className="action-buttons">
            <button className="action-btn">
              Buy Bitcoin
            </button>
            <button className="action-btn secondary">
              Sell Bitcoin
            </button>
          </div>
        </div>
      </div>

      {/* Portfolio Breakdown */}
      <div className="balance-grid">
        {/* Balance Breakdown */}
        <div className="portfolio-card">
          <h3 className="action-title">Balance Breakdown</h3>
          <div className="space-y-4">
            <div className="balance-item">
              <div>
                <div className="balance-label">Available Cash</div>
                <div className="balance-value">{formatCurrency(portfolio.balance)}</div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill blue" style={{ width: `${(portfolio.balance / portfolio.totalValue) * 100}%` }}></div>
              </div>
            </div>
            <div className="balance-item">
              <div>
                <div className="balance-label">Bitcoin Value</div>
                <div className="balance-value">{formatCurrency(portfolio.portfolioValue)}</div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill yellow" style={{ width: `${(portfolio.portfolioValue / portfolio.totalValue) * 100}%` }}></div>
              </div>
            </div>
            <div className="balance-item">
              <div>
                <div className="balance-label">Total Invested</div>
                <div className="balance-value">{formatCurrency(portfolio.totalInvested)}</div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill green" style={{ width: `${(portfolio.totalInvested / portfolio.totalValue) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Chart Placeholder */}
        <div className="chart-card">
          <h3 className="action-title">Portfolio Performance</h3>
          <div className="chart-placeholder">
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <div>Live performance chart</div>
              <div className="text-sm mt-1">Coming soon</div>
            </div>
          </div>
          <div className="chart-controls">
            <span>1D</span>
            <span>7D</span>
            <span>1M</span>
            <span>1Y</span>
            <span>All</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-card">
        <div className="activity-header">
          <h3 className="activity-title">Recent Activity</h3>
          <button className="view-all-link">
            View All Transactions
          </button>
        </div>
        <div className="space-y-3">
          {/* Mock recent transactions */}
          <div className="activity-item">
            <div className="flex items-center">
              <div className="activity-icon bg-green-500">+</div>
              <div className="activity-details">
                <h4>Bitcoin Purchase</h4>
                <span>2 hours ago</span>
              </div>
            </div>
            <div className="activity-amount">
              <div className="amount-negative">-$500.00</div>
              <div className="amount-secondary">0.011 BTC</div>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="flex items-center">
              <div className="activity-icon bg-blue-500">$</div>
              <div className="activity-details">
                <h4>Deposit</h4>
                <span>1 day ago</span>
              </div>
            </div>
            <div className="activity-amount">
              <div className="amount-positive">+$1,000.00</div>
              <div className="amount-secondary">Completed</div>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="flex items-center">
              <div className="activity-icon bg-yellow-500">₿</div>
              <div className="activity-details">
                <h4>Bitcoin Growth</h4>
                <span>2 days ago</span>
              </div>
            </div>
            <div className="activity-amount">
              <div className="amount-positive">+$150.00</div>
              <div className="amount-secondary">Portfolio growth</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;