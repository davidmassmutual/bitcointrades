import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-white text-xl font-semibold mb-2">Loading BitcoinInvest</h2>
        <p className="text-gray-400">Please wait while we prepare your dashboard...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;