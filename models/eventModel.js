const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  images: {
    type: Array,
    default: [],
  },
  category: {
    type: String,
    default: 'General'
  },
  organizer: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    required: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('event', eventSchema);