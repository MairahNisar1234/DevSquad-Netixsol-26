const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' },
  
  // Subscription Details
  subscriptionPlan: {
    type: String,
    enum: ['none', 'Basic Plan', 'Standard Plan', 'Premium Plan'], 
    default: 'none'
  },
  billingCycle: { 
    type: String, 
    enum: ['monthly', 'yearly', 'none'], 
    default: 'none' 
  },
  subscriptionExpiry: { type: Date, default: null },

  // Dummy Payment Info (Added for Step 3)
  paymentInfo: {
    cardNumber: { type: String, default: '' }, // Dummy storage
    expiry: { type: String, default: '' },     // MM/YY
    cvv: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);