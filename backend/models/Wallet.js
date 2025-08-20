const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0,
    min: [0, 'Balance cannot be negative']
  },
  currency: {
    type: String,
    default: 'INR'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastTransaction: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for faster queries
walletSchema.index({ userId: 1 });

// Instance method to add money
walletSchema.methods.addMoney = function(amount) {
  this.balance += amount;
  this.lastTransaction = new Date();
  return this.save();
};

// Instance method to deduct money
walletSchema.methods.deductMoney = function(amount) {
  if (this.balance < amount) {
    throw new Error('Insufficient balance');
  }
  this.balance -= amount;
  this.lastTransaction = new Date();
  return this.save();
};

// Static method to transfer money between wallets
walletSchema.statics.transferMoney = async function(fromUserId, toUserId, amount) {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();
    
    // Find both wallets
    const fromWallet = await this.findOne({ userId: fromUserId }).session(session);
    const toWallet = await this.findOne({ userId: toUserId }).session(session);
    
    if (!fromWallet || !toWallet) {
      throw new Error('Wallet not found');
    }
    
    if (fromWallet.balance < amount) {
      throw new Error('Insufficient balance');
    }
    
    // Update balances
    fromWallet.balance -= amount;
    fromWallet.lastTransaction = new Date();
    
    toWallet.balance += amount;
    toWallet.lastTransaction = new Date();
    
    // Save both wallets
    await fromWallet.save({ session });
    await toWallet.save({ session });
    
    await session.commitTransaction();
    
    return { fromWallet, toWallet };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = mongoose.model('Wallet', walletSchema);