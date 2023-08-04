const { Schema, model } = require('mongoose');

const ticketSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  ticketPriority: {
    type: Number,
    require: true,
    default: 4,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'OPEN'
  },
  reporter: {
    type: String
  },
  assignee: {
    type: String
  },
}, {
  timestamps: true
})

module.exports = model('Ticket', ticketSchema);