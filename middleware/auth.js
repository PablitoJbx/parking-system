const jwt = require('jsonwebtoken');
const User = require('../models/User');
// Inicializar la aplicación
const app = express();

// Configuración de seguridad y rendimiento
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Limitar peticiones para prevenir ataques
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 peticiones por IP
});
app.use(limiter);

// Configuración de archivos estáticos con caché
const staticOptions = {
  maxAge: '1d',
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
};
app.use(express.json()); // Para parsear application/json
app.use(express.urlencoded({ extended: true })); // Para parsear application/x-www-form-urlencoded

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public'), staticOptions));

// Configurar motor de vistas (opcional)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware para evitar caché en rutas específicas
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});
// configuracion de coockie parser
app.use(cookieParser('TuSecret0Segur0', { // Usa una cadena secreta
  httpOnly: true, // Previene acceso via JavaScript
  secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
  sameSite: 'strict', // Protección contra CSRF
  maxAge: 86400000 // 1 día en ms (opcional)
}));

// Rutas principales
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'), {
    headers: {
      'Cache-Control': 'no-cache'
    }
  });
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'), {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache'
    }
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).sendFile(path.join(__dirname, 'public', '500.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'No tienes permiso para realizar esta acción'
      });
    }
    next();
  };
};