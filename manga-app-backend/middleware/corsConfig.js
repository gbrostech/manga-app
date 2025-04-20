// Configuración de CORS para el backend
const cors = require('cors');

// Opciones de CORS para permitir solicitudes desde cualquier origen en desarrollo
// y solo desde el dominio de producción en producción
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://hvwakypk.manus.space', 'https://wxcddztt.manus.space', 'https://mhillkxp.manus.space'] 
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 horas en segundos
};

module.exports = corsOptions;
