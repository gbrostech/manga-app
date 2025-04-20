const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Función para leer el archivo CSV y convertirlo a un array de objetos
const readMangasFromCSV = () => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(path.join(__dirname, '../data/mangas.csv'))
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

// Obtener todos los mangas
const getAllMangas = async (req, res) => {
  try {
    const mangas = await readMangasFromCSV();
    res.status(200).json({
      status: 'success',
      results: mangas.length,
      data: {
        mangas
      }
    });
  } catch (error) {
    console.error('Error al obtener los mangas:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener los datos de mangas'
    });
  }
};

// Obtener un manga por ID
const getMangaById = async (req, res) => {
  try {
    const mangas = await readMangasFromCSV();
    const manga = mangas.find(m => m.id === req.params.id);
    
    if (!manga) {
      return res.status(404).json({
        status: 'fail',
        message: 'No se encontró el manga con ese ID'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        manga
      }
    });
  } catch (error) {
    console.error('Error al obtener el manga:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener los datos del manga'
    });
  }
};

// Obtener mangas por autor
const getMangasByAuthor = async (req, res) => {
  try {
    const mangas = await readMangasFromCSV();
    const authorMangas = mangas.filter(m => m.autor.toLowerCase() === req.params.author.toLowerCase());
    
    res.status(200).json({
      status: 'success',
      results: authorMangas.length,
      data: {
        mangas: authorMangas
      }
    });
  } catch (error) {
    console.error('Error al obtener los mangas por autor:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener los datos de mangas por autor'
    });
  }
};

// Buscar mangas
const searchMangas = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        status: 'fail',
        message: 'Se requiere un término de búsqueda'
      });
    }
    
    const mangas = await readMangasFromCSV();
    const searchResults = mangas.filter(manga => {
      const searchTerm = query.toLowerCase();
      return (
        manga.titulo.toLowerCase().includes(searchTerm) ||
        manga.sinopsis.toLowerCase().includes(searchTerm) ||
        manga.autor.toLowerCase().includes(searchTerm) ||
        manga.año.toString().includes(searchTerm)
      );
    });
    
    res.status(200).json({
      status: 'success',
      results: searchResults.length,
      data: {
        mangas: searchResults
      }
    });
  } catch (error) {
    console.error('Error al buscar mangas:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al buscar mangas'
    });
  }
};

// Obtener mangas recientes
const getRecentMangas = async (req, res) => {
  try {
    const mangas = await readMangasFromCSV();
    
    // Ordenar por fecha de publicación (más recientes primero)
    const sortedMangas = [...mangas].sort((a, b) => {
      return new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion);
    });
    
    // Agrupar por mes
    const groupedByMonth = {};
    
    sortedMangas.forEach(manga => {
      const date = new Date(manga.fecha_publicacion);
      const monthYear = `${date.toLocaleString('es-ES', { month: 'long' })} ${date.getFullYear()}`;
      
      if (!groupedByMonth[monthYear]) {
        groupedByMonth[monthYear] = [];
      }
      
      groupedByMonth[monthYear].push(manga);
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        months: Object.keys(groupedByMonth),
        groupedMangas: groupedByMonth
      }
    });
  } catch (error) {
    console.error('Error al obtener los mangas recientes:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener los mangas recientes'
    });
  }
};

module.exports = {
  getAllMangas,
  getMangaById,
  getMangasByAuthor,
  searchMangas,
  getRecentMangas
};
