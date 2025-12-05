// src/components/Navbar/Navbar.jsx - Modern Responsive Navbar (Beatport inspired)
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { searchAPI, getImageUrl } from '../../services/api';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Refs
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Scroll event - navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search functionality with debounce
  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchResults(null);
      setShowSearchDropdown(false);
      return;
    }

    // Debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await searchAPI.searchAll(query);
        if (response.data.success) {
          setSearchResults(response.data.results);
          setShowSearchDropdown(true);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchDropdown(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
          <span className="logo-text">DJ App World</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-menu desktop-menu">
          <Link 
            to="/" 
            className={`nav-link ${isActiveRoute('/') ? 'active' : ''}`}
          >
            Home
          </Link>
            <Link 
    to="/hot" 
    className={`nav-link ${isActiveRoute('/hot') ? 'active' : ''}`}
  >
    🔥 HOT
  </Link>
          <Link 
            to="/top10" 
            className={`nav-link ${isActiveRoute('/top10') ? 'active' : ''}`}
          >
            Top 10
          </Link>
          
          <Link 
            to="/explore" 
            className={`nav-link ${isActiveRoute('/explore') ? 'active' : ''}`}
          >
            Explore
          </Link>
        </div>

        {/* Search Bar */}
        <div className="navbar-search" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="search-input-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search artists, tracks, playlists..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchResults && setShowSearchDropdown(true)}
              />
              {isSearching && (
                <div className="search-loading">
                  <div className="spinner"></div>
                </div>
              )}
            </div>
          </form>

          {/* Search Dropdown Results */}
          {showSearchDropdown && searchResults && (
            <div className="search-dropdown">
              {/* Users */}
              {searchResults.users && searchResults.users.length > 0 && (
                <div className="search-section">
                  <div className="search-section-title">Artists & Users</div>
                  {searchResults.users.map((user) => (
                    <Link
                      key={user._id}
                      to={`/profile/${user._id}`}
                      className="search-item"
                      onClick={() => {
                        setShowSearchDropdown(false);
                        setSearchQuery('');
                      }}
                    >
                      <div className="search-item-image">
                        {user.profileImage ? (
                          <img src={getImageUrl(user.profileImage)} alt={user.username} />
                        ) : (
                          <div className="avatar-placeholder">
                            {user.firstName?.[0] || user.username?.[0]}
                          </div>
                        )}
                      </div>
                      <div className="search-item-info">
                        <div className="search-item-title">{user.fullName || user.username}</div>
                        <div className="search-item-subtitle">@{user.username}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Musics */}
              {searchResults.musics && searchResults.musics.length > 0 && (
                <div className="search-section">
                  <div className="search-section-title">Tracks</div>
                  {searchResults.musics.map((music) => (
                    <Link
                      key={music._id}
                      to={`/track/${music._id}`}
                      className="search-item"
                      onClick={() => {
                        setShowSearchDropdown(false);
                        setSearchQuery('');
                      }}
                    >
                      <div className="search-item-image">
                        <img src={music.imageUrl} alt={music.title} />
                      </div>
                      <div className="search-item-info">
                        <div className="search-item-title">{music.title}</div>
                        <div className="search-item-subtitle">{music.artist}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Playlists */}
              {searchResults.playlists && searchResults.playlists.length > 0 && (
                <div className="search-section">
                  <div className="search-section-title">Playlists</div>
                  {searchResults.playlists.map((playlist) => (
                    <Link
                      key={playlist._id}
                      to={`/playlist/${playlist._id}`}
                      className="search-item"
                      onClick={() => {
                        setShowSearchDropdown(false);
                        setSearchQuery('');
                      }}
                    >
                      <div className="search-item-image">
                        {playlist.coverImage ? (
                          <img src={playlist.coverImage} alt={playlist.name} />
                        ) : (
                          <div className="playlist-placeholder">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="search-item-info">
                        <div className="search-item-title">{playlist.name}</div>
                        <div className="search-item-subtitle">{playlist.musicCount} tracks</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* No Results */}
              {(!searchResults.users?.length && !searchResults.musics?.length && !searchResults.playlists?.length) && (
                <div className="search-no-results">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                  <p>No results found</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="navbar-user" ref={userMenuRef}>
              <button 
                className="user-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                {user?.profileImage ? (
                  <img 
                    src={getImageUrl(user.profileImage)} 
                    alt={user.username}
                    className="user-avatar"
                  />
                ) : (
                  <div className="user-avatar-placeholder">
                    {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                  </div>
                )}
                <svg className="chevron-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <div className="user-dropdown-name">{user?.fullName || user?.username}</div>
                    <div className="user-dropdown-email">{user?.email}</div>
                  </div>
                  
                  <div className="user-dropdown-divider"></div>
                  
                  <Link 
                    to={`/profile/${user?.id}`} 
                    className="user-dropdown-item"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    Profile
                  </Link>
                  
                  <Link 
                    to="/playlists" 
                    className="user-dropdown-item"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>
                    </svg>
                    My Playlists
                  </Link>
                  
                  <Link 
                    to="/settings" 
                    className="user-dropdown-item"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                    </svg>
                    Settings
                  </Link>
                  
                  <div className="user-dropdown-divider"></div>
                  
                  <button 
                    className="user-dropdown-item logout-button"
                    onClick={handleLogout}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-button">
              Sign In
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              {showMobileMenu ? (
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              ) : (
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="mobile-menu">
          <Link 
            to="/" 
            className={`mobile-nav-link ${isActiveRoute('/') ? 'active' : ''}`}
            onClick={() => setShowMobileMenu(false)}
          >
            Home
          </Link>
              <Link 
      to="/hot" 
      className={`mobile-nav-link ${isActiveRoute('/hot') ? 'active' : ''}`}
      onClick={() => setShowMobileMenu(false)}
    >
      🔥 HOT
    </Link>
          <Link 
            to="/top10" 
            className={`mobile-nav-link ${isActiveRoute('/top10') ? 'active' : ''}`}
            onClick={() => setShowMobileMenu(false)}
          >
            Top 10
          </Link>
          <Link 
            to="/explore" 
            className={`mobile-nav-link ${isActiveRoute('/explore') ? 'active' : ''}`}
            onClick={() => setShowMobileMenu(false)}
          >
            Explore
          </Link>
          
          {isAuthenticated && (
            <>
              <div className="mobile-menu-divider"></div>
              <Link 
                to={`/profile/${user?.id}`}
                className="mobile-nav-link"
                onClick={() => setShowMobileMenu(false)}
              >
                Profile
              </Link>
              <Link 
                to="/playlists"
                className="mobile-nav-link"
                onClick={() => setShowMobileMenu(false)}
              >
                My Playlists
              </Link>
              <Link 
                to="/settings"
                className="mobile-nav-link"
                onClick={() => setShowMobileMenu(false)}
              >
                Settings
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;