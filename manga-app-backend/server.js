require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
const corsOptions = require('./middleware/corsConfig');

// Importar rutas
const mangasRoutes = require('./routes/mangasRoutes');
const authorsRoutes = require('./routes/authorsRoutes');

// Importar middleware de seguridad
const securityMiddleware = require('./middleware/securityMiddleware');

// Crear la aplicación Express
const app = express();

// Configuración básica
app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use(express.json());

// Aplicar middleware de seguridad
securityMiddleware(app);

// Importar middleware de rate limiting
const { apiLimiter, searchLimiter } = require('./middleware/rateLimiter');

// Aplicar rate limiting general a todas las rutas de la API
app.use('/api', apiLimiter);

// Rutas de la API
app.use('/api/mangas', mangasRoutes);
app.use('/api/authors', authorsRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'El servidor está funcionando correctamente' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Ha ocurrido un error en el servidor'
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Ruta no encontrada'
  });
});

// Configurar puerto
const PORT = process.env.PORT || 5000;

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

module.exports = app;
