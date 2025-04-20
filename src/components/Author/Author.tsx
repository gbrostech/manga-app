import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import '../custom-styles.css';
import { getAllAuthors, getAuthorInfo, searchAuthors } from '../../api/api';

interface AuthorProps {}

const Author: React.FC<AuthorProps> = () => {
  const { authorName } = useParams<{ authorName: string }>();
  const [author, setAuthor] = useState<any>(null);
  const [authorMangas, setAuthorMangas] = useState<any[]>([]);
  const [allAuthors, setAllAuthors] = useState<string[]>([]);
  const [filteredAuthors, setFilteredAuthors] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const searchInputRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Agrupar autores por letra inicial
  const groupedAuthors = filteredAuthors.reduce((acc: {[key: string]: string[]}, author) => {
    const firstLetter = author.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(author);
    return acc;
  }, {});

  // Ordenar las letras alfabéticamente
  const sortedLetters = Object.keys(groupedAuthors).sort();

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        setLoading(true);
        
        // Obtener información del autor actual
        if (authorName) {
          const authorData = await getAuthorInfo(authorName);
          setAuthor(authorData.author);
          setAuthorMangas(authorData.mangas);
        }
        
        // Obtener todos los autores para el listado alfabético
        const authors = await getAllAuthors();
        setAllAuthors(authors);
        setFilteredAuthors(authors);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching author data:', err);
        setError('Error al cargar los datos del autor');
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [authorName]);

  // Manejar cambios en el input de búsqueda
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      try {
        const results = await searchAuthors(value);
        setFilteredAuthors(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error al buscar autores:', error);
      }
    } else {
      setFilteredAuthors(allAuthors);
      setShowSuggestions(false);
    }
  };

  // Manejar clic en un autor
  const handleAuthorClick = (name: string) => {
    navigate(`/autor/${name}`);
    setShowSuggestions(false);
    setSearchQuery('');
  };

  // Manejar errores de carga de imágenes
  const handleImageError = (mangaId: number) => {
    setImageErrors(prev => ({
      ...prev,
      [mangaId]: true
    }));
  };

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loading) {
    return <div className="text-white text-center py-10">Cargando información del autor...</div>;
  }

  if (error) {
    return <div className="text-white text-center py-10">{error}</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="mx-auto px-3 sm:px-4 lg:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sección izquierda: Información del autor y sus mangas */}
          <div className="lg:col-span-2">
            {author ? (
              <div>
                <h1 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-2">{author}</h1>
                
                {authorMangas.length > 0 ? (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Mangas de {author}</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                      {authorMangas.map((manga) => (
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
                  </div>
                ) : (
                  <p className="text-gray-400">No se encontraron mangas para este autor.</p>
                )}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-xl mb-4">Selecciona un autor de la lista</p>
                <p className="text-gray-400">Explora nuestra colección de autores de manga</p>
              </div>
            )}
          </div>
          
          {/* Sección derecha: Buscador y listado alfabético de autores */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Autores</h2>
            
            {/* Buscador de autores */}
            <div className="mb-6" ref={searchInputRef}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Buscar autor..."
                  className="w-full pl-10 pr-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              {/* Sugerencias de búsqueda */}
              {showSuggestions && searchQuery && (
                <div className="mt-2 bg-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredAuthors.length > 0 ? (
                    filteredAuthors.map((author, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-600 cursor-pointer"
                        onClick={() => handleAuthorClick(author)}
                      >
                        {author}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-400">No se encontraron autores</div>
                  )}
                </div>
              )}
            </div>
            
            {/* Listado alfabético de autores */}
            <div className="space-y-4">
              {sortedLetters.map(letter => (
                <div key={letter} className="mb-4">
                  <h3 className="text-lg font-semibold text-orange-500 mb-2">{letter}</h3>
                  <ul className="space-y-1">
                    {groupedAuthors[letter].map((author, index) => (
                      <li key={index}>
                        <Link
                          to={`/autor/${author}`}
                          className={`block py-1 px-2 rounded hover:bg-gray-700 transition duration-150 ${
                            author === authorName ? 'bg-gray-700 text-orange-500 font-semibold' : ''
                          }`}
                        >
                          {author}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Author;
