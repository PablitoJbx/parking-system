const Vehicle = require('../models/Vehicle');
const ParkingRecord = require('../models/ParkingRecord');

// Vehicle CRUD
exports.registerVehicle = async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Parking Records
exports.recordEntry = async (req, res) => {
  try {
    const { vehicleId, parkingSpot } = req.body;
    
    const record = new ParkingRecord({
      vehicle: vehicleId,
      parkingSpot
    });
    
    await record.save();
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.recordExit = async (req, res) => {
  try {
    const { recordId } = req.params;
    const { amountPaid } = req.body;
    
    const record = await ParkingRecord.findById(recordId);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    record.exitTime = new Date();
    record.status = 'completed';
    record.amountPaid = amountPaid;
    
    await record.save();
    res.json(record);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getActiveParkings = async (req, res) => {
  try {
    const activeParkings = await ParkingRecord.find({ status: 'active' })
      .populate('vehicle');
    res.json(activeParkings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getParkingHistory = async (req, res) => {
  try {
    const history = await ParkingRecord.find()
      .populate('vehicle')
      .sort({ entryTime: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};