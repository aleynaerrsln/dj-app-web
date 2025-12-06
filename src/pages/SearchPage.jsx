// src/pages/SearchPage.jsx - Advanced Search with Tabs
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { searchAPI, getImageUrl } from '../services/api';
import './SearchPage.css';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({
    musics: [],
    playlists: [],
    users: []
  });
  const [counts, setCounts] = useState({
    musics: 0,
    playlists: 0,
    users: 0,
    total: 0
  });

  useEffect(() => {
    document.title = 'Search - DJ App World';
    const queryFromUrl = searchParams.get('q');
    if (queryFromUrl) {
      setSearchQuery(queryFromUrl);
      performSearch(queryFromUrl, 'all');
    }
  }, []);

  const performSearch = async (query, type = 'all') => {
    if (!query || query.trim().length < 2) {
      setResults({ musics: [], playlists: [], users: [] });
      setCounts({ musics: 0, playlists: 0, users: 0, total: 0 });
      return;
    }

    try {
      setLoading(true);
      console.log(`🔍 Searching for: "${query}" (type: ${type})`);

      const response = await searchAPI.searchAll(query, type);
      console.log('✅ Search response:', response.data);

      if (response.data?.success) {
        setResults({
          musics: response.data.results?.musics || [],
          playlists: response.data.results?.playlists || [],
          users: response.data.results?.users || []
        });
        setCounts(response.data.counts || { musics: 0, playlists: 0, users: 0, total: 0 });
      }

    } catch (err) {
      console.error('❌ Search error:', err);
      setResults({ musics: [], playlists: [], users: [] });
      setCounts({ musics: 0, playlists: 0, users: 0, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      setSearchParams({ q: searchQuery });
      performSearch(searchQuery, activeTab);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (searchQuery.trim().length >= 2) {
      performSearch(searchQuery, tab);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="search-page">
      {/* Header with Search Bar */}
      <section className="search-header">
        <div className="container">
          <div className="search-header-content">
            <h1>
              <span className="search-icon">🔍</span>
              Search
            </h1>
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search tracks, artists, playlists..."
                  value={searchQuery}
                  onChange={handleInputChange}
                  autoFocus
                />
                <button type="submit" className="search-submit-btn">
                  🔍
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Tabs */}
      {searchQuery.trim().length >= 2 && (
        <section className="search-tabs">
          <div className="container">
            <div className="tabs-wrapper">
              <button
                className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => handleTabChange('all')}
              >
                All ({counts.total})
              </button>
              <button
                className={`tab-btn ${activeTab === 'musics' ? 'active' : ''}`}
                onClick={() => handleTabChange('musics')}
              >
                Tracks ({counts.musics})
              </button>
              <button
                className={`tab-btn ${activeTab === 'playlists' ? 'active' : ''}`}
                onClick={() => handleTabChange('playlists')}
              >
                Playlists ({counts.playlists})
              </button>
              <button
                className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => handleTabChange('users')}
              >
                Users ({counts.users})
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Results */}
      <section className="search-results">
        <div className="container">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Searching...</p>
            </div>
          ) : searchQuery.trim().length < 2 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>Start searching</h3>
              <p>Enter at least 2 characters to search</p>
            </div>
          ) : counts.total === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">😕</div>
              <h3>No results found</h3>
              <p>Try different keywords</p>
            </div>
          ) : (
            <>
              {/* Tracks Results */}
              {(activeTab === 'all' || activeTab === 'musics') && results.musics.length > 0 && (
                <div className="results-section">
                  <h2 className="results-section-title">
                    Tracks ({results.musics.length})
                  </h2>
                  <div className="tracks-grid">
                    {results.musics.map((track) => (
                      <Link
                        key={track._id}
                        to={`/track/${track._id}`}
                        className="track-card"
                      >
                        <div className="track-card-image">
                          <img
                            src={getImageUrl(track.imageUrl)}
                            alt={track.title}
                            onError={(e) => { e.target.src = '/default-music.jpg'; }}
                          />
                          <div className="track-card-overlay">
                            <button className="track-play-btn">▶</button>
                          </div>
                        </div>
                        <div className="track-card-info">
                          <h3 className="track-title">{track.title}</h3>
                          <p className="track-artist">{track.artist}</p>
                          <div className="track-stats">
                            <span>❤️ {track.likes}</span>
                            <span>👁️ {track.views}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Playlists Results */}
              {(activeTab === 'all' || activeTab === 'playlists') && results.playlists.length > 0 && (
                <div className="results-section">
                  <h2 className="results-section-title">
                    Playlists ({results.playlists.length})
                  </h2>
                  <div className="playlists-grid">
                    {results.playlists.map((playlist) => (
                      <Link
                        key={playlist._id}
                        to={`/playlist/${playlist._id}`}
                        className="playlist-card"
                      >
                        <div className="playlist-card-image">
                          <img
                            src={getImageUrl(playlist.coverImage)}
                            alt={playlist.name}
                            onError={(e) => { e.target.src = '/default-playlist.jpg'; }}
                          />
                          <div className="playlist-card-overlay">
                            <button className="playlist-play-btn">▶</button>
                          </div>
                        </div>
                        <div className="playlist-card-info">
                          <h3 className="playlist-name">{playlist.name}</h3>
                          <p className="playlist-owner">
                            {playlist.owner?.fullName || 'Unknown'}
                          </p>
                          <p className="playlist-count">{playlist.musicCount} tracks</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Users Results */}
              {(activeTab === 'all' || activeTab === 'users') && results.users.length > 0 && (
                <div className="results-section">
                  <h2 className="results-section-title">
                    Users ({results.users.length})
                  </h2>
                  <div className="users-list">
                    {results.users.map((user) => (
                      <Link
                        key={user._id}
                        to={`/profile/${user.username}`}
                        className="user-item"
                      >
                        <div className="user-avatar">
                          {user.profileImage ? (
                            <img
                              src={getImageUrl(user.profileImage)}
                              alt={user.fullName}
                              onError={(e) => { e.target.src = '/default-avatar.jpg'; }}
                            />
                          ) : (
                            <div className="user-avatar-placeholder">
                              {user.firstName?.charAt(0) || '?'}
                            </div>
                          )}
                        </div>
                        <div className="user-info">
                          <h3 className="user-name">{user.fullName}</h3>
                          <p className="user-username">@{user.username}</p>
                          {user.bio && <p className="user-bio">{user.bio}</p>}
                        </div>
                        <div className="user-stats">
                          <span>{user.followerCount} followers</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default SearchPage;