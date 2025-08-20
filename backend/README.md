# Paytm Clone Backend API

A complete Node.js backend API for a Paytm-like digital wallet application with Express.js and MongoDB.

## Features

- 🔐 **User Authentication** - JWT-based signup/login
- 💰 **Wallet Management** - Add money, check balance
- 💸 **Money Transfer** - UPI-like peer-to-peer transfers
- 📱 **Recharge Services** - Mobile and DTH recharge simulation
- 🧾 **Bill Payments** - Electricity, water, gas, broadband bills
- 📊 **Transaction History** - Complete transaction tracking
- 🔒 **Security** - Password hashing with bcrypt, JWT tokens
- ✅ **Validation** - Input validation and error handling

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Project Structure

```
backend/
├── controllers/          # Business logic
│   ├── authController.js
│   ├── walletController.js
│   ├── transactionController.js
│   └── serviceController.js
├── middleware/           # Custom middleware
│   ├── auth.js          # JWT authentication
│   └── validation.js    # Input validation
├── models/              # Database models
│   ├── User.js
│   ├── Wallet.js
│   └── Transaction.js
├── routes/              # API routes
│   ├── auth.js
│   ├── wallet.js
│   ├── transactions.js
│   └── services.js
├── .env                 # Environment variables
├── server.js           # Main server file
└── package.json
```

## Installation & Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables:**
   Update `.env` file with your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb://localhost:27017/paytm-clone
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   ```

3. **Start MongoDB:**
   Make sure MongoDB is running on your system.

4. **Run the server:**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Test the API:**
   Server will run on `http://localhost:5000`
   Health check: `GET http://localhost:5000/api/health`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `POST /api/auth/logout` - Logout user (protected)

### Wallet Management
- `GET /api/wallet/balance` - Get wallet balance (protected)
- `POST /api/wallet/add-money` - Add money to wallet (protected)
- `GET /api/wallet/summary` - Get wallet summary (protected)

### Transactions
- `GET /api/transactions/history` - Get transaction history (protected)
- `POST /api/transactions/send-money` - Send money to user (protected)
- `GET /api/transactions/stats` - Get transaction statistics (protected)
- `GET /api/transactions/:id` - Get specific transaction (protected)

### Services
- `POST /api/services/recharge` - Mobile/DTH recharge (protected)
- `POST /api/services/bill-payment` - Bill payments (protected)
- `GET /api/services/available` - Get available services (public)

## Frontend Integration

### 1. Authentication Setup

```javascript
// Login API call
const login = async (email, password) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Store token in localStorage
    localStorage.setItem('token', data.data.token);
    return data.data;
  }
  throw new Error(data.message);
};
```

### 2. Making Authenticated Requests

```javascript
// Helper function to make authenticated API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`http://localhost:5000/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });
  
  return response.json();
};

// Example: Get wallet balance
const getWalletBalance = async () => {
  return await apiCall('/wallet/balance');
};

// Example: Send money
const sendMoney = async (recipientPhone, amount, description) => {
  return await apiCall('/transactions/send-money', {
    method: 'POST',
    body: JSON.stringify({ recipientPhone, amount, description }),
  });
};
```

### 3. Update Your Frontend State Management

Replace your current mock functions with actual API calls:

```javascript
// In your useAppState hook
const login = async (email, password) => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('token', data.data.token);
      setUser(data.data.user);
      setWalletBalance(data.data.wallet.balance);
      // ... update other state
      return true;
    }
    return false;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};
```

## Database Models

### User Model
- `name` - User's full name
- `email` - Unique email address
- `phone` - Unique phone number
- `password` - Hashed password
- `isActive` - Account status
- `lastLogin` - Last login timestamp

### Wallet Model
- `userId` - Reference to User
- `balance` - Current wallet balance
- `currency` - Currency type (INR)
- `isActive` - Wallet status
- `lastTransaction` - Last transaction timestamp

### Transaction Model
- `userId` - Reference to User
- `type` - Transaction type (add_money, upi_transfer, etc.)
- `amount` - Transaction amount
- `description` - Transaction description
- `status` - Transaction status (success, failed, pending)
- `recipient` - Recipient information (for transfers)
- `service` - Service information (for recharges/bills)
- `transactionId` - Unique transaction ID
- `balanceAfter` - Balance after transaction

## Security Features

- **Password Hashing** - bcrypt with salt rounds
- **JWT Authentication** - Secure token-based auth
- **Input Validation** - express-validator for request validation
- **CORS Protection** - Configured for specific origins
- **Error Handling** - Comprehensive error responses

## Testing

Use tools like Postman or curl to test the API endpoints:

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","phone":"9876543210","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get wallet balance (replace TOKEN with actual JWT token)
curl -X GET http://localhost:5000/api/wallet/balance \
  -H "Authorization: Bearer TOKEN"
```

## Production Deployment

1. **Environment Variables:**
   - Use strong JWT secret
   - Use production MongoDB URI
   - Set NODE_ENV=production

2. **Security:**
   - Enable HTTPS
   - Use environment variables for secrets
   - Implement rate limiting
   - Add request logging

3. **Database:**
   - Use MongoDB Atlas or similar cloud service
   - Set up proper indexes
   - Enable authentication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.