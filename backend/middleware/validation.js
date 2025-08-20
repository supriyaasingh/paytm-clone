const { body, validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  
  next();
};

/**
 * Validation rules for user registration
 */
const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  handleValidationErrors
];

/**
 * Validation rules for user login
 */
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

/**
 * Validation rules for adding money
 */
const validateAddMoney = [
  body('amount')
    .isFloat({ min: 1, max: 50000 })
    .withMessage('Amount must be between ₹1 and ₹50,000'),
  
  handleValidationErrors
];

/**
 * Validation rules for UPI transfer
 */
const validateUpiTransfer = [
  body('recipientId')
    .optional()
    .isMongoId()
    .withMessage('Invalid recipient ID'),
  
  body('recipientPhone')
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Invalid phone number'),
  
  body('amount')
    .isFloat({ min: 1, max: 50000 })
    .withMessage('Amount must be between ₹1 and ₹50,000'),
  
  body('description')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Description must be between 1 and 100 characters'),
  
  handleValidationErrors
];

/**
 * Validation rules for service payments (recharge, bills)
 */
const validateServicePayment = [
  body('serviceType')
    .isIn(['recharge', 'bill_payment'])
    .withMessage('Invalid service type'),
  
  body('amount')
    .isFloat({ min: 10, max: 10000 })
    .withMessage('Amount must be between ₹10 and ₹10,000'),
  
  body('description')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Description is required'),
  
  body('service')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Service name is required'),
  
  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateAddMoney,
  validateUpiTransfer,
  validateServicePayment,
  handleValidationErrors
};