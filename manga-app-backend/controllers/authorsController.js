const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { readMangasFromCSV } = require('./mangasController');

// Obtener todos los autores
const getAllAuthors = async (req, res) => {
  try {
    const mangas = await readMangasFromCSV();
    
    // Extraer autores únicos y ordenarlos alfabéticamente
    const uniqueAuthors = [...new Set(mangas.map(manga => manga.autor))].sort();
    
    res.status(200).json({
      status: 'success',
      results: uniqueAuthors.length,
      data: {
        authors: uniqueAuthors
      }
    });
  } catch (error) {
    console.error('Error al obtener los autores:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener los datos de autores'
    });
  }
};

// Obtener información de un autor específico
const getAuthorInfo = async (req, res) => {
  try {
    const mangas = await readMangasFromCSV();
    const authorName = req.params.name;
    
    // Filtrar mangas por autor
    const authorMangas = mangas.filter(manga => 
      manga.autor.toLowerCase() === authorName.toLowerCase()
    );
    
    if (authorMangas.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No se encontró el autor con ese nombre'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        author: authorMangas[0].autor,
        mangasCount: authorMangas.length,
        mangas: authorMangas
      }
    });
  } catch (error) {
    console.error('Error al obtener la información del autor:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener la información del autor'
    });
  }
};

// Buscar autores
const searchAuthors = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        status: 'fail',
        message: 'Se requiere un término de búsqueda'
      });
    }
    
    const mangas = await readMangasFromCSV();
    
    // Extraer autores únicos
    const allAuthors = [...new Set(mangas.map(manga => manga.autor))];
    
    // Filtrar autores por término de búsqueda
    const searchResults = allAuthors.filter(author => 
      author.toLowerCase().includes(query.toLowerCase())
    ).sort();
    
    res.status(200).json({
      status: 'success',
      results: searchResults.length,
      data: {
        authors: searchResults
      }
    });
  } catch (error) {
    console.error('Error al buscar autores:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al buscar autores'
    });
  }
};

module.exports = {
  getAllAuthors,
  getAuthorInfo,
  searchAuthors
};
