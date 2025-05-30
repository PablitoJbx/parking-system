const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Opcional para frontend
require('dotenv').config(); // Para variables de entorno

// Inicializar la app
const app = express();

// --- MIDDLEWARE ---
app.use(express.json()); // Para parsear req.body como JSON
app.use(express.urlencoded({ extended: true })); // Para formularios HTML
app.use(cors()); // Habilita CORS si tienes frontend

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/parking-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error de conexión a MongoDB:', err));

// --- IMPORTAR RUTAS ---
const vehicleRoutes = require('./routes/vehicle.routes');

// --- MONTAR RUTAS ---
app.use('/api/vehicles', vehicleRoutes); // Ejemplo: POST /api/vehicles

const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// --- MANEJO DE ERRORES ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

// --- INICIAR SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const user = new User({ username, email, password });
    await user.save();

    const token = signToken(user._id);
    res.status(201).json({
      status: 'success',
      token,
      user: { id: user._id, username: user.username },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Email o contraseña incorrectos',
      });
    }

    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
      user: { id: user._id, username: user.username },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'No estás logueado. Por favor inicia sesión para acceder',
      });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'El usuario perteneciente a este token ya no existe',
      });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: err.message,
    });
  }
};
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});