import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Import Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Investment from './pages/Investment';
import AdminPanel from './pages/AdminPanel';

// Import Components
import Navbar from './components/Navbar';
import Transactions from './components/Transactions';
import Login from './components/Login';
import Register from './components/Register';
import LoadingSpinner from './components/LoadingSpinner';

// Import CSS
import './css/Dashboard.css';
import './css/Home.css';
import './css/AdminPanel.css';
import './css/Investment.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [btcPrice, setBtcPrice] = useState(0);

  // Check authentication on app load
  useEffect(() => {
    checkAuth();
    fetchBtcPrice();
    
    // Fetch BTC price every 30 seconds
    const interval = setInterval(fetchBtcPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get('/api/auth/me');
        setUser(response.data.user);
      } catch (error) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      }
    }
    setLoading(false);
  };

  const fetchBtcPrice = async () => {
    try {
      // In a real app, you would use a real API like CoinGecko
      // For now, using a mock implementation
      const response = await axios.get('https://bitcointrades.onrender.com/api/users/portfolio');
      if (response.data.success) {
        setBtcPrice(response.data.portfolio.currentBtcPrice);
      }
    } catch (error) {
      // Fallback to mock price
      setBtcPrice(45000 + Math.random() * 10000);
    }
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="App">
        {user && <Navbar user={user} logout={logout} btcPrice={btcPrice} />}
        
        <Routes>
          <Route 
            path="/" 
            element={user ? <Navigate to="/dashboard" /> : <Home />} 
          />
          <Route 
            path="/login" 
            element={!user ? <Login onLogin={login} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/register" 
            element={!user ? <Register onLogin={login} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} btcPrice={btcPrice} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/investment" 
            element={user ? <Investment user={user} btcPrice={btcPrice} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/transactions" 
            element={user ? <Transactions user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin" 
            element={user && user.isAdmin ? <AdminPanel /> : <Navigate to="/dashboard" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;