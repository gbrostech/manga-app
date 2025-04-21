import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Obtener todos los mangas
export const getAllMangas = async () => {
  const response = await axios.get(`${API_URL}/mangas`);
  return response.data.data.mangas;
};

// Obtener un manga por ID
export const getMangaById = async (id) => {
  const response = await axios.get(`${API_URL}/mangas/${id}`);
  return response.data.data.manga;
};

// Buscar mangas
export const searchMangas = async (query) => {
  const response = await axios.get(`${API_URL}/mangas/search`, {
    params: { query }
  });
  return response.data.data.mangas;
};

// Obtener mangas recientes agrupados por mes
export const getRecentMangas = async () => {
  const response = await axios.get(`${API_URL}/mangas/recent`);
  return response.data.data;
};

// Obtener mangas por autor
export const getMangasByAuthor = async (author) => {
  const response = await axios.get(`${API_URL}/mangas/author/${author}`);
  return response.data.data.mangas;
};

// Obtener todos los autores
export const getAllAuthors = async () => {
  const response = await axios.get(`${API_URL}/authors`);
  return response.data.data.authors;
};

export const getAuthorInfo = async () => {
  const response = await axios.get(`${API_URL}/authors/search`);
  return response.data.data.authors;
};

export const searchAuthors = async (query) => {
  const response = await axios.get(`${API_URL}/authors/:name`, {
    params: { query }
  });
  return response.data.data.authors;
};

export const getCarouselData = async () => {
  const response = await axios.get(`${API_URL}/mangas/carousels`);
  return response.data.data;
};

export const getPopularMangas = async () => {
  const response = await axios.get(`${API_URL}/mangas/popular`);
  return response.data.data.mangas;
};