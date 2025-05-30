const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'tu_clave_secreta';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: '24h' });
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

module.exports = { generateToken, verifyToken };