const express = require('express');
const router = express.Router();

// Import controllers and middleware
const {
  getTransactionHistory,
  sendMoney,
  getTransactionById,
  getTransactionStats
} = require('../controllers/transactionController');

const { authenticateToken } = require('../middleware/auth');
const { validateUpiTransfer } = require('../middleware/validation');

/**
 * @route   GET /api/transactions/history
 * @desc    Get user transaction history with pagination
 * @access  Private (requires JWT token)
 * @headers Authorization: Bearer <token>
 * @query   ?page=1&limit=10&type=upi_transfer (optional filters)
 */
router.get('/history', authenticateToken, getTransactionHistory);

/**
 * @route   POST /api/transactions/send-money
 * @desc    Send money to another user (UPI simulation)
 * @access  Private
 * @headers Authorization: Bearer <token>
 * @body    { recipientPhone OR recipientId, amount, description }
 */
router.post('/send-money', authenticateToken, validateUpiTransfer, sendMoney);

/**
 * @route   GET /api/transactions/stats
 * @desc    Get transaction statistics
 * @access  Private
 * @headers Authorization: Bearer <token>
 */
router.get('/stats', authenticateToken, getTransactionStats);

/**
 * @route   GET /api/transactions/:transactionId
 * @desc    Get specific transaction by ID
 * @access  Private
 * @headers Authorization: Bearer <token>
 */
router.get('/:transactionId', authenticateToken, getTransactionById);

module.exports = router;