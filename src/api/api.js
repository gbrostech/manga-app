import axios from 'axios';

// Usar datos estáticos como fallback cuando la API no está disponible
import mangasData from './mangasData';
import authorsData from './authorsData';

// En producción, la API no está disponible, así que usamos datos estáticos
const isProduction = process.env.NODE_ENV === 'production';
const API_URL = isProduction ? '' : 'http://localhost:5000/api';

// Obtener todos los mangas
export const getAllMangas = async () => {
  try {
    if (isProduction) {
      console.log('Usando datos estáticos para mangas en producción');
      return mangasData;
    }
    const response = await axios.get(`${API_URL}/mangas`);
    return response.data.data.mangas;
  } catch (error) {
    console.error('Error al obtener los mangas:', error);
    console.log('Fallback a datos estáticos para mangas');
    return mangasData;
  }
};

// Obtener un manga por ID
export const getMangaById = async (id) => {
  try {
    if (isProduction) {
      console.log(`Usando datos estáticos para manga con ID ${id} en producción`);
      return mangasData.find(manga => manga.id === parseInt(id)) || null;
    }
    const response = await axios.get(`${API_URL}/mangas/${id}`);
    return response.data.data.manga;
  } catch (error) {
    console.error(`Error al obtener el manga con ID ${id}:`, error);
    console.log(`Fallback a datos estáticos para manga con ID ${id}`);
    return mangasData.find(manga => manga.id === parseInt(id)) || null;
  }
};

// Buscar mangas
export const searchMangas = async (query) => {
  try {
    if (isProduction) {
      console.log(`Usando datos estáticos para búsqueda de mangas con query "${query}" en producción`);
      return mangasData.filter(manga => 
        manga.titulo.toLowerCase().includes(query.toLowerCase()) || 
        manga.autor.toLowerCase().includes(query.toLowerCase()) ||
        manga.sinopsis.toLowerCase().includes(query.toLowerCase())
      );
    }
    const response = await axios.get(`${API_URL}/mangas/search`, {
      params: { query }
    });
    return response.data.data.mangas;
  } catch (error) {
    console.error('Error al buscar mangas:', error);
    console.log(`Fallback a datos estáticos para búsqueda de mangas con query "${query}"`);
    return mangasData.filter(manga => 
      manga.titulo.toLowerCase().includes(query.toLowerCase()) || 
      manga.autor.toLowerCase().includes(query.toLowerCase()) ||
      manga.sinopsis.toLowerCase().includes(query.toLowerCase())
    );
  }
};

// Obtener mangas recientes agrupados por mes
export const getRecentMangas = async () => {
  try {
    if (isProduction) {
      console.log('Usando datos estáticos para mangas recientes en producción');
      // Agrupar mangas por mes basado en fecha_publicacion
      const mangasByMonth = mangasData
        .sort((a, b) => new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion))
        .reduce((acc, manga) => {
          const date = new Date(manga.fecha_publicacion);
          const monthYear = `${date.toLocaleString('es-ES', { month: 'long' })} ${date.getFullYear()}`;
          if (!acc[monthYear]) {
            acc[monthYear] = [];
          }
          acc[monthYear].push(manga);
          return acc;
        }, {});
      return { mangasByMonth };
    }
    const response = await axios.get(`${API_URL}/mangas/recent`);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener los mangas recientes:', error);
    console.log('Fallback a datos estáticos para mangas recientes');
    // Agrupar mangas por mes basado en fecha_publicacion
    const mangasByMonth = mangasData
      .sort((a, b) => new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion))
      .reduce((acc, manga) => {
        const date = new Date(manga.fecha_publicacion);
        const monthYear = `${date.toLocaleString('es-ES', { month: 'long' })} ${date.getFullYear()}`;
        if (!acc[monthYear]) {
          acc[monthYear] = [];
        }
        acc[monthYear].push(manga);
        return acc;
      }, {});
    return { mangasByMonth };
  }
};

// Obtener mangas por autor
export const getMangasByAuthor = async (author) => {
  try {
    if (isProduction) {
      console.log(`Usando datos estáticos para mangas del autor ${author} en producción`);
      return mangasData.filter(manga => manga.autor === author);
    }
    const response = await axios.get(`${API_URL}/mangas/author/${author}`);
    return response.data.data.mangas;
  } catch (error) {
    console.error(`Error al obtener los mangas del autor ${author}:`, error);
    console.log(`Fallback a datos estáticos para mangas del autor ${author}`);
    return mangasData.filter(manga => manga.autor === author);
  }
};

// Obtener todos los autores
export const getAllAuthors = async () => {
  try {
    if (isProduction) {
      console.log('Usando datos estáticos para todos los autores en producción');
      return authorsData;
    }
    const response = await axios.get(`${API_URL}/authors`);
    return response.data.data.authors;
  } catch (error) {
    console.error('Error al obtener los autores:', error);
    console.log('Fallback a datos estáticos para todos los autores');
    return authorsData;
  }
};

// Obtener información de un autor
export const getAuthorInfo = async (name) => {
  try {
    if (isProduction) {
      console.log(`Usando datos estáticos para información del autor ${name} en producción`);
      const authorMangas = mangasData.filter(manga => manga.autor === name);
      return {
        author: name,
        mangas: authorMangas
      };
    }
    const response = await axios.get(`${API_URL}/authors/${name}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error al obtener la información del autor ${name}:`, error);
    console.log(`Fallback a datos estáticos para información del autor ${name}`);
    const authorMangas = mangasData.filter(manga => manga.autor === name);
    return {
      author: name,
      mangas: authorMangas
    };
  }
};

// Buscar autores
export const searchAuthors = async (query) => {
  try {
    if (isProduction) {
      console.log(`Usando datos estáticos para búsqueda de autores con query "${query}" en producción`);
      return authorsData.filter(author => 
        author.toLowerCase().includes(query.toLowerCase())
      );
    }
    const response = await axios.get(`${API_URL}/authors/search`, {
      params: { query }
    });
    return response.data.data.authors;
  } catch (error) {
    console.error('Error al buscar autores:', error);
    console.log(`Fallback a datos estáticos para búsqueda de autores con query "${query}"`);
    return authorsData.filter(author => 
      author.toLowerCase().includes(query.toLowerCase())
    );
  }
};
