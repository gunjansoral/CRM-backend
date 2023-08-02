const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  userType: {
    type: String,
    default: 'CUSTOMER'
  },
  userStatus: {
    type: String,
    default: 'APPROVED'
  },
},
  {
    timestamps: true
  })

module.exports = model('User', userSchema);