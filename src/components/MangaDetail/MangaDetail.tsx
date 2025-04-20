import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import '../custom-styles.css';
import { getMangaById } from '../../api/api';

interface MangaDetailProps {}

const MangaDetail: React.FC<MangaDetailProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [manga, setManga] = useState<any>(null);
  const [tomos, setTomos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMangaData = async () => {
      try {
        setLoading(true);
        const mangaId = parseInt(id || '1');
        const mangaData = await getMangaById(mangaId);
        
        if (!mangaData) {
          setError('No se encontró el manga solicitado');
          setLoading(false);
          return;
        }
        
        setManga(mangaData);
        
        // Generamos tomos para el manga
        const tomosData: any[] = [];
        const numTomos = mangaData.volumenes > 20 ? 20 : mangaData.volumenes; // Limitamos a 20 tomos para la visualización
        
        for (let i = 1; i <= numTomos; i++) {
          const año = mangaData.año + Math.floor((i - 1) / 4);
          const mes = ((i - 1) % 12) + 1;
          // Generamos enlaces de Amazon para cada tomo
          const tomoAmazonLink = mangaData.amazon_link ? 
            `${mangaData.amazon_link.replace(/\/dp\/[^/]+/, `/dp/TOMO${i}${mangaId}`)}` : 
            '';
          
          tomosData.push({
            id: i,
            numero: i,
            titulo: `Volumen ${i}`,
            fecha_publicacion: `${mes < 10 ? '0' + mes : mes}/01/${año}`,
            portada: mangaData.foto_portada,
            amazon_link: tomoAmazonLink
          });
        }
        
        setTomos(tomosData);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar los datos del manga:', err);
        setError('Error al cargar los datos del manga');
        setLoading(false);
      }
    };

    fetchMangaData();
  }, [id]);

  if (loading) {
    return <div className="text-white text-center py-10">Cargando información del manga...</div>;
  }

  if (error) {
    return <div className="text-white text-center py-10">{error}</div>;
  }

  if (!manga) {
    return <div className="text-white text-center py-10">No se encontró el manga solicitado</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Banner del manga */}
      <div className="relative">
        <div 
          className="banner-image-container"
          style={{ height: '500px' }}
        >
          <img
            src={manga.foto_fondo}
            alt={manga.titulo}
            className="banner-image"
          />
          <div className="banner-fade-bottom"></div>
        </div>
        
        <div className="banner-content">
          <div className="banner-text-container max-w-3xl">
            {manga.foto_logo && (
              <img 
                src={manga.foto_logo} 
                alt={`${manga.titulo} logo`} 
                className="banner-logo mb-4"
              />
            )}
            <h1 className="banner-title">{manga.titulo}</h1>
            
            <div className="flex flex-wrap gap-4 mb-4">
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">Año: {manga.año}</span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">Volúmenes: {manga.volumenes}</span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">Autor: {manga.autor}</span>
            </div>
            
            <p className="banner-description hidden md:block">{manga.sinopsis}</p>
            
            <div className="banner-buttons">
              {manga.amazon_link && (
                <a 
                  href={manga.amazon_link} 
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
      
      {/* Sinopsis para móvil */}
      <div className="md:hidden px-4 py-6 bg-gray-800">
        <h2 className="text-xl font-bold mb-2">Sinopsis</h2>
        <p className="text-gray-300">{manga.sinopsis}</p>
      </div>
      
      {/* Sección de tomos */}
      <div className="mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 border-b border-gray-700 pb-4">Tomos Publicados</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-4">
          {tomos.map((tomo: any) => (
            <a 
              key={tomo.id} 
              href={tomo.amazon_link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300 group"
            >
              <div className="aspect-w-2 aspect-h-3 relative">
                <img 
                  src={tomo.portada} 
                  alt={`${manga.titulo} - Tomo ${tomo.numero}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 bg-orange-600 text-white px-2 py-1 text-xs font-bold">
                  Vol. {tomo.numero}
                </div>
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-bold px-3 py-2 bg-blue-600 rounded-md">Comprar en Amazon</span>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-sm mb-1">{tomo.titulo}</h3>
                <p className="text-gray-400 text-xs">{tomo.fecha_publicacion}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MangaDetail;
