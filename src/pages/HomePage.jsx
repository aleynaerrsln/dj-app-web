// src/pages/HomePage.jsx - SIMPLIFIED WITH BACKEND FIX
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hotAPI, musicAPI, getImageUrl } from '../services/api';
import './HomePage.css';

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [featuredTracks, setFeaturedTracks] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [djCharts, setDjCharts] = useState([]);
  const [currentDjChart, setCurrentDjChart] = useState(0);
  const [hotPlaylists, setHotPlaylists] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [top10Tracks, setTop10Tracks] = useState([]);

  useEffect(() => {
    document.title = 'Home - DJ App World';
    loadHomeData();
  }, []);

  // Auto slider for featured
  useEffect(() => {
    if (featuredTracks.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredTracks.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredTracks.length]);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      console.log('🚀 Loading home data...');

      // Featured Tracks
      try {
        console.log('📡 Fetching featured tracks...');
        const res = await musicAPI.getFeaturedMusic(3);
        console.log('✅ Featured response:', res.data);
        
        const tracks = res.data.music || res.data.musics || [];
        console.log('📦 Featured tracks count:', tracks.length);
        
        if (Array.isArray(tracks) && tracks.length > 0) {
          setFeaturedTracks(tracks);
        }
      } catch (err) {
        console.error('❌ Featured error:', err);
      }

      // DJ Charts
      try {
        console.log('📡 Fetching DJ charts...');
        const res = await musicAPI.getPopularMusic(6);
        console.log('✅ DJ Charts response:', res.data);
        
        const tracks = res.data.music || res.data.musics || [];
        console.log('📦 DJ Charts count:', tracks.length);
        
        if (Array.isArray(tracks) && tracks.length > 0) {
          setDjCharts(tracks);
        }
      } catch (err) {
        console.error('❌ DJ Charts error:', err);
      }

      // HOT Playlists
      try {
        console.log('📡 Fetching HOT playlists...');
        const res = await hotAPI.getHotPlaylists();
        console.log('✅ HOT response:', res.data);
        
        if (res.data?.success) {
          const playlists = res.data.hotPlaylists || [];
          console.log('📦 HOT playlists count:', playlists.length);
          setHotPlaylists(playlists);
        }
      } catch (err) {
        console.error('❌ HOT error:', err);
      }

      // Recommendations
      try {
        console.log('📡 Fetching recommendations...');
        const res = await musicAPI.getNewReleases(8);
        console.log('✅ Recommendations response:', res.data);
        
        const tracks = res.data.music || res.data.musics || [];
        console.log('📦 Recommendations count:', tracks.length);
        setRecommendations(Array.isArray(tracks) ? tracks : []);
      } catch (err) {
        console.error('❌ Recommendations error:', err);
      }

      // Top 10
      try {
        console.log('📡 Fetching Top 10...');
        const res = await musicAPI.getNewReleases(10);
        console.log('✅ Top 10 response:', res.data);
        
        const tracks = res.data.music || res.data.musics || [];
        console.log('📦 Top 10 count:', tracks.length);
        setTop10Tracks(Array.isArray(tracks) ? tracks : []);
      } catch (err) {
        console.error('❌ Top 10 error:', err);
      }

      console.log('✅ All data loaded!');

    } catch (err) {
      console.error('❌ General load error:', err);
    } finally {
      setLoading(false);
    }
  };

  // DJ Charts Navigation
  const nextDjChart = () => {
    const maxIndex = Math.max(0, djCharts.length - 3);
    setCurrentDjChart((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevDjChart = () => {
    setCurrentDjChart((prev) => Math.max(prev - 1, 0));
  };

  if (loading) {
    return (
      <div className="home-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  const currentFeatured = featuredTracks[currentSlide];
  const visibleDjCharts = djCharts.slice(currentDjChart, currentDjChart + 3);

  return (
    <div className="home-beatport-layout">
      {/* Left Sidebar */}
      <aside className="home-left-sidebar">
        <Link to="/favorites" className="sidebar-link-item">
          <span className="sidebar-icon-item">❤️</span>
          <span>My Beatport</span>
        </Link>
        <Link to="/playlists" className="sidebar-link-item">
          <span className="sidebar-icon-item">📁</span>
          <span>Collection</span>
        </Link>
        <Link to="/history" className="sidebar-link-item">
          <span className="sidebar-icon-item">⬇️</span>
          <span>Downloads</span>
        </Link>
        <Link to="/playlists" className="sidebar-link-item">
          <span className="sidebar-icon-item">▶️</span>
          <span>Playlists</span>
        </Link>
        <div className="sidebar-line"></div>
        <button className="sidebar-create-btn">
          <span className="sidebar-icon-item">+</span>
          <span>Create Playlist</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="home-main-content">
        {/* Hero Container - Featured + DJ Charts */}
        <div className="home-hero-container">
          {/* Featured Slider - LEFT */}
          {currentFeatured ? (
            <section className="home-featured-section">
              <div className="featured-slider-wrapper">
                <div className="featured-image-container">
                  <img 
                    src={getImageUrl(currentFeatured.imageUrl)} 
                    alt={currentFeatured.title}
                    onError={(e) => { e.target.src = '/default-music.jpg'; }}
                  />
                  <div className="featured-text-overlay">
                    <h2>New on Beatport</h2>
                  </div>
                </div>
                {featuredTracks.length > 1 && (
                  <div className="featured-dots">
                    {featuredTracks.map((track, idx) => (
                      <button
                        key={track._id || `dot-${idx}`}
                        className={`featured-dot ${idx === currentSlide ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(idx)}
                      ></button>
                    ))}
                  </div>
                )}
              </div>
            </section>
          ) : (
            <section className="home-featured-section">
              <div className="featured-slider-wrapper">
                <div className="featured-image-container" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="featured-text-overlay">
                    <h2>Loading...</h2>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* DJ Charts - RIGHT */}
          {djCharts.length > 0 ? (
            <section className="dj-charts-section">
              <div className="dj-charts-header">
                <h3>DJ Charts</h3>
                <div className="dj-charts-nav">
                  <button 
                    onClick={prevDjChart} 
                    className="dj-nav-btn"
                    disabled={currentDjChart === 0}
                  >
                    ◀
                  </button>
                  <button 
                    onClick={nextDjChart} 
                    className="dj-nav-btn"
                    disabled={currentDjChart >= djCharts.length - 3}
                  >
                    ▶
                  </button>
                </div>
              </div>
              <div className="dj-charts-grid">
                {visibleDjCharts.map((track) => (
                  <Link 
                    key={track._id}
                    to={`/track/${track._id}`}
                    className="dj-chart-card"
                  >
                    <div className="dj-chart-image">
                      <img 
                        src={getImageUrl(track.imageUrl)} 
                        alt={track.artist || track.artistNames}
                        onError={(e) => { e.target.src = '/default-music.jpg'; }}
                      />
                    </div>
                    <div className="dj-chart-name">{track.artist || track.artistNames || 'Unknown'}</div>
                  </Link>
                ))}
              </div>
            </section>
          ) : (
            <section className="dj-charts-section">
              <div className="dj-charts-header">
                <h3>DJ Charts</h3>
              </div>
              <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                Loading...
              </div>
            </section>
          )}
        </div>

        {/* HOT Playlists */}
        {hotPlaylists.length > 0 && (
          <section className="home-content-section">
            <div className="home-section-header">
              <h3>🔥 HOT Playlists</h3>
              <Link to="/hot" className="home-view-all">View all</Link>
            </div>
            <div className="home-playlists-grid">
              {hotPlaylists.slice(0, 6).map((playlist) => (
                <div key={playlist._id} className="home-playlist-card">
                  <Link to={`/playlist/${playlist._id}`}>
                    <div className="home-playlist-img">
                      <img 
                        src={getImageUrl(playlist.coverImage)} 
                        alt={playlist.name}
                        onError={(e) => { e.target.src = '/default-playlist.jpg'; }}
                      />
                      <div className="home-playlist-overlay">
                        <button className="home-play-btn">▶</button>
                      </div>
                    </div>
                    <div className="home-playlist-text">
                      <h4>{playlist.name}</h4>
                      <p>{playlist.musicCount} tracks</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section className="home-content-section">
            <div className="home-section-header">
              <h3>Recommendations</h3>
              <Link to="/explore" className="home-view-all">View all</Link>
            </div>
            <div className="home-recommendations-grid">
              {recommendations.map((track) => (
                <div key={track._id} className="home-track-card">
                  <Link to={`/track/${track._id}`}>
                    <div className="home-track-img">
                      <img 
                        src={getImageUrl(track.imageUrl)} 
                        alt={track.title}
                        onError={(e) => { e.target.src = '/default-music.jpg'; }}
                      />
                      <div className="home-track-overlay">
                        <button className="home-track-play">▶</button>
                      </div>
                    </div>
                    <div className="home-track-text">
                      <h4>{track.title}</h4>
                      <p>{track.artist || track.artistNames}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Right Sidebar - Top 10 */}
      <aside className="home-right-sidebar">
        <div className="top10-header-section">
          <button className="top10-nav-button">◀</button>
          <h3 className="top10-title">
            <span className="top10-play-icon">▶</span>
            <span className="top10-beatport">Beatport</span>
            <span className="top10-top10">Top10</span>
          </h3>
          <button className="top10-nav-button">▶</button>
        </div>
        <div className="top10-tracks-list">
          {top10Tracks.length > 0 ? (
            top10Tracks.slice(0, 10).map((track, index) => (
              <Link 
                key={track._id}
                to={`/track/${track._id}`}
                className="top10-track-item"
              >
                <span className="top10-number">{index + 1}</span>
                <div className="top10-track-info">
                  <h4>{track.title}</h4>
                  <p>{track.artist || track.artistNames}</p>
                </div>
              </Link>
            ))
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
              Loading...
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default HomePage;
