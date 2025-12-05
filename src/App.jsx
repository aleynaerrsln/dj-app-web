// src/App.jsx - COMPLETE & UPDATED (ALL ROUTES)
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage';
import HotPage from './pages/HotPage';
import Top10Page from './pages/Top10Page';
import ExplorePage from './pages/ExplorePage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <Routes>
            {/* Main Pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/hot" element={<HotPage />} />
            <Route path="/top10" element={<Top10Page />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/search" element={<SearchPage />} />
            
            {/* Auth Pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* User Profile */}
            <Route path="/profile/:id" element={<ProfilePage />} />
            
            {/* Playlist Detail */}
            <Route 
              path="/playlist/:id" 
              element={
                <div className="container section" style={{ paddingTop: '120px' }}>
                  <h1>Playlist Detail</h1>
                  <p>Coming Soon...</p>
                </div>
              } 
            />
            
            {/* Track Detail */}
            <Route 
              path="/track/:id" 
              element={
                <div className="container section" style={{ paddingTop: '120px' }}>
                  <h1>Track Detail</h1>
                  <p>Coming Soon...</p>
                </div>
              } 
            />
            
            {/* Genre Page */}
            <Route 
              path="/genre/:genre" 
              element={
                <div className="container section" style={{ paddingTop: '120px' }}>
                  <h1>Genre Page</h1>
                  <p>Coming Soon...</p>
                </div>
              } 
            />
            
            {/* Library Pages */}
            <Route 
              path="/favorites" 
              element={
                <div className="container section" style={{ paddingTop: '120px' }}>
                  <h1>❤️ Favorites</h1>
                  <p>Coming Soon...</p>
                </div>
              } 
            />
            
            <Route 
              path="/playlists" 
              element={
                <div className="container section" style={{ paddingTop: '120px' }}>
                  <h1>📁 My Playlists</h1>
                  <p>Coming Soon...</p>
                </div>
              } 
            />
            
            <Route 
              path="/history" 
              element={
                <div className="container section" style={{ paddingTop: '120px' }}>
                  <h1>🕐 History</h1>
                  <p>Coming Soon...</p>
                </div>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;