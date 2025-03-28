const mongoose = require('mongoose');

const ParkingRecordSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  entryTime: {
    type: Date,
    default: Date.now
  },
  exitTime: {
    type: Date
  },
  parkingSpot: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  amountPaid: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ParkingRecord', ParkingRecordSchema);