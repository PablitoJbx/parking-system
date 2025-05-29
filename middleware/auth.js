const jwt = require('jsonwebtoken');

const auth = (requiredRoles = []) => {
  return async (req, res, next) => {
    try {
      // 1. Obtener token de cookies o headers
      const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ success: false, error: 'Acceso no autorizado' });
      }

      // 2. Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // 3. Verificar roles si se especifican
      if (requiredRoles.length > 0 && !requiredRoles.includes(decoded.role)) {
        return res.status(403).json({ success: false, error: 'Acceso prohibido' });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, error: 'Token expirado' });
      }

      res.status(401).json({ success: false, error: 'Token inválido' });
    }
  };
};

module.exports = auth;
const { verifyToken } = require('../config/auth');

exports.authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Acceso no autorizado' });

  try {
    const decoded = verifyToken(token);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};