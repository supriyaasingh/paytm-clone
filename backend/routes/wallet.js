const express = require('express');
const router = express.Router();

// Import controllers and middleware
const {
  getBalance,
  addMoney,
  getWalletSummary
} = require('../controllers/walletController');

const { authenticateToken } = require('../middleware/auth');
const { validateAddMoney } = require('../middleware/validation');

/**
 * @route   GET /api/wallet/balance
 * @desc    Get wallet balance
 * @access  Private (requires JWT token)
 * @headers Authorization: Bearer <token>
 */
router.get('/balance', authenticateToken, getBalance);

/**
 * @route   POST /api/wallet/add-money
 * @desc    Add money to wallet
 * @access  Private
 * @headers Authorization: Bearer <token>
 * @body    { amount }
 */
router.post('/add-money', authenticateToken, validateAddMoney, addMoney);

/**
 * @route   GET /api/wallet/summary
 * @desc    Get wallet summary with statistics
 * @access  Private
 * @headers Authorization: Bearer <token>
 */
router.get('/summary', authenticateToken, getWalletSummary);

module.exports = router;