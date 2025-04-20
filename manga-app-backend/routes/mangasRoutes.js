const express = require('express');
const router = express.Router();
const mangasController = require('../controllers/mangasController');
const { searchLimiter } = require('../middleware/rateLimiter');

// Rutas para mangas
router.get('/', mangasController.getAllMangas);
router.get('/search', searchLimiter, mangasController.searchMangas);
router.get('/recent', mangasController.getRecentMangas);
router.get('/author/:author', mangasController.getMangasByAuthor);
router.get('/:id', mangasController.getMangaById);

module.exports = router;
