import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.tsx';
import Banner from './components/Banner/Banner.tsx';
import HomeCarousels from './components/MangaCarousel/HomeCarousels.tsx';
import MangaDetail from './components/MangaDetail/MangaDetail.tsx';
import Author from './components/Author/Author.tsx';
import NewReleases from './components/NewReleases/NewReleases.tsx';
import Search from './components/Search/Search.tsx';
import AllMangas from './components/AllMangas/AllMangas.tsx';
import './components/custom-styles.css';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <Banner />
              <HomeCarousels />
            </>
          } />
          <Route path="/manga/:id" element={<MangaDetail />} />
          <Route path="/autor/:authorName" element={<Author />} />
          <Route path="/novedades" element={<NewReleases />} />
          <Route path="/buscar" element={<Search />} />
          <Route path="/todos-los-mangas" element={<AllMangas />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
