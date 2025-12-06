// src/pages/ProfilePage.jsx - Spotify Profile Style
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authAPI, getImageUrl } from '../services/api';
import './ProfilePage.css';

const ProfilePage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (id) {
      loadUserProfile();
    }
  }, [id]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📡 Loading user profile:', id);

      const response = await authAPI.getUserById(id);
      console.log('✅ User profile response:', response.data);

      if (response.data) {
        const userData = response.data.data || response.data;
        setUser(userData);
        document.title = `${userData.fullName || userData.username} - DJ App World`;
      } else {
        setError('User not found');
      }

    } catch (err) {
      console.error('❌ User profile load error:', err);
      setError('Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await authAPI.unfollowUser(id);
        setIsFollowing(false);
        setUser(prev => ({
          ...prev,
          followerCount: (prev.followerCount || 0) - 1
        }));
      } else {
        await authAPI.followUser(id);
        setIsFollowing(true);
        setUser(prev => ({
          ...prev,
          followerCount: (prev.followerCount || 0) + 1
        }));
      }
    } catch (err) {
      console.error('Follow error:', err);
      alert('Please login to follow users');
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="profile-error">
        <div className="error-icon">😕</div>
        <h2>{error || 'User not found'}</h2>
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="profile-page-spotify">
      {/* Hero Section - Spotify Style */}
      <section className="spotify-hero">
        <div className="spotify-hero-bg">
          {user.profileImage ? (
            <img src={getImageUrl(user.profileImage)} alt="Background" />
          ) : (
            <div className="spotify-hero-gradient"></div>
          )}
        </div>

        <div className="spotify-hero-content">
          <div className="spotify-profile-type">Profile</div>
          
          <div className="spotify-profile-main">
            <div className="spotify-avatar">
              {user.profileImage ? (
                <img 
                  src={getImageUrl(user.profileImage)} 
                  alt={user.fullName}
                  onError={(e) => { e.target.src = '/default-avatar.jpg'; }}
                />
              ) : (
                <div className="spotify-avatar-placeholder">
                  {user.firstName?.charAt(0) || '?'}
                </div>
              )}
            </div>

            <div className="spotify-profile-info">
              <h1 className="spotify-profile-name">{user.fullName || user.username}</h1>
              
              <div className="spotify-profile-meta">
                {/* Badges */}
                {user.badge && user.badge !== 'none' && (
                  <span className={`spotify-badge badge-${user.badge}`}>
                    {user.badge === 'trackbang' && '🎵 TrackBang'}
                    {user.badge === 'premium' && '⭐ Premium'}
                    {user.badge === 'standard' && '✓ Verified'}
                  </span>
                )}
                
                {/* Stats */}
                <span className="spotify-stat">
                  <strong>{user.followerCount || 0}</strong> Followers
                </span>
                <span className="spotify-stat-separator">•</span>
                <span className="spotify-stat">
                  <strong>{user.followingCount || 0}</strong> Following
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="spotify-actions">
            <button className="spotify-play-btn">▶</button>
            <button 
              className={`spotify-follow-btn ${isFollowing ? 'following' : ''}`}
              onClick={handleFollow}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
            <button className="spotify-more-btn">⋯</button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="spotify-content">
        <div className="spotify-section">
          <div className="spotify-section-header">
            <h2>About</h2>
          </div>
          {user.bio ? (
            <p className="spotify-bio">{user.bio}</p>
          ) : (
            <p className="spotify-bio-empty">No bio available</p>
          )}
        </div>

        {/* Social Links */}
        {user.profileLinks && user.profileLinks.length > 0 && (
          <div className="spotify-section">
            <div className="spotify-section-header">
              <h2>Links</h2>
            </div>
            <div className="spotify-links">
              {user.profileLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="spotify-link-item"
                >
                  <span className="spotify-link-icon">🔗</span>
                  <span className="spotify-link-text">{link.title || link.url}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Events */}
        {user.events && user.events.length > 0 && (
          <div className="spotify-section">
            <div className="spotify-section-header">
              <h2>📅 Upcoming Events</h2>
            </div>
            <div className="spotify-events">
              {user.events.map((event, index) => (
                <div key={index} className="spotify-event-item">
                  <div className="spotify-event-date">
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="spotify-event-info">
                    <div className="spotify-event-venue">{event.venue}</div>
                    <div className="spotify-event-location">{event.city}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery */}
        {user.additionalImages && user.additionalImages.length > 0 && (
          <div className="spotify-section">
            <div className="spotify-section-header">
              <h2>📸 Gallery</h2>
            </div>
            <div className="spotify-gallery">
              {user.additionalImages.map((img, index) => (
                <div key={index} className="spotify-gallery-item">
                  <img 
                    src={img.url || getImageUrl(img.filename)} 
                    alt={`Gallery ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Playlists Section */}
        <div className="spotify-section">
          <div className="spotify-section-header">
            <h2>Public Playlists</h2>
            <button className="spotify-show-all">Show all</button>
          </div>
          <div className="spotify-empty">
            <p>No public playlists yet</p>
          </div>
        </div>

        {/* Tracks Section */}
        <div className="spotify-section">
          <div className="spotify-section-header">
            <h2>Popular Tracks</h2>
            <button className="spotify-show-all">Show all</button>
          </div>
          <div className="spotify-empty">
            <p>No tracks yet</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;