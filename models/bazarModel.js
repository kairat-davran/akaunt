const mongoose = require('mongoose');

const bazarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: String,
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
    default: 'General',
  },
  seller: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    required: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('bazar', bazarSchema);