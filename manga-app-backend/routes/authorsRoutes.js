const express = require('express');
const router = express.Router();
const authorsController = require('../controllers/authorsController');
const { searchLimiter } = require('../middleware/rateLimiter');

// Rutas para autores
router.get('/', authorsController.getAllAuthors);
router.get('/search', searchLimiter, authorsController.searchAuthors);
router.get('/:name', authorsController.getAuthorInfo);

module.exports = router;
