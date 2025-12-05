// src/services/api.js - Backend API servisi
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Token'ı her istekte ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Token expire kontrolü
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expire olmuşsa localStorage'ı temizle
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========== AUTH ENDPOINTS ========== (DÜZELTME YAPILDI)
export const authAPI = {
  // Kayıt
  register: (data) => api.post('/api/register', data),
  
  // Giriş
  login: (credentials) => api.post('/api/login', credentials),
  
  // Çıkış
  logout: () => api.post('/api/logout'),
  
  // Mevcut kullanıcı bilgisi
  getCurrentUser: () => api.get('/api/me'),
  
  // Kullanıcı bilgisi (ID ile)
  getUserById: (userId) => api.get(`/api/user/${userId}`),
  
  // Profil güncelleme
  updateProfile: (data) => api.put('/api/profile', data),
  
  // Profil resmi yükleme
  uploadProfileImage: (formData) => 
    api.post('/api/upload-profile-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  // Kullanıcı arama
  searchUsers: (query) => api.get(`/api/search?query=${query}`),
  
  // Takip et
  followUser: (userId) => api.post(`/api/follow/${userId}`),
  
  // Takipten çık
  unfollowUser: (userId) => api.post(`/api/unfollow/${userId}`),
};

// ========== SEARCH ENDPOINTS ==========
export const searchAPI = {
  // Tüm kategorilerde arama
  searchAll: (query, type = 'all') => 
    api.get(`/api/search?query=${query}&type=${type}`),
  
  // Sadece kullanıcılarda arama
  searchUsers: (query, limit = 20) => 
    api.get(`/api/search/users?query=${query}&limit=${limit}`),
  
  // Sadece playlist'lerde arama
  searchPlaylists: (query, limit = 20) => 
    api.get(`/api/search/playlists?query=${query}&limit=${limit}`),
  
  // Sadece müziklerde arama
  searchMusics: (query, limit = 20, genre = null) => {
    let url = `/api/search/musics?query=${query}&limit=${limit}`;
    if (genre) url += `&genre=${genre}`;
    return api.get(url);
  },
  
  // Sanatçıya göre arama
  searchByArtist: (artist) => 
    api.get(`/api/search/by-artist?artist=${artist}`),
  
  // Genre'ye göre arama
  searchByGenre: (genre, query = null) => {
    let url = `/api/search/by-genre?genre=${genre}`;
    if (query) url += `&query=${query}`;
    return api.get(url);
  },
  
  // Arama önerileri
  getSearchSuggestions: (query, limit = 10) => 
    api.get(`/api/search/suggestions?query=${query}&limit=${limit}`),
};

// ========== HELPER FUNCTIONS ==========
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
};

export const getImageUrl = (imagePath) => {
  if (!imagePath || imagePath === 'image.jpg') return null;
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
  if (imagePath.startsWith('/uploads/')) return `${API_BASE_URL}${imagePath}`;
  return `${API_BASE_URL}/uploads/${imagePath}`;
};
// ========== MUSIC ENDPOINTS ==========
export const musicAPI = {
  // Tüm müzikler
  getAllMusic: (params = {}) => {
    const { page = 1, limit = 20, genre, sortBy, search } = params;
    let url = `/api/music?page=${page}&limit=${limit}`;
    if (genre) url += `&genre=${genre}`;
    if (sortBy) url += `&sortBy=${sortBy}`;
    if (search) url += `&search=${search}`;
    return api.get(url);
  },

  // Müzik detayı
  getMusicById: (id) => api.get(`/api/music/${id}`),

  // Featured müzikler
  getFeaturedMusic: (limit = 10) => api.get(`/api/music/featured?limit=${limit}`),

  // Popüler müzikler
  getPopularMusic: (params = {}) => {
    const { limit = 20, genre } = params;
    let url = `/api/music/popular?limit=${limit}`;
    if (genre) url += `&genre=${genre}`;
    return api.get(url);
  },

  // Yeni çıkanlar
  getNewReleases: (params = {}) => {
    const { limit = 20, genre } = params;
    let url = `/api/music/new-releases?limit=${limit}`;
    if (genre) url += `&genre=${genre}`;
    return api.get(url);
  },

  // Genre'ye göre müzikler
  getMusicByGenre: (genre, params = {}) => {
    const { page = 1, limit = 20 } = params;
    return api.get(`/api/music/genre/${genre}?page=${page}&limit=${limit}`);
  },

  // Müziği beğen/beğenme
  likeMusic: (id) => api.post(`/api/music/${id}/like`),

  // Play count artır
  incrementPlayCount: (id) => api.post(`/api/music/${id}/play`),
};

// ========== PLAYLIST ENDPOINTS ==========
export const playlistAPI = {
  // Tüm public playlist'ler
  getPublicPlaylists: (params = {}) => {
    const { page = 1, limit = 20, genre } = params;
    let url = `/api/playlists/public?page=${page}&limit=${limit}`;
    if (genre) url += `&genre=${genre}`;
    return api.get(url);
  },

  // Playlist detayı
  getPlaylistById: (id) => api.get(`/api/playlists/${id}`),

  // Kullanıcının playlist'leri
  getMyPlaylists: () => api.get('/api/playlists/my-playlists'),

  // Playlist oluştur
  createPlaylist: (data) => api.post('/api/playlists', data),

  // Playlist güncelle
  updatePlaylist: (id, data) => api.put(`/api/playlists/${id}`, data),

  // Playlist sil
  deletePlaylist: (id) => api.delete(`/api/playlists/${id}`),

  // Playlist'e müzik ekle
  addTracksToPlaylist: (id, trackIds) => 
    api.post(`/api/playlists/${id}/tracks`, { trackIds }),

  // Playlist'ten müzik çıkar
  removeTracksFromPlaylist: (id, trackIds) => 
    api.delete(`/api/playlists/${id}/tracks`, { data: { trackIds } }),
};

// ========== HOT ENDPOINTS ==========
export const hotAPI = {
  // Her genre'den hot playlist'ler
  getHotPlaylists: () => api.get('/api/hot'),

  // Genre'ye göre latest playlist
  getLatestPlaylistByGenre: (genre) => api.get(`/api/hot/genre/${genre}/latest`),

  // Trending playlist'ler
  getTrendingPlaylists: (params = {}) => {
    const { limit = 10, genre } = params;
    let url = `/api/hot/trending?limit=${limit}`;
    if (genre) url += `&genre=${genre}`;
    return api.get(url);
  },

  // Yeni çıkan playlist'ler
  getNewReleases: (params = {}) => {
    const { limit = 10, days = 7, genre } = params;
    let url = `/api/hot/new-releases?limit=${limit}&days=${days}`;
    if (genre) url += `&genre=${genre}`;
    return api.get(url);
  },

  // Featured musics
  getFeaturedMusics: (params = {}) => {
    const { limit = 20, genre } = params;
    let url = `/api/hot/featured?limit=${limit}`;
    if (genre) url += `&genre=${genre}`;
    return api.get(url);
  },

  // HOT stats
  getHotStats: () => api.get('/api/hot/stats'),
};
export default api;