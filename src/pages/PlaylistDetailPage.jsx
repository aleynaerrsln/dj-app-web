// src/pages/PlaylistDetailPage.jsx - Playlist Detail with Tracks
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { playlistAPI, getImageUrl } from '../services/api';
import './PlaylistDetailPage.css';

const PlaylistDetailPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [playlist, setPlaylist] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      loadPlaylist();
    }
  }, [id]);

  const loadPlaylist = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📡 Loading playlist:', id);

      const response = await playlistAPI.getPlaylistById(id);
      console.log('✅ Playlist response:', response.data);

      if (response.data?.success) {
        const playlistData = response.data.data?.playlist || response.data.playlist;
        setPlaylist(playlistData);
        document.title = `${playlistData.name} - DJ App World`;
      } else {
        setError('Playlist bulunamadı');
      }

    } catch (err) {
      console.error('❌ Playlist load error:', err);
      setError('Playlist yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="playlist-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading playlist...</p>
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="playlist-detail-error">
        <div className="error-icon">😕</div>
        <h2>{error || 'Playlist bulunamadı'}</h2>
        <Link to="/hot" className="back-link">← Back to HOT Playlists</Link>
      </div>
    );
  }

  const tracks = playlist.musics || [];
  const owner = playlist.userId || playlist.owner;

  return (
    <div className="playlist-detail-page">
      {/* Hero Section */}
      <section className="playlist-hero">
        <div className="playlist-hero-bg">
          <img 
            src={getImageUrl(playlist.coverImage)} 
            alt={playlist.name}
            onError={(e) => { e.target.src = '/default-playlist.jpg'; }}
          />
          <div className="playlist-hero-overlay"></div>
        </div>
        
        <div className="container">
          <div className="playlist-hero-content">
            <div className="playlist-cover">
              <img 
                src={getImageUrl(playlist.coverImage)} 
                alt={playlist.name}
                onError={(e) => { e.target.src = '/default-playlist.jpg'; }}
              />
            </div>

            <div className="playlist-info">
              <div className="playlist-type-badge">
                {playlist.isAdminPlaylist ? '🔥 HOT Playlist' : '📁 Playlist'}
              </div>
              <h1 className="playlist-title">{playlist.name}</h1>
              
              {playlist.description && (
                <p className="playlist-description">{playlist.description}</p>
              )}

              <div className="playlist-meta">
                <span className="playlist-meta-item">
                  <span className="meta-icon">👤</span>
                  {owner?.fullName || owner?.username || 'Admin'}
                </span>
                <span className="playlist-meta-item">
                  <span className="meta-icon">🎵</span>
                  {tracks.length} tracks
                </span>
                {playlist.genre && (
                  <span className="playlist-meta-item">
                    <span className="meta-icon">🎭</span>
                    {playlist.genre}
                  </span>
                )}
                {playlist.likes > 0 && (
                  <span className="playlist-meta-item">
                    <span className="meta-icon">❤️</span>
                    {playlist.likes}
                  </span>
                )}
              </div>

              <div className="playlist-actions">
                <button className="btn-play-all">
                  <span className="btn-icon">▶</span>
                  Play All
                </button>
                <button className="btn-like">
                  <span className="btn-icon">❤️</span>
                  Like
                </button>
                <button className="btn-share">
                  <span className="btn-icon">🔗</span>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tracks List */}
      <section className="playlist-tracks-section">
        <div className="container">
          {tracks.length > 0 ? (
            <div className="tracks-list">
              <div className="tracks-list-header">
                <div className="track-header-number">#</div>
                <div className="track-header-title">Title</div>
                <div className="track-header-artist">Artist</div>
                <div className="track-header-stats">Stats</div>
                <div className="track-header-actions">Actions</div>
              </div>

              {tracks.map((track, index) => (
                <div key={track._id || index} className="track-item">
                  <div className="track-number">
                    <span className="track-number-text">{index + 1}</span>
                    <button className="track-play-btn-small">▶</button>
                  </div>

                  <div className="track-title-area">
                    <div className="track-image-small">
                      <img 
                        src={getImageUrl(track.imageUrl)} 
                        alt={track.title}
                        onError={(e) => { e.target.src = '/default-music.jpg'; }}
                      />
                    </div>
                    <Link to={`/track/${track._id}`} className="track-title-link">
                      {track.title}
                    </Link>
                  </div>

                  <div className="track-artist-area">
                    <span className="track-artist-name">
                      {track.artist || track.artistNames || 'Unknown Artist'}
                    </span>
                  </div>

                  <div className="track-stats-area">
                    <span className="track-stat">
                      <span className="stat-icon-small">❤️</span>
                      {track.likes || 0}
                    </span>
                    <span className="track-stat">
                      <span className="stat-icon-small">👁️</span>
                      {track.views || 0}
                    </span>
                  </div>

                  <div className="track-actions-area">
                    <button className="track-action-btn" title="Add to playlist">
                      ➕
                    </button>
                    <button className="track-action-btn" title="More options">
                      ⋯
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-tracks">
              <div className="empty-tracks-icon">🎵</div>
              <h3>No tracks in this playlist</h3>
              <p>This playlist is empty</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PlaylistDetailPage;