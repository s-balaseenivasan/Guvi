const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, default: 'Home' },
    street: String,
    city: String,
    state: String,
    zipCode: String,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    phone: String,
    role: {
      type: String,
      enum: ['customer', 'restaurant', 'admin'],
      default: 'customer',
    },
    addresses: [addressSchema],
    savedPaymentMethods: [{ type: String }],
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
