const express = require('express');
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const priceService = require('../services/priceService');
const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/portfolio
// @desc    Get user portfolio with current BTC value
// @access  Private
router.get('/portfolio', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get current BTC price (you would integrate with a real API)
    const currentBtcPrice = await getCurrentBtcPrice();
    
    const portfolioValue = user.btcBalance * currentBtcPrice;
    const totalValue = user.balance + portfolioValue;
    const profitLoss = totalValue - user.totalInvested;

    res.json({
      success: true,
      portfolio: {
        balance: user.balance,
        btcBalance: user.btcBalance,
        currentBtcPrice,
        portfolioValue,
        totalValue,
        totalInvested: user.totalInvested,
        profitLoss,
        profitLossPercentage: user.totalInvested > 0 ? (profitLoss / user.totalInvested) * 100 : 0
      }
    });

  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/transactions
// @desc    Get user transactions
// @access  Private
router.get('/transactions', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    
    const query = { user: req.user._id };
    if (type) {
      query.type = type;
    }

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      transactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalTransactions: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/users/deposit
// @desc    Add funds to user balance
// @access  Private
router.post('/deposit', auth, async (req, res) => {
  try {
    const { amount, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid deposit amount'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user balance
    user.balance += amount;
    await user.save();

    // Create transaction record
    const transaction = new Transaction({
      user: user._id,
      type: 'deposit',
      amount,
      btcAmount: 0,
      btcPrice: 0,
      description: description || 'Deposit',
      status: 'completed'
    });

    await transaction.save();

    res.json({
      success: true,
      message: 'Deposit successful',
      user: {
        balance: user.balance,
        btcBalance: user.btcBalance
      }
    });

  } catch (error) {
    console.error('Deposit error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/users/invest
// @desc    Invest in Bitcoin
// @access  Private
router.post('/invest', auth, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid investment amount'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // Get current BTC price
    const currentBtcPrice = await getCurrentBtcPrice();
    const btcAmount = amount / currentBtcPrice;

    // Update user balances
    user.balance -= amount;
    user.btcBalance += btcAmount;
    user.totalInvested += amount;
    await user.save();

    // Create transaction record
    const transaction = new Transaction({
      user: user._id,
      type: 'investment',
      amount,
      btcAmount,
      btcPrice: currentBtcPrice,
      description: `Invested $${amount} in Bitcoin`,
      status: 'completed'
    });

    await transaction.save();

    res.json({
      success: true,
      message: 'Investment successful',
      user: {
        balance: user.balance,
        btcBalance: user.btcBalance,
        totalInvested: user.totalInvested
      },
      transaction: {
        amount,
        btcAmount,
        btcPrice: currentBtcPrice
      }
    });

  } catch (error) {
    console.error('Invest error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Helper function to get current BTC price
// Uses the real price service for live prices
async function getCurrentBtcPrice() {
  try {
    return await priceService.getCurrentBTCPrice();
  } catch (error) {
    console.error('Error getting BTC price:', error);
    // Fallback to mock price if service fails
    return 45000 + Math.random() * 10000;
  }
}

module.exports = router;