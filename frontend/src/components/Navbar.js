import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, logout, btcPrice }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">₿</span>
              </div>
              <span className="text-xl font-bold text-white">BitcoinInvest</span>
            </Link>
            
            {/* Navigation Links */}
            <div className="hidden md:flex space-x-6">
              <Link 
                to="/dashboard" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                to="/investment" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Invest
              </Link>
              <Link 
                to="/transactions" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Transactions
              </Link>
              {user.isAdmin && (
                <Link 
                  to="/admin" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Admin Panel
                </Link>
              )}
            </div>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
            {/* BTC Price */}
            <div className="hidden md:block bg-gray-800 px-3 py-2 rounded-lg">
              <span className="text-gray-400 text-sm">BTC Price</span>
              <div className="text-white font-bold">
                ${btcPrice.toLocaleString()}
              </div>
            </div>

            {/* User Balance */}
            <div className="bg-gray-800 px-3 py-2 rounded-lg">
              <span className="text-gray-400 text-sm">Balance</span>
              <div className="text-white font-bold">
                ${user.balance.toLocaleString()}
              </div>
            </div>

            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline">{user.username}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2 border-b border-gray-700">
                  <div className="text-sm text-gray-400">Account</div>
                  <div className="text-white font-medium">{user.email}</div>
                </div>
                <div className="p-2">
                  <Link 
                    to="/dashboard" 
                    className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded transition-colors"
                  >
                    My Profile
                  </Link>
                  <Link 
                    to="/investment" 
                    className="block px-3 py-2 text-gray-300 hover:bg-gray-700 rounded transition-colors"
                  >
                    Make Investment
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 rounded transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden border-t border-gray-800">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-sm text-gray-400">
            <span>BTC: ${btcPrice.toLocaleString()}</span>
            <span>Balance: ${user.balance.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;