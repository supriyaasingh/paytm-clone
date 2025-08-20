const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');

/**
 * Process recharge (Mobile/DTH)
 * POST /api/services/recharge
 */
const processRecharge = async (req, res) => {
  try {
    const userId = req.user._id;
    const { amount, phoneNumber, operator, service, description } = req.body;
    
    // Check wallet balance
    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }
    
    // Deduct money from wallet
    const previousBalance = wallet.balance;
    await wallet.deductMoney(amount);
    
    // Create transaction record
    const transaction = new Transaction({
      userId,
      type: 'recharge',
      amount,
      description: description || `${service} recharge for ${phoneNumber}`,
      status: 'success',
      service: `${operator} - ${service}`,
      metadata: {
        phoneNumber,
        operator,
        service
      },
      balanceAfter: wallet.balance
    });
    
    await transaction.save();
    
    res.json({
      success: true,
      message: `Recharge of ₹${amount} completed successfully`,
      data: {
        transaction: {
          id: transaction._id,
          transactionId: transaction.transactionId,
          amount: transaction.amount,
          type: transaction.type,
          description: transaction.description,
          service: transaction.service,
          status: transaction.status,
          createdAt: transaction.createdAt
        },
        wallet: {
          previousBalance,
          currentBalance: wallet.balance,
          amountDeducted: amount
        }
      }
    });
    
  } catch (error) {
    console.error('Recharge error:', error);
    res.status(500).json({
      success: false,
      message: 'Recharge failed',
      error: error.message
    });
  }
};

/**
 * Process bill payment
 * POST /api/services/bill-payment
 */
const processBillPayment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { amount, consumerNumber, service, description } = req.body;
    
    // Check wallet balance
    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }
    
    // Deduct money from wallet
    const previousBalance = wallet.balance;
    await wallet.deductMoney(amount);
    
    // Create transaction record
    const transaction = new Transaction({
      userId,
      type: 'bill_payment',
      amount,
      description: description || `${service} bill payment`,
      status: 'success',
      service: service,
      metadata: {
        consumerNumber,
        service
      },
      balanceAfter: wallet.balance
    });
    
    await transaction.save();
    
    res.json({
      success: true,
      message: `Bill payment of ₹${amount} completed successfully`,
      data: {
        transaction: {
          id: transaction._id,
          transactionId: transaction.transactionId,
          amount: transaction.amount,
          type: transaction.type,
          description: transaction.description,
          service: transaction.service,
          status: transaction.status,
          createdAt: transaction.createdAt
        },
        wallet: {
          previousBalance,
          currentBalance: wallet.balance,
          amountDeducted: amount
        }
      }
    });
    
  } catch (error) {
    console.error('Bill payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Bill payment failed',
      error: error.message
    });
  }
};

/**
 * Get available services
 * GET /api/services/available
 */
const getAvailableServices = (req, res) => {
  const services = {
    recharge: {
      mobile: {
        operators: ['Airtel', 'Jio', 'Vi (Vodafone Idea)', 'BSNL'],
        plans: [
          { amount: 199, validity: '28 days', data: '2GB/day', description: 'Unlimited calls + SMS' },
          { amount: 349, validity: '28 days', data: '3GB/day', description: 'Unlimited calls + SMS' },
          { amount: 599, validity: '84 days', data: '2GB/day', description: 'Unlimited calls + SMS' },
          { amount: 999, validity: '84 days', data: '3GB/day', description: 'Unlimited calls + SMS' }
        ]
      },
      dth: {
        operators: ['Tata Sky', 'Airtel Digital TV', 'Dish TV', 'Sun Direct'],
        plans: [
          { amount: 299, validity: '30 days', channels: '200+', description: 'Basic HD Pack' },
          { amount: 449, validity: '30 days', channels: '350+', description: 'Premium HD Pack' },
          { amount: 699, validity: '30 days', channels: '500+', description: 'Super Premium Pack' },
          { amount: 999, validity: '30 days', channels: '600+', description: 'Ultimate Pack' }
        ]
      }
    },
    billPayment: {
      electricity: {
        providers: ['BESCOM', 'MSEDCL', 'TNEB', 'PSPCL', 'UPPCL'],
        description: 'Pay your electricity bills instantly'
      },
      water: {
        providers: ['BWSSB', 'Mumbai Water', 'Delhi Jal Board', 'Chennai Water'],
        description: 'Pay your water bills online'
      },
      gas: {
        providers: ['Indane', 'HP Gas', 'Bharat Gas'],
        description: 'Book gas cylinders and pay bills'
      },
      broadband: {
        providers: ['BSNL', 'Airtel Fiber', 'Jio Fiber', 'ACT Broadband'],
        description: 'Pay your internet bills'
      }
    }
  };
  
  res.json({
    success: true,
    data: services
  });
};

module.exports = {
  processRecharge,
  processBillPayment,
  getAvailableServices
};