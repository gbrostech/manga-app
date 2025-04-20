const rateLimit = require('express-rate-limit');

// Middleware de rate limiting para rutas de la API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 solicitudes por ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Demasiadas solicitudes desde esta IP, por favor intente de nuevo después de 15 minutos'
  }
});

// Rate limiting más estricto para rutas de búsqueda
const searchLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 30, // límite de 30 solicitudes por ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Demasiadas búsquedas desde esta IP, por favor intente de nuevo después de 5 minutos'
  }
});

module.exports = {
  apiLimiter,
  searchLimiter
};
