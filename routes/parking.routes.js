const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parking.controller');

// Vehicle routes
router.post('/vehicles', parkingController.registerVehicle);
router.get('/vehicles', parkingController.getVehicles);

// Parking routes
router.post('/parkings/entry', parkingController.recordEntry);
router.put('/parkings/exit/:recordId', parkingController.recordExit);
router.get('/parkings/active', parkingController.getActiveParkings);
router.get('/parkings/history', parkingController.getParkingHistory);

module.exports = router;