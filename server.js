require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// Configuración básica
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Sirve archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Rutas Frontend
app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Rutas API (ejemplo)
app.post('/api/auth/login', (req, res) => {
  // Lógica de autenticación aquí
  res.json({ token: 'token_simulado' }); // Cambiar por tu lógica real
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});