import React, { useState, useEffect } from 'react';
import MangaCarousel from './MangaCarousel.tsx';
import '../custom-styles.css';
import { getAllMangas } from '../../api/api';

interface Manga {
  id: number;
  titulo: string;
  sinopsis: string;
  año: number;
  volumenes: number;
  autor: string;
  foto_portada: string;
  fecha_publicacion: string;
}

const HomeCarousels: React.FC = () => {
  const [allMangas, setAllMangas] = useState<Manga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMangas = async () => {
      try {
        const data = await getAllMangas();
        setAllMangas(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching mangas:', err);
        setError('Error al cargar los mangas');
        setLoading(false);
      }
    };

    fetchMangas();
  }, []);

  if (loading) return <div className="py-16 text-center text-white">Cargando carruseles...</div>;
  if (error) return <div className="py-16 text-center text-white">{error}</div>;

  // Filtros para cada carrusel
  const popularFilter = () => true; // Todos los mangas para el carrusel de populares
  
  const recommendationsFilter = (manga: Manga) => {
    // Ejemplo: Mangas con año >= 2010
    return manga.año >= 2010;
  };
  
  const newReleasesFilter = (manga: Manga) => {
    // Ordenar por fecha de publicación (más recientes primero)
    return true;
  };
  
  // Funciones de ordenación
  const popularSort = (a: Manga, b: Manga) => {
    // Ejemplo: Ordenar por número de volúmenes (descendente)
    return b.volumenes - a.volumenes;
  };
  
  const recommendationsSort = (a: Manga, b: Manga) => {
    // Ejemplo: Ordenar por año (descendente)
    return b.año - a.año;
  };
  
  const newReleasesSort = (a: Manga, b: Manga) => {
    // Ordenar por fecha de publicación (más recientes primero)
    return new Date(b.fecha_publicacion).getTime() - new Date(a.fecha_publicacion).getTime();
  };

  return (
    <div className="home-carousels py-8 px-4 md:px-6 lg:px-8 mx-auto">
      <MangaCarousel 
        title="Mangas Populares" 
        filter={popularFilter}
        sort={popularSort}
        limit={10}
      />
      
      <MangaCarousel 
        title="Recomendaciones" 
        filter={recommendationsFilter}
        sort={recommendationsSort}
        limit={10}
      />
      
      <MangaCarousel 
        title="Nuevos Mangas" 
        filter={newReleasesFilter}
        sort={newReleasesSort}
        limit={10}
      />
    </div>
  );
};

export default HomeCarousels;
