// src/pages/HotPage.jsx - COMPLETE & UPDATED
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hotAPI, getImageUrl } from '../services/api';
import './HotPage.css';

const HotPage = () => {
  const [loading, setLoading] = useState(true);
  const [hotPlaylists, setHotPlaylists] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'HOT - DJ App World';
    loadHotPlaylists();
  }, []);

  const loadHotPlaylists = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await hotAPI.getHotPlaylists();
      
      if (response.data.success) {
        setHotPlaylists(response.data.hotPlaylists || []);
      }
    } catch (err) {
      console.error('Hot playlists load error:', err);
      setError('HOT playlist\'ler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Genre bilgileri
  const genreInfo = {
    afrohouse: { title: 'Afro House', emoji: '🦁' },
    indiedance: { title: 'Indie Dance', emoji: '🎨' },
    organichouse: { title: 'Organic House', emoji: '🌿' },
    downtempo: { title: 'Down Tempo', emoji: '🌙' },
    melodichouse: { title: 'Melodic House', emoji: '🎵' }
  };

  // Music Card Component
  const MusicCard = ({ music, featured = false }) => (
    <div className={`music-card ${featured ? 'featured' : ''}`}>
      <Link to={`/track/${music._id}`} className="music-card-link">
        <div className="music-card-image">
          <img 
            src={getImageUrl(music.imageUrl)} 
            alt={music.title}
            onError={(e) => e.target.src = '/default-music.jpg'}
          />
          <div className="music-card-overlay">
            <button className="play-button">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
          {featured && <span className="music-badge">HOT</span>}
        </div>
        <div className="music-card-content">
          <h3 className="music-title">{music.title}</h3>
          <p className="music-artist">{music.artist}</p>
        </div>
      </Link>
    </div>
  );

  // Playlist Card Component
  const PlaylistCard = ({ playlist }) => (
    <div className="playlist-card">
      <Link to={`/playlist/${playlist._id}`} className="playlist-card-link">
        <div className="playlist-card-image">
          <img 
            src={getImageUrl(playlist.coverImage)} 
            alt={playlist.name}
            onError={(e) => e.target.src = '/default-playlist.jpg'}
          />
          <div className="playlist-card-overlay">
            <button className="play-button">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
          <span className="genre-badge">{playlist.genreDisplayName}</span>
        </div>
        <div className="playlist-card-content">
          <h3 className="playlist-title">{playlist.name}</h3>
          <p className="playlist-description">{playlist.musicCount} songs</p>
        </div>
      </Link>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading HOT playlists...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container section">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={loadHotPlaylists} className="btn btn-primary">
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="hot-page">
      {/* Kompakt Başlık */}
      <div className="container">
        <div className="hot-page-header">
          <h1>
            <span className="hot-emoji">🔥</span>
            HOT Playlists
          </h1>
        </div>

        {/* Genre Sections */}
        {hotPlaylists.map((genreData) => {
          const info = genreInfo[genreData.genre];
          
          if (genreData.isEmpty) return null;

          return (
            <section key={genreData.genre} className="section">
              <div className="section-header">
                <div className="section-title-wrapper">
                  <span className="genre-emoji">{info?.emoji}</span>
                  <h2 className="section-title">
                    {genreData.genreDisplayName || info?.title}
                  </h2>
                </div>
                <Link to={`/genre/${genreData.genre}`} className="view-all-btn">
                  View All →
                </Link>
              </div>

              <div className="cards-grid">
                <PlaylistCard playlist={genreData} />

                {genreData.musics && genreData.musics.slice(0, 7).map((music) => (
                  <MusicCard key={music._id} music={music} featured />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Empty State */}
      {hotPlaylists.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔥</div>
          <h3>No HOT playlists yet</h3>
          <p>Check back soon for the hottest tracks!</p>
        </div>
      )}
    </div>
  );
};

export default HotPage;