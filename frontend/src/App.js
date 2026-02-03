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

// Configure axios base URL for development
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'http://localhost:5000';
}

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
      // Try to get price from local backend first
      const response = await axios.get('/api/users/portfolio');
      if (response.data.success) {
        setBtcPrice(response.data.portfolio.currentBtcPrice);
      }
    } catch (error) {
      // Fallback to mock price if backend is not available
      console.warn('Backend not available, using mock BTC price:', error.message);
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

  // If no user and not on home/login/register pages, show a simple message
  const currentPath = window.location.pathname;
  const isAuthPage = currentPath === '/' || currentPath === '/login' || currentPath === '/register';
  
  if (!user && !isAuthPage) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h2>Please log in to access this page</h2>
        <div>
          <a href="/login" style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
            Login
          </a>
          <a href="/register" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
            Register
          </a>
        </div>
      </div>
    );
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