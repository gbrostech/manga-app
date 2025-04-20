import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import '../custom-styles.css';
import { getAllMangas } from '../../api/api';

interface MangaItem {
  id: number;
  titulo: string;
  sinopsis: string;
  año: number;
  volumenes: number;
  autor: string;
  foto_portada: string;
  amazon_link: string;
  fecha_publicacion: string;
}

interface MangaCarouselProps {
  title: string;
  filter?: (manga: MangaItem) => boolean;
  sort?: (a: MangaItem, b: MangaItem) => number;
  limit?: number;
}

const MangaCarousel: React.FC<MangaCarouselProps> = ({ title, filter, sort, limit = 10 }) => {
  const [mangas, setMangas] = useState<MangaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchMangas = async () => {
      try {
        const data = await getAllMangas();
        
        let filteredData = [...data];
        
        // Aplicar filtro si se proporciona
        if (filter) {
          filteredData = filteredData.filter(filter);
        }
        
        // Aplicar ordenamiento si se proporciona
        if (sort) {
          filteredData.sort(sort);
        }
        
        // Limitar la cantidad de mangas
        filteredData = filteredData.slice(0, limit);
        
        setMangas(filteredData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching mangas:', err);
        setError('Error al cargar los mangas');
        setLoading(false);
      }
    };

    fetchMangas();
  }, [filter, sort, limit]);

  const handleImageError = (mangaId: number) => {
    setImageErrors(prev => ({
      ...prev,
      [mangaId]: true
    }));
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 5,
    initialSlide: 0,
    arrows: true,
    variableWidth: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 4,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      }
    ]
  };

  if (loading) return <div className="py-8 text-center text-white">Cargando...</div>;
  if (error) return <div className="py-8 text-center text-white">{error}</div>;
  if (mangas.length === 0) return <div className="py-8 text-center text-white">No hay mangas disponibles</div>;

  return (
    <div className="manga-slider py-4">
      <h2 className="manga-slider-title mb-4">{title}</h2>
      <Slider {...settings}>
        {mangas.map((manga) => (
          <div key={manga.id}>
            <Link to={`/manga/${manga.id}`} className="manga-card block">
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
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MangaCarousel;
