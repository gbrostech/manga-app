const mangasData = require('../data/mangas.json');
const volumesData = require('../data/volumes.json');

// Función para obtener detalles completos de mangas por IDs
const getMangasDetailsByIds = (mangaIds) => {
  return mangaIds.map(id => mangasData.find(manga => manga.id === id)).filter(manga => manga !== undefined);
};

// Function to parse the date string (MM/YYYY) and return a Date object
const parseDate = (dateString) => {
  const [month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1); // Month is 0-indexed in JavaScript
};

// Function to compare two date strings
const compareDates = (dateStringA, dateStringB) => {
  const dateA = parseDate(dateStringA);
  const dateB = parseDate(dateStringB);
  
  // Compare the dates
  if (dateA > dateB) return -1; // dateA is more recent
  if (dateA < dateB) return 1;  // dateB is more recent
  return 0; // Both dates are the same
};

function getRandomElements(arr, num) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}

// Obtener todos los mangas
const getAllMangas = async (req, res) => {
  try {
    
    res.status(200).json({
      status: 'success',
      results: mangasData.length,
      data: {
        mangas: mangasData
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
    
    const manga = mangasData.find(m => m.id === parseInt(req.params.id));
    
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
    const authorMangas = mangasData.filter(m => m.autor.toLowerCase() === req.params.author.toLowerCase());
    
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
    const searchResults = mangasData.filter(manga => {
      const searchTerm = query.toLowerCase();
      return (
        manga.titulo.toLowerCase().includes(searchTerm) ||
        manga.sinopsis.toLowerCase().includes(searchTerm) ||
        manga.autor.toLowerCase().includes(searchTerm) 

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
    
    // Ordenar por fecha de publicación (más recientes primero)
    const sortedMangas = [...mangasData].sort((a, b) => {
      if(!a.fecha || !b.fecha) return 0
      return compareDates(b.fecha,a.fecha)
    }).slice(0,10);
    
    // Agrupar por mes
    const groupedByMonth = {};
    
    sortedMangas.forEach(manga => {    
      const date = parseDate(manga.fecha)
      const monthYear = `${date.toLocaleString('es-ES', { month: 'long' })} ${date.getFullYear()}`

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

// Obtener datos para los carouseles
const getCarouselData = async (req, res) => {
  try {
    /*const popularMangaIds = [
      "2125", "2236", "340", "713", "201",
      "1202", "2101", "1103", "2947",
      "599", "1353", "1027", "2244", "294",
      "1447", "2902", "3105",
      "1242", "319", "1460", "446", "2766",
      "2961", "1098", "3178"
    ];

    const recommendedMangaIds = [
      "Akame ga Kill!", "Code Geass", "Soul Eater", "Black Butler", "Claymore",
      "D.Gray-man", "Pandora Hearts", "Seraph of the End", "Blue Exorcist", "Noragami",
      "Seven Deadly Sins", "The Rising of the Shield Hero", "Goblin Slayer", "Overlord",
      "Re:Zero", "Sword Art Online", "No Game No Life", "Classroom of the Elite",
      "The Ancient Magus' Bride", "Made in Abyss", "Mushoku Tensei", "Konosuba",
      "That Time I Got Reincarnated as a Slime", "The Saga of Tanya the Evil",
      "Violet Evergarden"
    ];
    */
    const popularMangaIds = [2125, 2236, 340, 713, 201, 1202, 2101, 1103, 2947, 599, 1353, 1027];
    const recommendedMangaIds = [2244, 294, 1447, 2902, 3105, 1242, 319, 1460, 446, 2766, 2961, 1098, 3178];

    const newReleasesMangas = [...mangasData].filter(manga => manga.fecha) // eliminamos los que no tienen fecha
    .sort((a, b) => compareDates(a.fecha, b.fecha)) // usa la lógica ya definida
    .slice(0, 10)
    .reverse(); 

    // Retrieve full details for the mangas
    const randomPopularIds = getRandomElements(popularMangaIds, 10);
    const randomRecommendedIds = getRandomElements(recommendedMangaIds, 10);

    const popularMangas = getMangasDetailsByIds(randomPopularIds);
    const recommendedMangas = getMangasDetailsByIds(randomRecommendedIds);

    res.status(200).json({
      status: 'success',
      data: {
        popularMangas,
        recommendedMangas,
        newReleasesMangas
      }
    });
  } catch (error) {
    console.error('Error al obtener datos para los carouseles:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener datos para los carouseles'
    });
  }
};

const getPopularMangas = async (req, res) => {
  try {
    const popularMangaIds = [2125, 2236, 340, 713, 201, 1202, 2101, 1103, 2947, 599, 1353, 1027];

    const existingMangas = getMangasDetailsByIds(popularMangaIds).filter(Boolean);
    const randomPopularMangas = getRandomElements(existingMangas, 10); // ya con datos válidos

    res.status(200).json({
      status: 'success',
      data:{
        mangas: randomPopularMangas
      }
    });
  } catch (error) {
    console.error('Error al obtener datos para los carouseles:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener datos para los carouseles'
    });
  }
}


module.exports = {
  getAllMangas,
  getMangaById,
  getMangasByAuthor,
  searchMangas,
  getRecentMangas,
  getCarouselData,
  getPopularMangas
};

