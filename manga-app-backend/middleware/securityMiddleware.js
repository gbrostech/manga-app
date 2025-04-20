const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');

// Middleware para seguridad adicional
const securityMiddleware = (app) => {
  // Configuración de Helmet para protección de cabeceras HTTP
  app.use(helmet());
  
  // Prevenir ataques XSS (Cross-Site Scripting)
  app.use(xss());
  
  // Prevenir HTTP Parameter Pollution
  app.use(hpp());
  
  // Sanitización de datos para prevenir inyección NoSQL
  app.use(mongoSanitize());
  
  // Parsear cookies
  app.use(cookieParser());
  
  // Configuración de CORS más restrictiva
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });
  
  // Configuración de Content Security Policy
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://api.example.com'],
      },
    })
  );
  
  // Configuración de cache control
  app.use((req, res, next) => {
    res.setHeader('Surrogate-Control', 'no-store');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });
};

module.exports = securityMiddleware;
