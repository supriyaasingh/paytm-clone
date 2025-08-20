const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');

/**
 * Get wallet balance
 * GET /api/wallet/balance
 */
const getBalance = async (req, res) => {
  try {
    const userId = req.user._id;
    
    let wallet = await Wallet.findOne({ userId });
    
    // Create wallet if it doesn't exist
    if (!wallet) {
      wallet = new Wallet({ userId, balance: 0 });
      await wallet.save();
    }
    
    res.json({
      success: true,
      data: {
        balance: wallet.balance,
        currency: wallet.currency,
        lastTransaction: wallet.lastTransaction
      }
    });
    
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get wallet balance',
      error: error.message
    });
  }
};

/**
 * Add money to wallet
 * POST /api/wallet/add-money
 */
const addMoney = async (req, res) => {
  try {
    const userId = req.user._id;
    const { amount } = req.body;
    
    // Find or create wallet
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = new Wallet({ userId, balance: 0 });
    }
    
    // Add money to wallet
    const previousBalance = wallet.balance;
    await wallet.addMoney(amount);
    
    // Create transaction record
    const transaction = new Transaction({
      userId,
      type: 'add_money',
      amount,
      description: `Money added to wallet`,
      status: 'success',
      balanceAfter: wallet.balance
    });
    
    await transaction.save();
    
    res.json({
      success: true,
      message: `₹${amount} added to wallet successfully`,
      data: {
        transaction: {
          id: transaction._id,
          transactionId: transaction.transactionId,
          amount: transaction.amount,
          type: transaction.type,
          description: transaction.description,
          status: transaction.status,
          createdAt: transaction.createdAt
        },
        wallet: {
          previousBalance,
          currentBalance: wallet.balance,
          amountAdded: amount
        }
      }
    });
    
  } catch (error) {
    console.error('Add money error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add money to wallet',
      error: error.message
    });
  }
};

/**
 * Get wallet transaction summary
 * GET /api/wallet/summary
 */
const getWalletSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get wallet
    const wallet = await Wallet.findOne({ userId });
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }
    
    // Get transaction statistics
    const stats = await Transaction.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);
    
    // Get recent transactions
    const recentTransactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('type amount description status createdAt transactionId');
    
    // Calculate total spent this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const monthlySpent = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
          type: { $ne: 'add_money' },
          createdAt: { $gte: startOfMonth },
          status: 'success'
        }
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$amount' }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        wallet: {
          balance: wallet.balance,
          currency: wallet.currency,
          lastTransaction: wallet.lastTransaction
        },
        statistics: stats,
        monthlySpent: monthlySpent.length > 0 ? monthlySpent[0].totalSpent : 0,
        recentTransactions
      }
    });
    
  } catch (error) {
    console.error('Get wallet summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get wallet summary',
      error: error.message
    });
  }
};

module.exports = {
  getBalance,
  addMoney,
  getWalletSummary
};