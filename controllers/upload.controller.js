const cloudinary = require('../config/cloudinary');
const ParkingSpot = require('../models/ParkingSpot');

exports.uploadParkingImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se subió ningún archivo' });
    }

    // Subir imagen a Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'parking-system'
    });

    // Crear nuevo espacio de parqueo con la imagen
    const newSpot = await ParkingSpot.create({
      spotNumber: req.body.spotNumber,
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
      status: 'available'
    });

    res.status(201).json({
      status: 'success',
      data: {
        spot: newSpot
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};