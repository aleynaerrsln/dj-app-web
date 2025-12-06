// src/pages/TrackDetailPage.jsx - Track Detail with Platform Links
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { musicAPI, getImageUrl } from '../services/api';
import './TrackDetailPage.css';

const TrackDetailPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [track, setTrack] = useState(null);
  const [similarTracks, setSimilarTracks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      loadTrack();
    }
  }, [id]);

  const loadTrack = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📡 Loading track:', id);

      const response = await musicAPI.getMusicById(id);
      console.log('✅ Track response:', response.data);

      if (response.data?.success) {
        const trackData = response.data.data?.music || response.data.music;
        setTrack(trackData);
        document.title = `${trackData.title} - ${trackData.artist || trackData.artistNames} - DJ App World`;

        // Load similar tracks (same genre)
        if (trackData.genre) {
          loadSimilarTracks(trackData.genre);
        }
      } else {
        setError('Track bulunamadı');
      }

    } catch (err) {
      console.error('❌ Track load error:', err);
      setError('Track yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const loadSimilarTracks = async (genre) => {
    try {
      const response = await musicAPI.getMusicByGenre(genre, { limit: 6 });
      if (response.data?.success) {
        const tracks = response.data.data?.musics || [];
        // Exclude current track
        setSimilarTracks(tracks.filter(t => t._id !== id).slice(0, 6));
      }
    } catch (err) {
      console.error('Similar tracks error:', err);
    }
  };

  const handlePlayClick = () => {
    // Increment play count
    musicAPI.incrementPlayCount(id).catch(err => console.error(err));
    // TODO: Add to player queue
    alert('Play functionality coming soon!');
  };

  const handleLikeClick = async () => {
    try {
      const response = await musicAPI.likeMusic(id);
      if (response.data?.success) {
        // Update local state
        setTrack(prev => ({
          ...prev,
          likes: response.data.data?.likes || prev.likes
        }));
      }
    } catch (err) {
      console.error('Like error:', err);
      alert('Please login to like tracks');
    }
  };

  if (loading) {
    return (
      <div className="track-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading track...</p>
      </div>
    );
  }

  if (error || !track) {
    return (
      <div className="track-detail-error">
        <div className="error-icon">😕</div>
        <h2>{error || 'Track bulunamadı'}</h2>
        <Link to="/explore" className="back-link">← Back to Explore</Link>
      </div>
    );
  }

  const platformLinks = track.platformLinks || {};
  const hasLinks = Object.values(platformLinks).some(link => link);

  return (
    <div className="track-detail-page">
      {/* Hero Section */}
      <section className="track-hero">
        <div className="track-hero-bg">
          <img 
            src={getImageUrl(track.imageUrl)} 
            alt={track.title}
            onError={(e) => { e.target.src = '/default-music.jpg'; }}
          />
          <div className="track-hero-overlay"></div>
        </div>
        
        <div className="container">
          <div className="track-hero-content">
            <div className="track-cover">
              <img 
                src={getImageUrl(track.imageUrl)} 
                alt={track.title}
                onError={(e) => { e.target.src = '/default-music.jpg'; }}
              />
              {track.isFeatured && (
                <div className="track-featured-badge">⭐ Featured</div>
              )}
            </div>

            <div className="track-info">
              <div className="track-type-badge">🎵 Track</div>
              <h1 className="track-title">{track.title}</h1>
              <p className="track-artist">
                {track.artist || track.artistNames || 'Unknown Artist'}
              </p>

              <div className="track-meta">
                {track.genre && (
                  <span className="track-meta-item">
                    <span className="meta-icon">🎭</span>
                    {track.genre}
                  </span>
                )}
                <span className="track-meta-item">
                  <span className="meta-icon">❤️</span>
                  {track.likes || 0} likes
                </span>
                <span className="track-meta-item">
                  <span className="meta-icon">👁️</span>
                  {track.views || 0} views
                </span>
              </div>

              <div className="track-actions">
                <button className="btn-play-track" onClick={handlePlayClick}>
                  <span className="btn-icon">▶</span>
                  Play
                </button>
                <button className="btn-like-track" onClick={handleLikeClick}>
                  <span className="btn-icon">❤️</span>
                  Like
                </button>
                <button className="btn-add-track">
                  <span className="btn-icon">➕</span>
                  Add to Playlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Links */}
      {hasLinks && (
        <section className="platform-links-section">
          <div className="container">
            <h2 className="section-title">🎧 Listen On</h2>
            <div className="platform-links-grid">
              {platformLinks.spotify && (
                <a 
                  href={platformLinks.spotify} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="platform-link spotify"
                >
                  <span className="platform-icon">🎵</span>
                  <span className="platform-name">Spotify</span>
                </a>
              )}
              {platformLinks.appleMusic && (
                <a 
                  href={platformLinks.appleMusic} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="platform-link apple"
                >
                  <span className="platform-icon">🍎</span>
                  <span className="platform-name">Apple Music</span>
                </a>
              )}
              {platformLinks.youtubeMusic && (
                <a 
                  href={platformLinks.youtubeMusic} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="platform-link youtube"
                >
                  <span className="platform-icon">▶️</span>
                  <span className="platform-name">YouTube Music</span>
                </a>
              )}
              {platformLinks.beatport && (
                <a 
                  href={platformLinks.beatport} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="platform-link beatport"
                >
                  <span className="platform-icon">🎚️</span>
                  <span className="platform-name">Beatport</span>
                </a>
              )}
              {platformLinks.soundcloud && (
                <a 
                  href={platformLinks.soundcloud} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="platform-link soundcloud"
                >
                  <span className="platform-icon">☁️</span>
                  <span className="platform-name">SoundCloud</span>
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Similar Tracks */}
      {similarTracks.length > 0 && (
        <section className="similar-tracks-section">
          <div className="container">
            <h2 className="section-title">Similar Tracks</h2>
            <div className="similar-tracks-grid">
              {similarTracks.map((similarTrack) => (
                <Link
                  key={similarTrack._id}
                  to={`/track/${similarTrack._id}`}
                  className="similar-track-card"
                >
                  <div className="similar-track-image">
                    <img 
                      src={getImageUrl(similarTrack.imageUrl)} 
                      alt={similarTrack.title}
                      onError={(e) => { e.target.src = '/default-music.jpg'; }}
                    />
                    <div className="similar-track-overlay">
                      <button className="similar-track-play">▶</button>
                    </div>
                  </div>
                  <div className="similar-track-info">
                    <h3>{similarTrack.title}</h3>
                    <p>{similarTrack.artist || similarTrack.artistNames}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default TrackDetailPage;