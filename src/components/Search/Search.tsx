import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../custom-styles.css';

interface Manga {
  id: number;
  titulo: string;
  sinopsis: string;
  año: number;
  volumenes: number;
  autor: string;
  foto_portada: string;
}

interface SearchProps {
  query?: string;
}

const Search: React.FC<SearchProps> = ({ query = '' }) => {
  const [searchQuery, setSearchQuery] = useState<string>(query);
  const [searchResults, setSearchResults] = useState<Manga[]>([]);
  const [suggestions, setSuggestions] = useState<Manga[]>([]);
  const [allMangas, setAllMangas] = useState<Manga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // En un entorno real, esto sería una llamada a una API
    // Aquí simulamos la carga de datos desde nuestro CSV
    const loadMangasData = async () => {
      try {
        // Simulamos datos cargados desde el CSV
        const data: Manga[] = [
          {
            id: 1,
            titulo: "One Piece",
            sinopsis: "Monkey D. Luffy se embarca en un viaje para encontrar el tesoro One Piece y convertirse en el Rey de los Piratas.",
            año: 1997,
            volumenes: 105,
            autor: "Eiichiro Oda",
            foto_portada: "/images/portadas/manga_1.jpg",
          },
          {
            id: 2,
            titulo: "Berserk",
            sinopsis: "En un mundo medieval y oscuro, Guts, un mercenario marcado por un pasado trágico, busca venganza.",
            año: 1989,
            volumenes: 41,
            autor: "Kentaro Miura",
            foto_portada: "/images/portadas/manga_2.jpg",
          },
          {
            id: 3,
            titulo: "Attack on Titan",
            sinopsis: "La humanidad vive encerrada en ciudades rodeadas por enormes muros para protegerse de los titanes.",
            año: 2009,
            volumenes: 34,
            autor: "Hajime Isayama",
            foto_portada: "/images/portadas/manga_3.jpg",
          },
          {
            id: 4,
            titulo: "Demon Slayer",
            sinopsis: "Tras la masacre de su familia por un demonio, Tanjiro Kamado se convierte en un cazador de demonios.",
            año: 2016,
            volumenes: 23,
            autor: "Koyoharu Gotouge",
            foto_portada: "/images/portadas/manga_4.jpg",
          },
          {
            id: 5,
            titulo: "Jujutsu Kaisen",
            sinopsis: "Yuji Itadori, un estudiante con habilidades físicas excepcionales, se une a una organización secreta de hechiceros.",
            año: 2018,
            volumenes: 24,
            autor: "Gege Akutami",
            foto_portada: "/images/portadas/manga_5.jpg",
          },
          {
            id: 6,
            titulo: "Chainsaw Man",
            sinopsis: "Denji, un joven que puede transformarse en el Chainsaw Man gracias a su mascota demonio Pochita.",
            año: 2018,
            volumenes: 14,
            autor: "Tatsuki Fujimoto",
            foto_portada: "/images/portadas/manga_6.jpg",
          },
          {
            id: 7,
            titulo: "My Hero Academia",
            sinopsis: "En un mundo donde el 80% de la población posee superpoderes, Izuku Midoriya sueña con ser un héroe.",
            año: 2014,
            volumenes: 38,
            autor: "Kohei Horikoshi",
            foto_portada: "/images/portadas/manga_7.jpg",
          },
          {
            id: 8,
            titulo: "Vagabond",
            sinopsis: "Basada en la vida del legendario espadachín Miyamoto Musashi.",
            año: 1998,
            volumenes: 37,
            autor: "Takehiko Inoue",
            foto_portada: "/images/portadas/manga_8.jpg",
          },
          {
            id: 9,
            titulo: "Vinland Saga",
            sinopsis: "Thorfinn, hijo de uno de los mejores guerreros vikingos, busca venganza contra Askeladd.",
            año: 2005,
            volumenes: 26,
            autor: "Makoto Yukimura",
            foto_portada: "/images/portadas/manga_9.jpg",
          },
          {
            id: 10,
            titulo: "Tokyo Ghoul",
            sinopsis: "Ken Kaneki, un estudiante universitario, sobrevive a un encuentro con un ghoul y se convierte en un híbrido.",
            año: 2011,
            volumenes: 14,
            autor: "Sui Ishida",
            foto_portada: "/images/portadas/manga_10.jpg",
          },
          {
            id: 11,
            titulo: "Naruto",
            sinopsis: "Naruto Uzumaki, un joven ninja con el espíritu del Zorro de Nueve Colas sellado en su interior.",
            año: 1999,
            volumenes: 72,
            autor: "Masashi Kishimoto",
            foto_portada: "/images/portadas/manga_11.jpg",
          },
          {
            id: 12,
            titulo: "Dragon Ball",
            sinopsis: "Sigue las aventuras de Son Goku desde su infancia hasta la adultez.",
            año: 1984,
            volumenes: 42,
            autor: "Akira Toriyama",
            foto_portada: "/images/portadas/manga_12.jpg",
          },
          {
            id: 13,
            titulo: "Fullmetal Alchemist",
            sinopsis: "Los hermanos Edward y Alphonse Elric buscan la Piedra Filosofal para recuperar sus cuerpos.",
            año: 2001,
            volumenes: 27,
            autor: "Hiromu Arakawa",
            foto_portada: "/images/portadas/manga_13.jpg",
          },
          {
            id: 14,
            titulo: "Death Note",
            sinopsis: "Light Yagami encuentra un cuaderno sobrenatural que le permite matar a cualquier persona cuyo nombre escriba en él.",
            año: 2003,
            volumenes: 12,
            autor: "Tsugumi Ohba",
            foto_portada: "/images/portadas/manga_14.jpg",
          },
          {
            id: 15,
            titulo: "Hunter x Hunter",
            sinopsis: "Gon Freecss descubre que su padre, a quien creía muerto, es un legendario Hunter.",
            año: 1998,
            volumenes: 37,
            autor: "Yoshihiro Togashi",
            foto_portada: "/images/portadas/manga_15.jpg",
          }
        ];
        
        setAllMangas(data);
        
        // Si hay una consulta inicial, realizar la búsqueda
        if (query) {
          const results = performSearch(data, query);
          setSearchResults(results);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error cargando datos:', error);
        setLoading(false);
      }
    };

    loadMangasData();
  }, [query]);

  // Función para realizar la búsqueda
  const performSearch = (data: Manga[], query: string): Manga[] => {
    if (!query.trim()) return [];
    
    const normalizedQuery = query.toLowerCase().trim();
    
    return data.filter(manga => 
      manga.titulo.toLowerCase().includes(normalizedQuery) ||
      manga.autor.toLowerCase().includes(normalizedQuery) ||
      manga.sinopsis.toLowerCase().includes(normalizedQuery) ||
      manga.año.toString().includes(normalizedQuery)
    );
  };

  // Manejar cambios en el input de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Generar sugerencias mientras se escribe
    if (value.trim()) {
      const results = performSearch(allMangas, value);
      setSuggestions(results.slice(0, 5)); // Limitar a 5 sugerencias
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Manejar envío del formulario de búsqueda
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      const results = performSearch(allMangas, searchQuery);
      setSearchResults(results);
      setSuggestions([]);
      setShowSuggestions(false);
      
      // Actualizar la URL para reflejar la búsqueda
      navigate(`/buscar?q=${encodeURIComponent(searchQuery)}`);
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
    return <div className="text-white text-center py-10">Cargando resultados...</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen pt-8">
      <div className="mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Buscar Mangas</h1>
          <div className="w-24 h-1 bg-orange-500 mx-auto mb-8"></div>
          
          <div className="max-w-2xl mx-auto relative" ref={searchInputRef}>
            <form onSubmit={handleSearchSubmit} className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Buscar por título, autor, año..."
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-500 text-white px-6 rounded-r-md transition duration-300"
              >
                Buscar
              </button>
            </form>
            
            {/* Sugerencias de búsqueda */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full bg-gray-800 mt-1 rounded-md shadow-lg">
                {suggestions.map(manga => (
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
              </div>
            )}
          </div>
        </div>
        
        {/* Resultados de búsqueda */}
        {searchResults.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">
              Resultados para "{searchQuery}" ({searchResults.length})
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {searchResults.map((manga) => (
                <Link 
                  key={manga.id} 
                  to={`/manga/${manga.id}`}
                  className="manga-card group"
                >
                  <img
                    src={manga.foto_portada}
                    alt={manga.titulo}
                    className="manga-card-image"
                  />
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
                    
                    <div className="mt-auto">
                      <span className="bg-orange-600 hover:bg-orange-500 text-white text-center text-sm font-bold py-2 px-4 rounded-md transition duration-300 block">
                        Ver Detalles
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : searchQuery ? (
          <div className="text-center py-10">
            <p className="text-xl mb-4">No se encontraron resultados para "{searchQuery}"</p>
            <p className="text-gray-400">Intenta con otros términos o explora nuestras categorías</p>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-xl mb-4">Escribe en el buscador para encontrar mangas</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-4xl mx-auto mt-8">
              {['Acción', 'Aventura', 'Comedia', 'Drama', 'Fantasía', 'Terror', 'Misterio', 'Romance', 'Ciencia Ficción', 'Slice of Life', 'Deportes', 'Sobrenatural'].map((genre, index) => (
                <div 
                  key={index}
                  className="bg-gray-800 rounded-lg p-3 text-center hover:bg-gray-700 transition duration-300 cursor-pointer"
                  onClick={() => {
                    setSearchQuery(genre);
                    handleSearchSubmit(new Event('submit') as any);
                  }}
                >
                  {genre}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
