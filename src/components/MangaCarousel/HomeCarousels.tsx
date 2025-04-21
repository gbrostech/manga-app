import React, { useState, useEffect } from 'react';
import MangaCarousel from './MangaCarousel.tsx';
import '../custom-styles.css';
import { getCarouselData } from '../../api/api';

interface Manga {
  id: number;
  titulo: string;
  fecha: string;
  autor: string;
  sinopsis: string;
  volumenes: number;
  foto_portada: string;
  foto_fondo: string;
  foto_logo: string;
  amazon_link: string;
  tipo: string;
}

interface CarouselData {
    popularMangas: Manga[];
    recommendedMangas: Manga[];
    newReleasesMangas: Manga[];
}

const HomeCarousels: React.FC = () => {
    const [carouselData, setCarouselData] = useState<CarouselData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await getCarouselData();
          setCarouselData(data);
        } catch (err) {
          console.error('Error fetching carousel data:', err);
          setError('Error al cargar los carruseles');
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);

    if (loading || error || !carouselData) {
      return (
        <div className="py-16 text-center text-white">
          {loading && 'Cargando carruseles...'}
          {error && error}
          {!loading && !error && 'No se pudieron cargar los datos.'}
        </div>
      );
    }

    return (
        <div className="home-carousels py-8 px-4 md:px-6 lg:px-8 mx-auto">
            <MangaCarousel
                title="Mangas Populares"
                mangas={carouselData.popularMangas}
                limit={10}
            />

            <MangaCarousel
                title="Recomendaciones"
                mangas={carouselData.recommendedMangas}
                limit={10}
            />

            <MangaCarousel
                title="Nuevos Mangas"
                mangas={carouselData.newReleasesMangas}
                limit={10}
            />
        </div>
    );
};

export default HomeCarousels;
