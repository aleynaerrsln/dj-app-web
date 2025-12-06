// src/pages/ExplorePage.jsx - Browse All Music
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { musicAPI, getImageUrl } from '../services/api';
import './ExplorePage.css';

const ExplorePage = () => {
  const [loading, setLoading] = useState(true);
  const [musics, setMusics] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const genres = [
    { value: 'all', label: 'All Genres', emoji: '🎵' },
    { value: 'afrohouse', label: 'Afro House', emoji: '🦁' },
    { value: 'indiedance', label: 'Indie Dance', emoji: '🎨' },
    { value: 'organichouse', label: 'Organic House', emoji: '🌿' },
    { value: 'downtempo', label: 'Down Tempo', emoji: '🌙' },
    { value: 'melodichouse', label: 'Melodic House', emoji: '🎵' }
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Newest', order: 'desc' },
    { value: 'likes', label: 'Most Liked', order: 'desc' },
    { value: 'views', label: 'Most Viewed', order: 'desc' },
    { value: 'title', label: 'A-Z', order: 'asc' }
  ];

  useEffect(() => {
    document.title = 'Explore - DJ App World';
    loadMusic(true);
  }, [selectedGenre, sortBy]);

  const loadMusic = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setPage(1);
      }

      const currentPage = reset ? 1 : page;
      const currentSort = sortOptions.find(s => s.value === sortBy);

      const params = {
        page: currentPage,
        limit: 20,
        genre: selectedGenre === 'all' ? undefined : selectedGenre,
        sortBy: sortBy,
        sortOrder: currentSort?.order || 'desc'
      };

      console.log('🔍 Loading music with params:', params);

      const response = await musicAPI.getAllMusic(params);
      console.log('✅ Explore response:', response.data);

      if (response.data?.success) {
        const newMusics = response.data.data?.musics || [];
        const pagination = response.data.data?.pagination || {};

        if (reset) {
          setMusics(newMusics);
        } else {
          setMusics(prev => [...prev, ...newMusics]);
        }

        setTotalCount(pagination.total || 0);
        setHasMore(pagination.current < pagination.pages);
        
        if (!reset) {
          setPage(prev => prev + 1);
        }
      }

    } catch (err) {
      console.error('❌ Explore load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadMusic(false);
    }
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  const currentGenre = genres.find(g => g.value === selectedGenre);
  const currentSortOption = sortOptions.find(s => s.value === sortBy);

  return (
    <div className="explore-page">
      {/* Header */}
      <section className="explore-header">
        <div className="container">
          <div className="explore-title-area">
            <h1>
              <span className="explore-icon">🔍</span>
              Explore Music
            </h1>
            <p>{totalCount > 0 ? `${totalCount} tracks available` : 'Browse all tracks'}</p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="explore-filters">
        <div className="container">
          <div className="filters-row">
            {/* Genre Filter */}
            <div className="filter-group">
              <label className="filter-label">Genre</label>
              <div className="filter-buttons">
                {genres.map((genre) => (
                  <button
                    key={genre.value}
                    className={`filter-btn ${selectedGenre === genre.value ? 'active' : ''}`}
                    onClick={() => handleGenreChange(genre.value)}
                  >
                    <span className="filter-btn-emoji">{genre.emoji}</span>
                    <span>{genre.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Filter */}
            <div className="filter-group">
              <label className="filter-label">Sort By</label>
              <div className="filter-buttons">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`filter-btn ${sortBy === option.value ? 'active' : ''}`}
                    onClick={() => handleSortChange(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Music Grid */}
      <section className="explore-content">
        <div className="container">
          {loading && page === 1 ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading tracks...</p>
            </div>
          ) : musics.length > 0 ? (
            <>
              <div className="music-grid">
                {musics.map((track) => (
                  <Link
                    key={track._id}
                    to={`/track/${track._id}`}
                    className="music-card"
                  >
                    <div className="music-card-image">
                      <img
                        src={getImageUrl(track.imageUrl)}
                        alt={track.title}
                        onError={(e) => { e.target.src = '/default-music.jpg'; }}
                      />
                      <div className="music-card-overlay">
                        <button className="music-card-play-btn">▶</button>
                      </div>
                      {track.isFeatured && (
                        <span className="music-card-badge">Featured</span>
                      )}
                    </div>
                    <div className="music-card-info">
                      <h3 className="music-card-title">{track.title}</h3>
                      <p className="music-card-artist">
                        {track.artist || track.artistNames || 'Unknown Artist'}
                      </p>
                      <div className="music-card-stats">
                        <span className="stat">
                          <span className="stat-icon">❤️</span>
                          {track.likes || 0}
                        </span>
                        <span className="stat">
                          <span className="stat-icon">👁️</span>
                          {track.views || 0}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="load-more-section">
                  <button
                    className="load-more-btn"
                    onClick={handleLoadMore}
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🎵</div>
              <h3>No tracks found</h3>
              <p>Try changing your filters</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ExplorePage;