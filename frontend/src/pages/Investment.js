import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Investment = ({ user, btcPrice }) => {
  const [amount, setAmount] = useState('');
  const [btcAmount, setBtcAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [investmentHistory, setInvestmentHistory] = useState([]);

  useEffect(() => {
    if (amount && !isNaN(amount) && amount > 0) {
      const calculatedBtc = parseFloat(amount) / btcPrice;
      setBtcAmount(calculatedBtc);
    } else {
      setBtcAmount(0);
    }
  }, [amount, btcPrice]);

  const handleInvest = async (e) => {
    e.preventDefault();
    
    if (!amount || isNaN(amount) || amount <= 0) {
      setError('Please enter a valid investment amount');
      return;
    }

    if (parseFloat(amount) > user.balance) {
      setError('Insufficient balance for this investment');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/api/users/invest', {
        amount: parseFloat(amount)
      });

      if (response.data.success) {
        setSuccess('Investment successful!');
        setAmount('');
        
        // Update user balance
        user.balance = response.data.user.balance;
        user.btcBalance = response.data.user.btcBalance;
        user.totalInvested = response.data.user.totalInvested;
        
        // Refresh portfolio data
        fetchInvestmentHistory();
      } else {
        setError(response.data.message || 'Investment failed');
      }
    } catch (error) {
      console.error('Investment error:', error);
      setError('An error occurred during investment');
    } finally {
      setLoading(false);
    }
  };

  const fetchInvestmentHistory = async () => {
    try {
      const response = await axios.get('/api/users/transactions?type=investment');
      if (response.data.success) {
        setInvestmentHistory(response.data.transactions);
      }
    } catch (error) {
      console.error('Error fetching investment history:', error);
    }
  };

  useEffect(() => {
    fetchInvestmentHistory();
  }, []);

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

  return (
    <div className="investment-container">
      <div className="investment-grid">
        {/* Investment Form */}
        <div className="lg:col-span-2">
          <div className="form-card">
            <h2 className="form-title">Invest in Bitcoin</h2>
            
            {error && (
              <div className="message-error">
                {error}
              </div>
            )}
            
            {success && (
              <div className="message-success">
                {success}
              </div>
            )}

            <form onSubmit={handleInvest}>
              <div className="space-y-6">
                {/* Current Balance */}
                <div className="balance-display">
                  <div className="balance-label">Available Balance</div>
                  <div className="balance-value">
                    {formatCurrency(user.balance)}
                  </div>
                </div>

                {/* Investment Amount */}
                <div className="form-group">
                  <label className="form-label">
                    Investment Amount (USD)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="form-input"
                    placeholder="Enter amount to invest"
                    min="10"
                    step="0.01"
                    required
                  />
                  <p className="form-hint">
                    Minimum investment: $10
                  </p>
                </div>

                {/* Current BTC Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">
                      Current BTC Price
                    </label>
                    <div className="balance-display">
                      <div className="text-white font-bold">
                        {formatCurrency(btcPrice)}
                      </div>
                      <div className="text-gray-400 text-sm">per BTC</div>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      You will receive
                    </label>
                    <div className="balance-display">
                      <div className="text-white font-bold">
                        {formatBTC(btcAmount)}
                      </div>
                      <div className="text-gray-400 text-sm">BTC</div>
                    </div>
                  </div>
                </div>

                {/* Quick Amount Buttons */}
                <div className="form-group">
                  <label className="form-label">
                    Quick Amounts
                  </label>
                  <div className="quick-amounts">
                    {[50, 100, 500, 1000].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setAmount(amount.toString())}
                        className="quick-btn"
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Investment Summary */}
                <div className="summary-card">
                  <h3 className="summary-title">Investment Summary</h3>
                  <div className="summary-grid">
                    <div className="summary-item">
                      <div className="summary-label">Investment Amount:</div>
                      <div className="summary-value">
                        {amount ? formatCurrency(parseFloat(amount)) : '$0.00'}
                      </div>
                    </div>
                    <div className="summary-item">
                      <div className="summary-label">BTC Price:</div>
                      <div className="summary-value">
                        {formatCurrency(btcPrice)}
                      </div>
                    </div>
                    <div className="summary-item">
                      <div className="summary-label">BTC Received:</div>
                      <div className="summary-value">
                        {formatBTC(btcAmount)}
                      </div>
                    </div>
                    <div className="summary-item">
                      <div className="summary-label">New Balance:</div>
                      <div className="summary-value">
                        {amount ? formatCurrency(user.balance - parseFloat(amount)) : formatCurrency(user.balance)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invest Button */}
                <button
                  type="submit"
                  disabled={loading || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > user.balance}
                  className="invest-btn"
                >
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      Processing...
                    </>
                  ) : (
                    'Invest in Bitcoin'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Investment Benefits */}
        <div className="lg:col-span-1">
          <div className="benefits-card">
            <h3 className="benefits-title">Why Invest in Bitcoin?</h3>
            
            <div className="space-y-4">
              {/* Benefits List */}
              <div className="space-y-3">
                <div className="benefit-item">
                  <div className="benefit-icon green">✓</div>
                  <div className="benefit-content">
                    <h4>Digital Gold</h4>
                    <p>Bitcoin is often considered digital gold and a hedge against inflation.</p>
                  </div>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon blue">✓</div>
                  <div className="benefit-content">
                    <h4>24/7 Market</h4>
                    <p>Trade Bitcoin anytime, anywhere. The market never sleeps.</p>
                  </div>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon yellow">✓</div>
                  <div className="benefit-content">
                    <h4>Global Currency</h4>
                    <p>Bitcoin works across borders without traditional banking restrictions.</p>
                  </div>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon purple">✓</div>
                  <div className="benefit-content">
                    <h4>Limited Supply</h4>
                    <p>Only 21 million Bitcoins will ever exist, creating scarcity.</p>
                  </div>
                </div>
              </div>

              {/* Risk Warning */}
              <div className="risk-warning">
                <h4 className="risk-title">Investment Risk</h4>
                <p className="risk-text">
                  Bitcoin prices are volatile. Only invest what you can afford to lose. Past performance doesn't guarantee future results.
                </p>
              </div>

              {/* Current Holdings */}
              <div className="holdings-section">
                <h4 className="holdings-title">Your Current Holdings</h4>
                <div className="holdings-card">
                  <div className="holdings-item">
                    <div className="holdings-label">Bitcoin Balance</div>
                    <div className="holdings-value">{formatBTC(user.btcBalance)}</div>
                  </div>
                  <div className="holdings-item">
                    <div className="holdings-label">USD Value</div>
                    <div className="holdings-value">{formatCurrency(user.btcBalance * btcPrice)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investment History */}
      <div className="history-section">
        <div className="history-card">
          <h3 className="history-title">Investment History</h3>
          
          {investmentHistory.length === 0 ? (
            <div className="center-message">
              No investments yet. Start your Bitcoin journey today!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>BTC Received</th>
                    <th>BTC Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {investmentHistory.map((investment) => (
                    <tr key={investment._id}>
                      <td>
                        <div className="history-date">
                          {new Date(investment.createdAt).toLocaleDateString()}
                        </div>
                        <div className="history-time">
                          {new Date(investment.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td>
                        <div className="history-amount">
                          -{formatCurrency(investment.amount)}
                        </div>
                      </td>
                      <td>
                        <div className="history-btc">
                          +{formatBTC(investment.btcAmount)}
                        </div>
                      </td>
                      <td>
                        <div className="history-price">
                          {formatCurrency(investment.btcPrice)}
                        </div>
                      </td>
                      <td>
                        <span className="history-status">
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Investment;