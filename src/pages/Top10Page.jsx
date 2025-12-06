// src/pages/Top10Page.jsx - Beatport Style Top 10
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { musicAPI, getImageUrl } from '../services/api';
import './Top10Page.css';

const Top10Page = () => {
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('afrohouse');
  const [top10Tracks, setTop10Tracks] = useState([]);
  const [allGenresData, setAllGenresData] = useState({});

  const genres = [
    { value: 'afrohouse', label: 'Afro House', emoji: '🦁' },
    { value: 'indiedance', label: 'Indie Dance', emoji: '🎨' },
    { value: 'organichouse', label: 'Organic House', emoji: '🌿' },
    { value: 'downtempo', label: 'Down Tempo', emoji: '🌙' },
    { value: 'melodichouse', label: 'Melodic House', emoji: '🎵' }
  ];

  useEffect(() => {
    document.title = 'Top 10 - DJ App World';
    loadTop10Data();
  }, []);

  useEffect(() => {
    if (allGenresData[selectedGenre]) {
      setTop10Tracks(allGenresData[selectedGenre]);
    }
  }, [selectedGenre, allGenresData]);

  const loadTop10Data = async () => {
    try {
      setLoading(true);

      // Tüm genre'ler için top 10'u çek
      const response = await fetch('http://localhost:5000/api/music/top10');
      const result = await response.json();

      console.log('Top 10 response:', result);

      if (result.success && result.data?.top10) {
        setAllGenresData(result.data.top10);
        
        // İlk genre'nin verilerini set et
        if (result.data.top10[selectedGenre]) {
          setTop10Tracks(result.data.top10[selectedGenre]);
        }
      }

    } catch (err) {
      console.error('Top 10 load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading Top 10...</p>
      </div>
    );
  }

  const currentGenre = genres.find(g => g.value === selectedGenre);

  return (
    <div className="top10-page">
      {/* Header */}
      <section className="top10-header-section">
        <div className="container">
          <div className="top10-title-area">
            <h1>
              <span className="top10-icon">🏆</span>
              Top 10 Tracks
            </h1>
            <p>Most liked tracks by genre</p>
          </div>
        </div>
      </section>

      {/* Genre Selector */}
      <section className="top10-genre-selector">
        <div className="container">
          <div className="genre-tabs">
            {genres.map((genre) => (
              <button
                key={genre.value}
                className={`genre-tab ${selectedGenre === genre.value ? 'active' : ''}`}
                onClick={() => handleGenreChange(genre.value)}
              >
                <span className="genre-tab-emoji">{genre.emoji}</span>
                <span className="genre-tab-label">{genre.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Top 10 List */}
      <section className="top10-list-section">
        <div className="container">
          {top10Tracks.length > 0 ? (
            <div className="top10-list">
              {top10Tracks.map((track, index) => (
                <Link
                  key={track._id}
                  to={`/track/${track._id}`}
                  className="top10-item"
                >
                  <div className="top10-rank">
                    <span className={`rank-number ${index < 3 ? 'top-three' : ''}`}>
                      {index + 1}
                    </span>
                  </div>

                  <div className="top10-image">
                    <img
                      src={getImageUrl(track.imageUrl)}
                      alt={track.title}
                      onError={(e) => { e.target.src = '/default-music.jpg'; }}
                    />
                    <div className="top10-image-overlay">
                      <button className="top10-play-btn">▶</button>
                    </div>
                  </div>

                  <div className="top10-info">
                    <h3 className="top10-track-title">{track.title}</h3>
                    <p className="top10-track-artist">
                      {track.artist || track.artistNames || 'Unknown Artist'}
                    </p>
                  </div>

                  <div className="top10-stats">
                    <div className="stat-item">
                      <span className="stat-icon">❤️</span>
                      <span className="stat-value">{track.likes || 0}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">👁️</span>
                      <span className="stat-value">{track.views || 0}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🎵</div>
              <h3>No tracks found</h3>
              <p>No top tracks available for {currentGenre?.label}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Top10Page;