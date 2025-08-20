const express = require('express');
const router = express.Router();

// Import controllers and middleware
const {
  processRecharge,
  processBillPayment,
  getAvailableServices
} = require('../controllers/serviceController');

const { authenticateToken } = require('../middleware/auth');
const { validateServicePayment } = require('../middleware/validation');

/**
 * @route   POST /api/services/recharge
 * @desc    Process mobile/DTH recharge
 * @access  Private (requires JWT token)
 * @headers Authorization: Bearer <token>
 * @body    { amount, phoneNumber, operator, service, description }
 */
router.post('/recharge', authenticateToken, processRecharge);

/**
 * @route   POST /api/services/bill-payment
 * @desc    Process bill payment (electricity, water, gas, broadband)
 * @access  Private
 * @headers Authorization: Bearer <token>
 * @body    { amount, consumerNumber, service, description }
 */
router.post('/bill-payment', authenticateToken, processBillPayment);

/**
 * @route   GET /api/services/available
 * @desc    Get available services and plans
 * @access  Public
 */
router.get('/available', getAvailableServices);

module.exports = router;