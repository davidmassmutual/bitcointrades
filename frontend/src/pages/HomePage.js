import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-primary">The Future of Bitcoin Investing</span>
              <span className="title-secondary">Invest in Bitcoin with Confidence</span>
            </h1>
            <p className="hero-subtitle">
              Join thousands of investors who trust BitcoinInvest for secure, transparent, 
              and profitable Bitcoin investments. Start your journey to financial freedom today.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Sign In
              </Link>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="price-widget">
              <div className="price-header">
                <div className="crypto-info">
                  <div className="crypto-icon">₿</div>
                  <div className="crypto-details">
                    <div className="crypto-name">Bitcoin (BTC)</div>
                    <div className="crypto-label">Live Price</div>
                  </div>
                </div>
                <div className="price-info">
                  <div className="current-price">$45,230.50</div>
                  <div className="price-change positive">+2.5%</div>
                </div>
              </div>
              <div className="price-chart">
                <div className="chart-placeholder">📈 Price Chart</div>
              </div>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">24h Volume</div>
                <div className="stat-value">$2.1B</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Market Cap</div>
                <div className="stat-value">$870B</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">All Time High</div>
                <div className="stat-value">$68,789</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Circulating Supply</div>
                <div className="stat-value">19.2M BTC</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose BitcoinInvest?</h2>
            <p className="section-subtitle">
              We provide the tools and security you need to invest in Bitcoin with confidence.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Bank-Level Security</h3>
              <p className="feature-description">
                Your investments are protected with military-grade encryption and multi-factor authentication.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Instant Transactions</h3>
              <p className="feature-description">
                Buy and sell Bitcoin instantly with our lightning-fast transaction processing.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3 className="feature-title">Mobile App</h3>
              <p className="feature-description">
                Track your investments and manage your portfolio on the go with our mobile app.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Advanced Analytics</h3>
              <p className="feature-description">
                Make informed decisions with our comprehensive market analysis and portfolio tracking.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">24/7</div>
              <h3 className="feature-title">24/7 Support</h3>
              <p className="feature-description">
                Our dedicated support team is available around the clock to assist you.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🌐</div>
              <h3 className="feature-title">Global Access</h3>
              <p className="feature-description">
                Invest in Bitcoin from anywhere in the world with our global platform.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="container">
          <div className="cta-content">
            <div className="cta-text">
              <h2 className="cta-title">Ready to get started?</h2>
              <p className="cta-subtitle">Join BitcoinInvest today.</p>
              <p className="cta-description">
                Start your Bitcoin investment journey with the platform trusted by thousands of investors worldwide.
              </p>
              <Link to="/register" className="btn btn-cta">
                Create Free Account
              </Link>
            </div>
            
            <div className="cta-stats">
              <div className="stat-item">
                <div className="stat-number">50,000+</div>
                <div className="stat-label">Total Users</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">$1.2B</div>
                <div className="stat-label">Total Volume</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">4.8/5</div>
                <div className="stat-label">Avg. Rating</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100+</div>
                <div className="stat-label">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;