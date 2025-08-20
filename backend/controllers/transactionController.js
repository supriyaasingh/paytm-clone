const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');
const User = require('../models/User');

/**
 * Get user transaction history
 * GET /api/transactions/history
 */
const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const type = req.query.type; // Optional filter by transaction type
    
    // Build query
    const query = { userId };
    if (type) {
      query.type = type;
    }
    
    // Get transactions with pagination
    const skip = (page - 1) * limit;
    const transactions = await Transaction.find(query)
      .populate('recipient.userId', 'name phone email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const totalTransactions = await Transaction.countDocuments(query);
    const totalPages = Math.ceil(totalTransactions / limit);
    
    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          currentPage: page,
          totalPages,
          totalTransactions,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
    
  } catch (error) {
    console.error('Get transaction history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transaction history',
      error: error.message
    });
  }
};

/**
 * Send money to another user (UPI simulation)
 * POST /api/transactions/send-money
 */
const sendMoney = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { recipientPhone, recipientId, amount, description } = req.body;
    
    // Find recipient by phone or ID
    let recipient;
    if (recipientId) {
      recipient = await User.findById(recipientId);
    } else if (recipientPhone) {
      recipient = await User.findOne({ phone: recipientPhone });
    }
    
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }
    
    if (recipient._id.toString() === senderId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send money to yourself'
      });
    }
    
    // Check sender's wallet balance
    const senderWallet = await Wallet.findOne({ userId: senderId });
    if (!senderWallet || senderWallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }
    
    // Perform money transfer
    try {
      const { fromWallet, toWallet } = await Wallet.transferMoney(senderId, recipient._id, amount);
      
      // Create transaction record for sender (debit)
      const senderTransaction = new Transaction({
        userId: senderId,
        type: 'upi_transfer',
        amount,
        description: description || `Money sent to ${recipient.name}`,
        status: 'success',
        recipient: {
          userId: recipient._id,
          name: recipient.name,
          phone: recipient.phone
        },
        balanceAfter: fromWallet.balance
      });
      
      // Create transaction record for recipient (credit)
      const recipientTransaction = new Transaction({
        userId: recipient._id,
        type: 'receive_money',
        amount,
        description: `Money received from ${req.user.name}`,
        status: 'success',
        recipient: {
          userId: senderId,
          name: req.user.name,
          phone: req.user.phone
        },
        balanceAfter: toWallet.balance
      });
      
      await Promise.all([
        senderTransaction.save(),
        recipientTransaction.save()
      ]);
      
      res.json({
        success: true,
        message: `₹${amount} sent successfully to ${recipient.name}`,
        data: {
          transaction: {
            id: senderTransaction._id,
            transactionId: senderTransaction.transactionId,
            amount: senderTransaction.amount,
            recipient: {
              name: recipient.name,
              phone: recipient.phone
            },
            description: senderTransaction.description,
            status: senderTransaction.status,
            createdAt: senderTransaction.createdAt
          },
          wallet: {
            previousBalance: senderWallet.balance,
            currentBalance: fromWallet.balance,
            amountSent: amount
          }
        }
      });
      
    } catch (transferError) {
      console.error('Money transfer error:', transferError);
      res.status(400).json({
        success: false,
        message: transferError.message
      });
    }
    
  } catch (error) {
    console.error('Send money error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send money',
      error: error.message
    });
  }
};

/**
 * Get transaction by ID
 * GET /api/transactions/:transactionId
 */
const getTransactionById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { transactionId } = req.params;
    
    const transaction = await Transaction.findOne({
      $or: [
        { transactionId, userId },
        { _id: transactionId, userId }
      ]
    }).populate('recipient.userId', 'name phone email');
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }
    
    res.json({
      success: true,
      data: { transaction }
    });
    
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transaction',
      error: error.message
    });
  }
};

/**
 * Get transaction statistics
 * GET /api/transactions/stats
 */
const getTransactionStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get overall statistics
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
    
    // Get monthly statistics
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const monthlyStats = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
          createdAt: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        overall: stats,
        thisMonth: monthlyStats
      }
    });
    
  } catch (error) {
    console.error('Get transaction stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transaction statistics',
      error: error.message
    });
  }
};

module.exports = {
  getTransactionHistory,
  sendMoney,
  getTransactionById,
  getTransactionStats
};