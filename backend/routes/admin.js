const express = require('express');
const { adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const router = express.Router();

// @route   GET /api/admin/users
// @desc    Get all users (admin only)
// @access  Private (Admin)
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/users/:id
// @desc    Get user by ID (admin only)
// @access  Private (Admin)
router.get('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
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
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/users/:id/balance
// @desc    Update user balance (admin only)
// @access  Private (Admin)
router.put('/users/:id/balance', adminAuth, async (req, res) => {
  try {
    const { amount, type, description } = req.body;
    
    if (!amount || !type || !['add', 'subtract'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request parameters'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update balance
    if (type === 'add') {
      user.balance += amount;
    } else {
      user.balance -= amount;
      if (user.balance < 0) {
        user.balance = 0;
      }
    }

    await user.save();

    // Create admin adjustment transaction
    const transaction = new Transaction({
      user: user._id,
      type: 'admin_adjustment',
      amount: type === 'add' ? amount : -amount,
      btcAmount: 0,
      btcPrice: 0,
      description: description || `Admin adjustment: ${type === 'add' ? 'Added' : 'Subtracted'} $${amount}`,
      status: 'completed',
      adminNote: `Admin adjustment by ${req.user.username}`
    });

    await transaction.save();

    res.json({
      success: true,
      message: 'Balance updated successfully',
      user: {
        id: user._id,
        username: user.username,
        balance: user.balance,
        btcBalance: user.btcBalance
      }
    });

  } catch (error) {
    console.error('Update balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/users/:id/btc-balance
// @desc    Update user BTC balance (admin only)
// @access  Private (Admin)
router.put('/users/:id/btc-balance', adminAuth, async (req, res) => {
  try {
    const { amount, type, description } = req.body;
    
    if (!amount || !type || !['add', 'subtract'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request parameters'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get current BTC price for transaction record
    const currentBtcPrice = await getCurrentBtcPrice();

    // Update BTC balance
    if (type === 'add') {
      user.btcBalance += amount;
    } else {
      user.btcBalance -= amount;
      if (user.btcBalance < 0) {
        user.btcBalance = 0;
      }
    }

    await user.save();

    // Create admin adjustment transaction
    const transaction = new Transaction({
      user: user._id,
      type: 'admin_adjustment',
      amount: 0,
      btcAmount: type === 'add' ? amount : -amount,
      btcPrice: currentBtcPrice,
      description: description || `Admin BTC adjustment: ${type === 'add' ? 'Added' : 'Subtracted'} ${amount} BTC`,
      status: 'completed',
      adminNote: `BTC adjustment by ${req.user.username}`
    });

    await transaction.save();

    res.json({
      success: true,
      message: 'BTC balance updated successfully',
      user: {
        id: user._id,
        username: user.username,
        balance: user.balance,
        btcBalance: user.btcBalance
      }
    });

  } catch (error) {
    console.error('Update BTC balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Activate/Deactivate user (admin only)
// @access  Private (Admin)
router.put('/users/:id/status', adminAuth, async (req, res) => {
  try {
    const { isActive } = req.body;
    
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't allow deactivating admin users
    if (!isActive && user.isAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate admin users'
      });
    }

    user.isActive = isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        username: user.username,
        isActive: user.isActive
      }
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/transactions
// @desc    Get all transactions (admin only)
// @access  Private (Admin)
router.get('/transactions', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, userId, type, status } = req.query;
    
    const query = {};
    
    if (userId) {
      query.user = userId;
    }
    
    if (type) {
      query.type = type;
    }
    
    if (status) {
      query.status = status;
    }

    const transactions = await Transaction.find(query)
      .populate('user', 'username email')
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

// @route   POST /api/admin/transactions
// @desc    Add manual transaction (admin only)
// @access  Private (Admin)
router.post('/transactions', adminAuth, async (req, res) => {
  try {
    const { userId, type, amount, btcAmount, description, adminNote } = req.body;
    
    if (!userId || !type || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get current BTC price if needed
    const currentBtcPrice = await getCurrentBtcPrice();

    // Create transaction
    const transaction = new Transaction({
      user: user._id,
      type,
      amount,
      btcAmount: btcAmount || 0,
      btcPrice: currentBtcPrice,
      description: description || `Admin transaction: ${type}`,
      status: 'completed',
      adminNote: adminNote || `Manual transaction by ${req.user.username}`
    });

    await transaction.save();

    // Update user balances if needed
    if (type === 'deposit') {
      user.balance += amount;
    } else if (type === 'withdrawal') {
      user.balance -= amount;
      if (user.balance < 0) user.balance = 0;
    } else if (type === 'investment') {
      user.balance -= amount;
      user.btcBalance += (btcAmount || 0);
      user.totalInvested += amount;
    } else if (type === 'profit') {
      user.btcBalance += (btcAmount || 0);
    }

    await user.save();

    res.json({
      success: true,
      message: 'Transaction added successfully',
      transaction
    });

  } catch (error) {
    console.error('Add transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard stats
// @access  Private (Admin)
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalTransactions = await Transaction.countDocuments();
    const totalDeposits = await Transaction.aggregate([
      { $match: { type: 'deposit' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalInvestments = await Transaction.aggregate([
      { $match: { type: 'investment' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        totalTransactions,
        totalDeposits: totalDeposits[0]?.total || 0,
        totalInvestments: totalInvestments[0]?.total || 0
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Helper function to get current BTC price
async function getCurrentBtcPrice() {
  // Mock implementation - in real app, use API like CoinGecko, CoinMarketCap, etc.
  return 45000 + Math.random() * 10000; // Random price between 45k and 55k
}

module.exports = router;