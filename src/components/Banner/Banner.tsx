import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import '../custom-styles.css';
import { getAllMangas } from '../../api/api';

interface BannerItem {
  id: number;
  titulo: string;
  sinopsis: string;
  año: number;
  volumenes: number;
  autor: string;
  foto_fondo: string;
  foto_logo: string;
  amazon_link: string;
}

const Banner: React.FC = () => {
  const [bannerItems, setBannerItems] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, Record<number, boolean>>>({
    background: {},
    logo: {}
  });

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const mangas = await getAllMangas();
        // Usar los primeros 5 mangas para el banner
        setBannerItems(mangas.slice(0, 5));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching banner data:', err);
        setError('Error al cargar los datos del banner');
        setLoading(false);
      }
    };

    fetchBannerData();
  }, []);

  const handleBackgroundImageError = (itemId: number) => {
    setImageErrors(prev => ({
      ...prev,
      background: {
        ...prev.background,
        [itemId]: true
      }
    }));
  };

  const handleLogoImageError = (itemId: number) => {
    setImageErrors(prev => ({
      ...prev,
      logo: {
        ...prev.logo,
        [itemId]: true
      }
    }));
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: true,
    dotsClass: "slick-dots custom-dots",
    customPaging: function() {
      return (
        <div className="custom-dot"></div>
      );
    }
  };

  if (loading) return <div className="h-[500px] bg-gray-900 flex items-center justify-center"><p className="text-white">Cargando...</p></div>;
  if (error) return <div className="h-[500px] bg-gray-900 flex items-center justify-center"><p className="text-white">{error}</p></div>;

  return (
    <div className="banner-container relative overflow-hidden">
      <Slider {...settings}>
        {bannerItems.map((item) => (
          <div key={item.id} className="relative">
            <div className="banner-image-container">
              <div className="banner-fade-left"></div>
              {imageErrors.background[item.id] ? (
                <div className="placeholder-image banner-image"></div>
              ) : (
                <img
                  src={item.foto_fondo}
                  alt={item.titulo}
                  className="banner-image"
                  onError={() => handleBackgroundImageError(item.id)}
                />
              )}
              <div className="banner-fade-bottom"></div>
            </div>
            
            <div className="banner-content">
              <div className="banner-text-container">
                {item.foto_logo && !imageErrors.logo[item.id] ? (
                  <img 
                    src={item.foto_logo} 
                    alt={`${item.titulo} logo`} 
                    className="banner-logo mb-4"
                    onError={() => handleLogoImageError(item.id)}
                  />
                ) : null}
                <h1 className="banner-title">{item.titulo}</h1>
                <p className="banner-description">{item.sinopsis}</p>
                
                <div className="banner-buttons">
                  <Link 
                    to={`/manga/${item.id}`} 
                    className="banner-button primary"
                  >
                    Ver Detalles
                  </Link>
                  
                  {item.amazon_link && (
                    <a 
                      href={item.amazon_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="banner-button secondary"
                    >
                      <ShoppingCartIcon className="h-5 w-5 mr-2" />
                      <span>Comprar</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Banner;
