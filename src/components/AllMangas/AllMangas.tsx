import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../custom-styles.css';
import { getAllMangas } from '../../api/api';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

interface Manga {
  id: number;
  titulo: string;
  sinopsis: string;
  año: number;
  volumenes: number;
  autor: string;
  foto_portada: string;
  foto_fondo: string;
  foto_logo: string;
  amazon_link?: string;
  fecha_publicacion: string;
}

interface FilterOptions {
  autor: string;
  añoDesde: string;
  añoHasta: string;
  ordenarPor: string;
}

const AllMangas: React.FC = () => {
  const [allMangas, setAllMangas] = useState<Manga[]>([]);
  const [filteredMangas, setFilteredMangas] = useState<Manga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [authors, setAuthors] = useState<string[]>([]);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [filters, setFilters] = useState<FilterOptions>({
    autor: '',
    añoDesde: '',
    añoHasta: '',
    ordenarPor: 'titulo'
  });

  useEffect(() => {
    const loadMangasData = async () => {
      try {
        setLoading(true);
        const data = await getAllMangas();
        
        // Extraer lista única de autores para el filtro
        const uniqueAuthors = Array.from(new Set(data.map((manga: Manga) => manga.autor))).sort() as string[];
        
        setAllMangas(data);
        setFilteredMangas(data);
        setAuthors(uniqueAuthors);
        setLoading(false);
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError('Error al cargar los mangas');
        setLoading(false);
      }
    };

    loadMangasData();
  }, []);

  useEffect(() => {
    if (allMangas.length > 0) {
      let result = [...allMangas];
      
      // Filtrar por autor
      if (filters.autor) {
        result = result.filter(manga => manga.autor === filters.autor);
      }
      
      // Filtrar por año desde
      if (filters.añoDesde) {
        const yearFrom = parseInt(filters.añoDesde);
        result = result.filter(manga => manga.año >= yearFrom);
      }
      
      // Filtrar por año hasta
      if (filters.añoHasta) {
        const yearTo = parseInt(filters.añoHasta);
        result = result.filter(manga => manga.año <= yearTo);
      }
      
      // Ordenar resultados
      switch (filters.ordenarPor) {
        case 'titulo':
          result.sort((a, b) => a.titulo.localeCompare(b.titulo));
          break;
        case 'año':
          result.sort((a, b) => b.año - a.año);
          break;
        case 'autor':
          result.sort((a, b) => a.autor.localeCompare(b.autor));
          break;
        case 'fecha_publicacion':
          result.sort((a, b) => new Date(b.fecha_publicacion).getTime() - new Date(a.fecha_publicacion).getTime());
          break;
        default:
          break;
      }
      
      setFilteredMangas(result);
    }
  }, [filters, allMangas]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageError = (mangaId: number) => {
    setImageErrors(prev => ({
      ...prev,
      [mangaId]: true
    }));
  };

  const resetFilters = () => {
    setFilters({
      autor: '',
      añoDesde: '',
      añoHasta: '',
      ordenarPor: 'titulo'
    });
  };

  if (loading) return <div className="py-8 text-center text-white">Cargando catálogo de mangas...</div>;
  if (error) return <div className="py-8 text-center text-white">{error}</div>;

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="main-container py-8">
        <h1 className="text-3xl font-bold mb-8">Catálogo Completo de Mangas</h1>
        
        <div className="mb-8">
          {/* Filtros siempre visibles */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Autor</label>
                <select 
                  name="autor" 
                  value={filters.autor} 
                  onChange={handleFilterChange}
                  className="w-full bg-gray-700 text-white rounded p-2"
                >
                  <option value="">Todos los autores</option>
                  {authors.map(author => (
                    <option key={author} value={author}>{author}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Año desde</label>
                <input 
                  type="number" 
                  name="añoDesde" 
                  value={filters.añoDesde} 
                  onChange={handleFilterChange}
                  placeholder="Ej: 1990"
                  className="w-full bg-gray-700 text-white rounded p-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Año hasta</label>
                <input 
                  type="number" 
                  name="añoHasta" 
                  value={filters.añoHasta} 
                  onChange={handleFilterChange}
                  placeholder="Ej: 2023"
                  className="w-full bg-gray-700 text-white rounded p-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Ordenar por</label>
                <select 
                  name="ordenarPor" 
                  value={filters.ordenarPor} 
                  onChange={handleFilterChange}
                  className="w-full bg-gray-700 text-white rounded p-2"
                >
                  <option value="titulo">Título (A-Z)</option>
                  <option value="año">Año (Más reciente)</option>
                  <option value="autor">Autor (A-Z)</option>
                  <option value="fecha_publicacion">Fecha de publicación (Más reciente)</option>
                </select>
              </div>
            </div>
            
            <button 
              onClick={resetFilters}
              className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
            >
              Restablecer Filtros
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredMangas.map(manga => (
            <Link 
              key={manga.id} 
              to={`/manga/${manga.id}`}
              className="manga-card group"
            >
              {imageErrors[manga.id] ? (
                <div className="placeholder-image manga-card-image"></div>
              ) : (
                <img
                  src={manga.foto_portada}
                  alt={manga.titulo}
                  className="manga-card-image"
                  onError={() => handleImageError(manga.id)}
                />
              )}
              <div className="manga-card-overlay">
                <div className="mb-auto">
                  <h3 className="text-white font-bold text-lg mb-1">{manga.titulo}</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                      {manga.año}
                    </span>
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                      {manga.volumenes} tomos
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm line-clamp-3 mb-4">{manga.sinopsis}</p>
                </div>
                
                <div className="mt-auto flex flex-col space-y-2">
                  <span className="bg-orange-600 hover:bg-orange-500 text-white text-center text-sm font-bold py-2 px-4 rounded-md transition duration-300">
                    Ver Detalles
                  </span>
                  {manga.amazon_link && (
                    <a 
                      href={manga.amazon_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-500 text-white text-center text-sm font-bold py-2 px-4 rounded-md transition duration-300 flex items-center justify-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ShoppingCartIcon className="h-4 w-4 mr-2" />
                      <span>Comprar</span>
                    </a>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {filteredMangas.length === 0 && (
          <div className="text-center py-8">
            <p className="text-xl">No se encontraron mangas con los filtros seleccionados.</p>
            <button 
              onClick={resetFilters}
              className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
            >
              Restablecer Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllMangas;
