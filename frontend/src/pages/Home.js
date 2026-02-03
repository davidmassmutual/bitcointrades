import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          {/* Left Content */}
          <div className="hero-left">
            <span className="hero-tagline">
              The Future of Bitcoin Investing
            </span>
            <h1 className="hero-title">
              <span className="highlight">Invest in Bitcoin</span>
              <span>with Confidence</span>
            </h1>
            <p className="hero-subtitle">
              Join thousands of investors who trust BitcoinInvest for secure, transparent, 
              and profitable Bitcoin investments. Start your journey to financial freedom today.
            </p>
            <div className="hero-actions">
              <Link
                to="/register"
                className="hero-btn primary"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="hero-btn secondary"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Right Content - Bitcoin Visualization */}
          <div className="hero-right">
            <div className="btc-widget">
              <div className="btc-widget-inner">
                <div className="btc-gradient-overlay"></div>
                <div className="btc-content">
                  {/* Bitcoin Price Widget */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="btc-info">
                      <div className="btc-icon">₿</div>
                      <div className="btc-label">
                        <h3>Bitcoin (BTC)</h3>
                        <span>Live Price</span>
                      </div>
                    </div>
                    <div className="btc-price">
                      <div className="btc-price-value">$45,230.50</div>
                      <div className="btc-price-change">+2.5%</div>
                    </div>
                  </div>
                  
                  {/* Price Chart Placeholder */}
                  <div className="btc-chart">📈 Price Chart</div>

                  {/* Stats Grid */}
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
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-title">Features</h2>
            <p className="features-main-title">Why Choose BitcoinInvest?</p>
            <p className="features-subtitle">
              We provide the tools and security you need to invest in Bitcoin with confidence.
            </p>
          </div>

          <div className="features-grid">
            {/* Feature 1 */}
            <div className="feature-card fade-in">
              <div className="feature-icon bg-blue-500 text-white">🔒</div>
              <h3 className="feature-title">Bank-Level Security</h3>
              <p className="feature-description">
                Your investments are protected with military-grade encryption and multi-factor authentication.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card fade-in">
              <div className="feature-icon bg-green-500 text-white">⚡</div>
              <h3 className="feature-title">Instant Transactions</h3>
              <p className="feature-description">
                Buy and sell Bitcoin instantly with our lightning-fast transaction processing.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card fade-in">
              <div className="feature-icon bg-yellow-500 text-white">📱</div>
              <h3 className="feature-title">Mobile App</h3>
              <p className="feature-description">
                Track your investments and manage your portfolio on the go with our mobile app.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card fade-in">
              <div className="feature-icon bg-purple-500 text-white">📊</div>
              <h3 className="feature-title">Advanced Analytics</h3>
              <p className="feature-description">
                Make informed decisions with our comprehensive market analysis and portfolio tracking.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="feature-card fade-in">
              <div className="feature-icon bg-red-500 text-white">24/7</div>
              <h3 className="feature-title">24/7 Support</h3>
              <p className="feature-description">
                Our dedicated support team is available around the clock to assist you.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="feature-card fade-in">
              <div className="feature-icon bg-indigo-500 text-white">🌐</div>
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
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">
              <span>Ready to get started?</span>
              <span>Join BitcoinInvest today.</span>
            </h2>
            <p className="cta-subtitle">
              Start your Bitcoin investment journey with the platform trusted by thousands of investors worldwide.
            </p>
            <Link
              to="/register"
              className="cta-btn"
            >
              Create Free Account
            </Link>
          </div>
          <div className="cta-stats">
            <div className="stat-box">
              <div className="stat-box-label">Total Users</div>
              <div className="stat-box-value">50,000+</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-label">Total Volume</div>
              <div className="stat-box-value">$1.2B</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-label">Avg. Rating</div>
              <div className="stat-box-value">4.8/5</div>
            </div>
            <div className="stat-box">
              <div className="stat-box-label">Countries</div>
              <div className="stat-box-value">100+</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;