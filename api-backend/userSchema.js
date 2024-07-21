const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userPassword: { type: String, required: true }
});

const User = mongoose.model('UserDetails', userSchema);

module.exports = User;
