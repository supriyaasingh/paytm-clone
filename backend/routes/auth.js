const express = require('express');
const router = express.Router();

// Import controllers and middleware
const {
  register,
  login,
  getProfile,
  logout
} = require('../controllers/authController');

const { authenticateToken } = require('../middleware/auth');
const {
  validateRegistration,
  validateLogin
} = require('../middleware/validation');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 * @body    { name, email, phone, password }
 */
router.post('/register', validateRegistration, register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 * @body    { email, password }
 */
router.post('/login', validateLogin, login);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private (requires JWT token)
 * @headers Authorization: Bearer <token>
 */
router.get('/profile', authenticateToken, getProfile);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 * @headers Authorization: Bearer <token>
 */
router.post('/logout', authenticateToken, logout);

module.exports = router;