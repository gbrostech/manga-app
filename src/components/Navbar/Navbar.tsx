import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import '../custom-styles.css';
import { searchMangas } from '../../api/api';

const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  // Manejar cambios en el input de búsqueda
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim().length > 2) {
      setIsSearching(true);
      try {
        const results = await searchMangas(value);
        setSearchResults(results.slice(0, 5)); // Limitar a 5 sugerencias
        setShowSuggestions(true);
        setIsSearching(false);
      } catch (error) {
        console.error('Error al buscar:', error);
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
    }
  };

  // Manejar envío del formulario de búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
      setMobileMenuOpen(false);
    }
  };

  // Manejar clic en una sugerencia
  const handleSuggestionClick = (mangaId: number) => {
    setShowSuggestions(false);
    navigate(`/manga/${mangaId}`);
  };

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                className="h-10 w-auto"
                src="/logo.png"
                alt="Mangas ESP"
              />
              <span className="ml-2 text-xl font-bold hidden sm:block">Mangas ESP</span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="flex-1 max-w-lg mx-4 hidden md:block" ref={searchRef}>
            <form onSubmit={handleSearch}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-gray-800 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-white focus:text-gray-900 focus:border-white sm:text-sm transition duration-150 ease-in-out"
                  placeholder="Buscar mangas..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                
                {/* Sugerencias de búsqueda */}
                {showSuggestions && searchResults.length > 0 && (
                  <div className="absolute z-10 w-full bg-gray-800 mt-1 rounded-md shadow-lg">
                    {searchResults.map(manga => (
                      <div
                        key={manga.id}
                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center"
                        onClick={() => handleSuggestionClick(manga.id)}
                      >
                        <img 
                          src={manga.foto_portada} 
                          alt={manga.titulo} 
                          className="w-10 h-14 object-cover mr-3"
                        />
                        <div>
                          <div className="font-bold">{manga.titulo}</div>
                          <div className="text-sm text-gray-400">{manga.autor}</div>
                        </div>
                      </div>
                    ))}
                    <div className="px-4 py-2 text-center border-t border-gray-700">
                      <button 
                        onClick={handleSearch}
                        className="text-orange-500 hover:text-orange-400"
                      >
                        Ver todos los resultados
                      </button>
                    </div>
                  </div>
                )}
                
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-orange-500"></div>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/todos-los-mangas"
              className="px-3 py-2 text-sm font-medium text-white hover:text-orange-500 transition duration-150 ease-in-out"
            >
              Catálogo
            </Link>
            <Link
              to="/novedades"
              className="px-3 py-2 text-sm font-medium text-white hover:text-orange-500 transition duration-150 ease-in-out"
            >
              Novedades
            </Link>
            <Link
              to="/autor/Eiichiro Oda"
              className="px-3 py-2 text-sm font-medium text-white hover:text-orange-500 transition duration-150 ease-in-out"
            >
              Autores
            </Link>
            <Link
              to="/buscar"
              className="px-3 py-2 text-sm font-medium text-white hover:text-orange-500 transition duration-150 ease-in-out md:hidden"
            >
              Buscar
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-gray-400 hover:text-white focus:outline-none focus:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800">
          {/* Search Bar - Mobile */}
          <div className="px-2 py-2" ref={searchRef}>
            <form onSubmit={handleSearch}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-gray-700 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-white focus:text-gray-900 focus:border-white sm:text-sm transition duration-150 ease-in-out"
                  placeholder="Buscar mangas..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                
                {/* Sugerencias de búsqueda - Mobile */}
                {showSuggestions && searchResults.length > 0 && (
                  <div className="absolute z-10 w-full bg-gray-800 mt-1 rounded-md shadow-lg">
                    {searchResults.map(manga => (
                      <div
                        key={manga.id}
                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center"
                        onClick={() => handleSuggestionClick(manga.id)}
                      >
                        <img 
                          src={manga.foto_portada} 
                          alt={manga.titulo} 
                          className="w-10 h-14 object-cover mr-3"
                        />
                        <div>
                          <div className="font-bold">{manga.titulo}</div>
                          <div className="text-sm text-gray-400">{manga.autor}</div>
                        </div>
                      </div>
                    ))}
                    <div className="px-4 py-2 text-center border-t border-gray-700">
                      <button 
                        onClick={handleSearch}
                        className="text-orange-500 hover:text-orange-400"
                      >
                        Ver todos los resultados
                      </button>
                    </div>
                  </div>
                )}
                
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-orange-500"></div>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Mobile Navigation Links */}
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            Inicio
          </Link>
          <Link
            to="/todos-los-mangas"
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            Catálogo
          </Link>
          <Link
            to="/novedades"
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            Novedades
          </Link>
          <Link
            to="/autor/Eiichiro Oda"
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            Autores
          </Link>
          <Link
            to="/buscar"
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            Búsqueda Avanzada
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
