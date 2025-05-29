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