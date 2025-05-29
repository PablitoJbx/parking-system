const express = require('express');
const router = express.Router();
const Vehicle = require('../models/vehicle.model.js'); // Ajusta la ruta según tu estructura

// --- RUTAS CRUD PARA VEHÍCULOS ---

// 1. Crear un vehículo (POST)
router.post('/', async (req, res) => {
  try {
    const { licensePlate, type, entryTime } = req.body;
    const newVehicle = new Vehicle({ licensePlate, type, entryTime });
    await newVehicle.save();
    res.status(201).json(newVehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 2. Obtener todos los vehículos (GET)
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. Obtener un vehículo por placa (GET)
router.get('/:licensePlate', async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ licensePlate: req.params.licensePlate });
    if (!vehicle) return res.status(404).json({ message: 'Vehículo no encontrado' });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. Actualizar un vehículo (PUT)
router.put('/:licensePlate', async (req, res) => {
  try {
    const updatedVehicle = await Vehicle.findOneAndUpdate(
      { licensePlate: req.params.licensePlate },
      req.body,
      { new: true } // Devuelve el documento actualizado
    );
    if (!updatedVehicle) return res.status(404).json({ message: 'Vehículo no encontrado' });
    res.json(updatedVehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 5. Eliminar un vehículo (DELETE)
router.delete('/:licensePlate', async (req, res) => {
  try {
    const deletedVehicle = await Vehicle.findOneAndDelete({ licensePlate: req.params.licensePlate });
    if (!deletedVehicle) return res.status(404).json({ message: 'Vehículo no encontrado' });
    res.json({ message: 'Vehículo eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; // ¡Exportación obligatoria!