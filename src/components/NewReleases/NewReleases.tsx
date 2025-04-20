import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../custom-styles.css';

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

interface MonthGroup {
  month: string;
  mangas: Manga[];
}

const NewReleases: React.FC = () => {
  const [monthGroups, setMonthGroups] = useState<MonthGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // En un entorno real, esto sería una llamada a una API
    // Aquí simulamos la carga de datos desde nuestro CSV
    const loadNewReleasesData = async () => {
      try {
        // Simulamos datos cargados desde el CSV
        const allMangas: Manga[] = [
          {
            id: 1,
            titulo: "One Piece",
            sinopsis: "Monkey D. Luffy se embarca en un viaje para encontrar el tesoro One Piece y convertirse en el Rey de los Piratas.",
            año: 1997,
            volumenes: 105,
            autor: "Eiichiro Oda",
            foto_portada: "/images/portadas/manga_1.jpg",
            foto_fondo: "/images/fondos/banner_1.jpg",
            foto_logo: "/images/logos/one_piece_logo.png",
            amazon_link: "https://www.amazon.es/One-Piece-1-Eiichiro-Oda/dp/8468471860?&linkCode=ll1&tag=mangasesp-21",
            fecha_publicacion: "2023-12-15"
          },
          {
            id: 2,
            titulo: "Berserk",
            sinopsis: "En un mundo medieval y oscuro, Guts, un mercenario marcado por un pasado trágico, busca venganza.",
            año: 1989,
            volumenes: 41,
            autor: "Kentaro Miura",
            foto_portada: "/images/portadas/manga_2.jpg",
            foto_fondo: "/images/fondos/banner_2.jpg",
            foto_logo: "/images/logos/berserk_logo.png",
            amazon_link: "https://www.amazon.es/Berserk-1-Kentaro-Miura/dp/8417957006?&linkCode=ll1&tag=mangasesp-21",
            fecha_publicacion: "2023-11-20"
          },
          {
            id: 3,
            titulo: "Attack on Titan",
            sinopsis: "La humanidad vive encerrada en ciudades rodeadas por enormes muros para protegerse de los titanes.",
            año: 2009,
            volumenes: 34,
            autor: "Hajime Isayama",
            foto_portada: "/images/portadas/manga_3.jpg",
            foto_fondo: "/images/fondos/banner_3.jpg",
            foto_logo: "/images/logos/attack_on_titan_logo.png",
            amazon_link: "https://www.amazon.es/Ataque-los-Titanes-1-CÓMIC-MANGA/dp/8467917040?&linkCode=ll1&tag=mangasesp-21",
            fecha_publicacion: "2024-01-10"
          },
          {
            id: 4,
            titulo: "Demon Slayer",
            sinopsis: "Tras la masacre de su familia por un demonio, Tanjiro Kamado se convierte en un cazador de demonios.",
            año: 2016,
            volumenes: 23,
            autor: "Koyoharu Gotouge",
            foto_portada: "/images/portadas/manga_4.jpg",
            foto_fondo: "/images/fondos/banner_4.jpg",
            foto_logo: "/images/logos/demon_slayer_logo.png",
            amazon_link: "https://www.amazon.es/Guardianes-noche-1-CÓMIC-MANGA/dp/8417292881?&linkCode=ll1&tag=mangasesp-21",
            fecha_publicacion: "2024-02-05"
          },
          {
            id: 5,
            titulo: "Jujutsu Kaisen",
            sinopsis: "Yuji Itadori, un estudiante con habilidades físicas excepcionales, se une a una organización secreta de hechiceros.",
            año: 2018,
            volumenes: 24,
            autor: "Gege Akutami",
            foto_portada: "/images/portadas/manga_5.jpg",
            foto_fondo: "/images/fondos/banner_5.jpg",
            foto_logo: "/images/logos/jujutsu_kaisen_logo.png",
            amazon_link: "https://www.amazon.es/Jujutsu-Kaisen-1-Gege-Akutami/dp/8467939788?&linkCode=ll1&tag=mangasesp-21",
            fecha_publicacion: "2024-03-15"
          },
          {
            id: 6,
            titulo: "Chainsaw Man",
            sinopsis: "Denji, un joven que puede transformarse en el Chainsaw Man gracias a su mascota demonio Pochita.",
            año: 2018,
            volumenes: 14,
            autor: "Tatsuki Fujimoto",
            foto_portada: "/images/portadas/manga_6.jpg",
            foto_fondo: "/images/fondos/banner_1.jpg",
            foto_logo: "/images/logos/chainsaw_man_logo.png",
            amazon_link: "https://www.amazon.es/Chainsaw-Man-1-Tatsuki-Fujimoto/dp/8467939958?&linkCode=ll1&tag=mangasesp-21",
            fecha_publicacion: "2024-01-25"
          },
          {
            id: 7,
            titulo: "My Hero Academia",
            sinopsis: "En un mundo donde el 80% de la población posee superpoderes, Izuku Midoriya sueña con ser un héroe.",
            año: 2014,
            volumenes: 38,
            autor: "Kohei Horikoshi",
            foto_portada: "/images/portadas/manga_7.jpg",
            foto_fondo: "/images/fondos/banner_2.jpg",
            foto_logo: "/images/logos/my_hero_academia_logo.png",
            amazon_link: "https://www.amazon.es/My-Hero-Academia-1-CÓMIC-MANGA/dp/8416693595?&linkCode=ll1&tag=mangasesp-21",
            fecha_publicacion: "2023-10-30"
          },
          {
            id: 8,
            titulo: "Vagabond",
            sinopsis: "Basada en la vida del legendario espadachín Miyamoto Musashi.",
            año: 1998,
            volumenes: 37,
            autor: "Takehiko Inoue",
            foto_portada: "/images/portadas/manga_8.jpg",
            foto_fondo: "/images/fondos/banner_3.jpg",
            foto_logo: "/images/logos/vagabond_logo.png",
            amazon_link: "https://www.amazon.es/Vagabond-1-Takehiko-Inoue/dp/8417957014?&linkCode=ll1&tag=mangasesp-21",
            fecha_publicacion: "2023-09-15"
          },
          {
            id: 9,
            titulo: "Vinland Saga",
            sinopsis: "Thorfinn, hijo de uno de los mejores guerreros vikingos, busca venganza contra Askeladd.",
            año: 2005,
            volumenes: 26,
            autor: "Makoto Yukimura",
            foto_portada: "/images/portadas/manga_9.jpg",
            foto_fondo: "/images/fondos/banner_4.jpg",
            foto_logo: "/images/logos/vinland_saga_logo.png",
            amazon_link: "https://www.amazon.es/Vinland-Saga-1-Makoto-Yukimura/dp/8467926279?&linkCode=ll1&tag=mangasesp-21",
            fecha_publicacion: "2024-02-20"
          },
          {
            id: 10,
            titulo: "Tokyo Ghoul",
            sinopsis: "Ken Kaneki, un estudiante universitario, sobrevive a un encuentro con un ghoul y se convierte en un híbrido.",
            año: 2011,
            volumenes: 14,
            autor: "Sui Ishida",
            foto_portada: "/images/portadas/manga_10.jpg",
            foto_fondo: "/images/fondos/banner_5.jpg",
            foto_logo: "/images/logos/tokyo_ghoul_logo.png",
            amazon_link: "https://www.amazon.es/Tokyo-Ghoul-1-Sui-Ishida/dp/8417176063?&linkCode=ll1&tag=mangasesp-21",
            fecha_publicacion: "2023-11-05"
          },
          {
            id: 11,
            titulo: "Naruto",
            sinopsis: "Naruto Uzumaki, un joven ninja con el espíritu del Zorro de Nueve Colas sellado en su interior.",
            año: 1999,
            volumenes: 72,
            autor: "Masashi Kishimoto",
            foto_portada: "/images/portadas/manga_11.jpg",
            foto_fondo: "/images/fondos/banner_1.jpg",
            foto_logo: "/images/logos/naruto_logo.png",
            amazon_link: "https://www.amazon.es/Naruto-1-Masashi-Kishimoto/dp/8484496767?&linkCode=ll1&tag=mangasesp-21",
            fecha_publicacion: "2023-08-25"
          },
          {
            id: 12,
            titulo: "Dragon Ball",
            sinopsis: "Sigue las aventuras de Son Goku desde su infancia hasta la adultez.",
            año: 1984,
            volumenes: 42,
            autor: "Akira Toriyama",
            foto_portada: "/images/portadas/manga_12.jpg",
            foto_fondo: "/images/fondos/banner_2.jpg",
            foto_logo: "/images/logos/dragon_ball_logo.png",
            amazon_link: "https://www.amazon.es/Dragon-Ball-1-DRAGON-BALL-COLOR/dp/8416051984?&linkCode=ll1&tag=mangasesp-21",
            fecha_publicacion: "2023-07-10"
          },
          {
            id: 13,
            titulo: "Fullmetal Alchemist",
            sinopsis: "Los hermanos Edward y Alphonse Elric buscan la Piedra Filosofal para recuperar sus cuerpos.",
            año: 2001,
            volumenes: 27,
            autor: "Hiromu Arakawa",
            foto_portada: "/images/portadas/manga_13.jpg",
            foto_fondo: "/images/fondos/banner_3.jpg",
            foto_logo: "/images/logos/fullmetal_alchemist_logo.png",
            amazon_link: "https://www.amazon.es/Fullmetal-Alchemist-Kanzenban-1-CÓMIC-MANGA/dp/8467913304?&linkCode=ll1&tag=mangasesp-21",
            fecha_publicacion: "2024-03-05"
          },
          {
            id: 14,
            titulo: "Death Note",
            sinopsis: "Light Yagami encuentra un cuaderno sobrenatural que le permite matar a cualquier persona cuyo nombre escriba en él.",
            año: 2003,
            volumenes: 12,
            autor: "Tsugumi Ohba",
            foto_portada: "/images/portadas/manga_14.jpg",
            foto_fondo: "/images/fondos/banner_4.jpg",
            foto_logo: "/images/logos/death_note_logo.png",
            amazon_link: "https://www.amazon.es/Death-Note-1-Takeshi-Obata/dp/8467917040?&linkCode=ll1&tag=mangasesp-21",
            fecha_publicacion: "2023-12-01"
          },
          {
            id: 15,
            titulo: "Hunter x Hunter",
            sinopsis: "Gon Freecss descubre que su padre, a quien creía muerto, es un legendario Hunter.",
            año: 1998,
            volumenes: 37,
            autor: "Yoshihiro Togashi",
            foto_portada: "/images/portadas/manga_15.jpg",
            foto_fondo: "/images/fondos/banner_5.jpg",
            foto_logo: "/images/logos/hunter_x_hunter_logo.png",
            amazon_link: "https://www.amazon.es/Hunter-x-1-Yoshihiro-Togashi/dp/8490947228?&linkCode=ll1&tag=mangasesp-21",
            fecha_publicacion: "2024-01-15"
          }
        ];
        
        // Ordenar mangas por fecha de publicación (más recientes primero)
        const sortedMangas = [...allMangas].sort((a, b) => {
          return new Date(b.fecha_publicacion).getTime() - new Date(a.fecha_publicacion).getTime();
        });
        
        // Agrupar mangas por mes
        const groups: { [key: string]: Manga[] } = {};
        
        sortedMangas.forEach(manga => {
          const date = new Date(manga.fecha_publicacion);
          const monthYear = `${date.toLocaleString('es-ES', { month: 'long' })} ${date.getFullYear()}`;
          
          if (!groups[monthYear]) {
            groups[monthYear] = [];
          }
          
          groups[monthYear].push(manga);
        });
        
        // Convertir el objeto de grupos a un array para renderizar
        const groupsArray: MonthGroup[] = Object.keys(groups).map(month => ({
          month,
          mangas: groups[month]
        }));
        
        setMonthGroups(groupsArray);
        setLoading(false);
      } catch (error) {
        console.error('Error cargando datos de novedades:', error);
        setLoading(false);
      }
    };

    loadNewReleasesData();
  }, []);

  if (loading) {
    return <div className="text-white text-center py-10">Cargando novedades...</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen pt-8">
      <div className="mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Novedades</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Descubre los últimos lanzamientos de mangas organizados por mes de publicación.
          </p>
          <div className="w-24 h-1 bg-orange-500 mx-auto mt-4"></div>
        </div>
        
        {monthGroups.map((group, index) => (
          <div key={index} className="mb-16">
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2 capitalize">
              {group.month}
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {group.mangas.map((manga) => (
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
                    
                    <div className="mt-auto flex flex-col space-y-2">
                      <span className="bg-orange-600 hover:bg-orange-500 text-white text-center text-sm font-bold py-2 px-4 rounded-md transition duration-300">
                        Ver Detalles
                      </span>
                      {manga.amazon_link && (
                        <a 
                          href={manga.amazon_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-blue-600 hover:bg-blue-500 text-white text-center text-sm font-bold py-2 px-4 rounded-md transition duration-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Comprar
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 bg-orange-600 text-white px-2 py-1 text-xs font-bold">
                    {new Date(manga.fecha_publicacion).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewReleases;
