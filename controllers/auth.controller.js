const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.register = async (req, res, next) => {
  try {
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role || 'user'
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Verificar si el usuario existe y la contraseña es correcta
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Email o contraseña incorrectos'
      });
    }

    // 2) Generar token JWT
    const token = signToken(user._id);

    // 3) Enviar respuesta al cliente
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    // 1) Obtener el token y verificar que existe
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'No estás logueado. Por favor inicia sesión para acceder'
      });
    }

    // 2) Verificar token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Verificar si el usuario aún existe
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'El usuario perteneciente a este token ya no existe'
      });
    }

    // 4) Guardar usuario en la request
    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: err.message
    });
  }
};
const User = require('../models/user.model');
const { generateToken } = require('../config/auth');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();

    const token = generateToken(user._id);const User = require('../models/User');
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
    res.status(201).json({ token, user: { id: user._id, username } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = generateToken(user._id);
    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};