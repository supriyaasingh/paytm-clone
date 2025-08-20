const User = require('../models/User');
const Wallet = require('../models/Wallet');
const { generateToken } = require('../middleware/auth');

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or phone number'
      });
    }
    
    // Create new user
    const user = new User({
      name,
      email,
      phone,
      password
    });
    
    await user.save();
    
    // Create wallet for the user with welcome bonus
    const wallet = new Wallet({
      userId: user._id,
      balance: 100 // ₹100 welcome bonus
    });
    
    await wallet.save();
    
    // Generate JWT token
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone
        },
        wallet: {
          balance: wallet.balance
        },
        token
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Get user's wallet
    const wallet = await Wallet.findOne({ userId: user._id });
    
    // Generate JWT token
    const token = generateToken(user._id);
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone
        },
        wallet: {
          balance: wallet ? wallet.balance : 0
        },
        token
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

/**
 * Get current user profile
 * GET /api/auth/profile
 */
const getProfile = async (req, res) => {
  try {
    // req.user is set by authenticateToken middleware
    const user = req.user;
    
    // Get user's wallet
    const wallet = await Wallet.findOne({ userId: user._id });
    
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        },
        wallet: {
          balance: wallet ? wallet.balance : 0,
          lastTransaction: wallet ? wallet.lastTransaction : null
        }
      }
    });
    
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    });
  }
};

/**
 * Logout user (client-side token removal)
 * POST /api/auth/logout
 */
const logout = (req, res) => {
  // In a JWT-based system, logout is typically handled on the client side
  // by removing the token from storage. However, we can log this action.
  
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};

module.exports = {
  register,
  login,
  getProfile,
  logout
};