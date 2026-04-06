const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  phone: {
    type: String,
    default: '',
  },
  profilePicture: {
    type: String,
    default: 'https://ui-avatars.com/api/?name=User&background=random',
  },
  addresses: [{
    label: String,
    street: String,
    city: String,
    zip: String,
    isDefault: { type: Boolean, default: false }
  }],
  preferences: {
    language: { type: String, default: 'English' },
    notifications: { type: Boolean, default: true },
    darkTheme: { type: Boolean, default: false },
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  loginHistory: [{
    date: { type: Date, default: Date.now },
    device: String,
    ip: String,
  }],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
  }],
}, {
  timestamps: true,
});

// Add indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

module.exports = mongoose.model('User', userSchema);