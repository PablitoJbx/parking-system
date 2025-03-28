const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  licensePlate: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  vehicleType: {
    type: String,
    required: true,
    enum: ['car', 'motorcycle', 'truck', 'other'],
    default: 'car'
  },
  brand: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  ownerName: {
    type: String,
    required: true
  },
  ownerContact: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vehicle', VehicleSchema);