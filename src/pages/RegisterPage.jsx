// src/pages/RegisterPage.jsx - Modern Register Page
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    userTag: 'none'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Eğer zaten giriş yapmışsa ana sayfaya yönlendir
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Form değişikliklerini yakala
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Hata varsa temizle
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Form validasyonu
  const validateForm = () => {
    const newErrors = {};

    // İsim kontrolü
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'İsim gereklidir';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'İsim en az 2 karakter olmalıdır';
    }

    // Soyisim kontrolü
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Soyisim gereklidir';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Soyisim en az 2 karakter olmalıdır';
    }

    // Kullanıcı adı kontrolü
    if (!formData.username.trim()) {
      newErrors.username = 'Kullanıcı adı gereklidir';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Kullanıcı adı en az 3 karakter olmalıdır';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir';
    }

    // Email kontrolü
    if (!formData.email.trim()) {
      newErrors.email = 'Email adresi gereklidir';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir email adresi giriniz';
    }

    // Şifre kontrolü
    if (!formData.password) {
      newErrors.password = 'Şifre gereklidir';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır';
    }

    // Şifre tekrar kontrolü
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifre tekrarı gereklidir';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    }

    // Kullanım koşulları
    if (!acceptTerms) {
      newErrors.terms = 'Kullanım koşullarını kabul etmelisiniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form gönderme
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const result = await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        username: formData.username.toLowerCase().trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        userTag: formData.userTag
      });

      if (result.success) {
        // Başarılı kayıt
        navigate('/');
      } else {
        // Hata mesajı
        setErrors({ general: result.message || 'Kayıt oluşturulamadı' });
      }
    } catch (error) {
      setErrors({ 
        general: error.response?.data?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Sol Taraf - Branding */}
        <div className="auth-branding">
          <div className="branding-content">
            <div className="brand-logo">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
            <h1 className="brand-title">DJ App World</h1>
            <p className="brand-subtitle">
              Join thousands of music lovers and DJs
            </p>
            <div className="brand-stats">
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Tracks</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">5K+</span>
                <span className="stat-label">Artists</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">1K+</span>
                <span className="stat-label">Playlists</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Taraf - Register Form */}
        <div className="auth-form-section">
          <div className="auth-form-container">
            <div className="auth-header">
              <h2 className="auth-title">Hesap Oluştur</h2>
              <p className="auth-subtitle">DJ App World'e katılın</p>
            </div>

            {/* Genel Hata Mesajı */}
            {errors.general && (
              <div className="alert alert-error">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <span>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {/* İsim & Soyisim - Yan Yana */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">İsim</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className={`form-input ${errors.firstName ? 'error' : ''}`}
                    placeholder="İsminiz"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.firstName && (
                    <span className="form-error">{errors.firstName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">Soyisim</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className={`form-input ${errors.lastName ? 'error' : ''}`}
                    placeholder="Soyisminiz"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.lastName && (
                    <span className="form-error">{errors.lastName}</span>
                  )}
                </div>
              </div>

              {/* Kullanıcı Adı */}
              <div className="form-group">
                <label htmlFor="username" className="form-label">Kullanıcı Adı</label>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className={`form-input ${errors.username ? 'error' : ''}`}
                    placeholder="kullaniciadi"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                {errors.username && (
                  <span className="form-error">{errors.username}</span>
                )}
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Adresi</label>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="ornek@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                {errors.email && (
                  <span className="form-error">{errors.email}</span>
                )}
              </div>

              {/* Telefon (Opsiyonel) */}
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Telefon <span className="optional-badge">(Opsiyonel)</span>
                </label>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-input"
                    placeholder="+90 555 555 5555"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* User Tag */}
              <div className="form-group">
                <label htmlFor="userTag" className="form-label">
                  Ben Bir... <span className="optional-badge">(Opsiyonel)</span>
                </label>
                <select
                  id="userTag"
                  name="userTag"
                  className="form-input"
                  value={formData.userTag}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="none">Seçim Yapmak İstemiyorum</option>
                  <option value="producer">Prodüktörüm</option>
                  <option value="dj">DJ'im</option>
                  <option value="dj-producer">DJ & Prodüktörüm</option>
                  <option value="distributor">Distribütörüm</option>
                </select>
              </div>

              {/* Şifre & Şifre Tekrar */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password" className="form-label">Şifre</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.password && (
                    <span className="form-error">{errors.password}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">Şifre Tekrar</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.confirmPassword && (
                    <span className="form-error">{errors.confirmPassword}</span>
                  )}
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => {
                      setAcceptTerms(e.target.checked);
                      if (errors.terms) {
                        setErrors(prev => ({ ...prev, terms: '' }));
                      }
                    }}
                    disabled={loading}
                  />
                  <span>
                    <Link to="/terms" target="_blank">Kullanım Koşulları</Link>'nı ve{' '}
                    <Link to="/privacy" target="_blank">Gizlilik Politikası</Link>'nı okudum ve kabul ediyorum
                  </span>
                </label>
                {errors.terms && (
                  <span className="form-error">{errors.terms}</span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    <span>Kayıt Oluşturuluyor...</span>
                  </>
                ) : (
                  'Kayıt Ol'
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="auth-footer">
              <p className="footer-text">
                Zaten hesabınız var mı?{' '}
                <Link to="/login" className="footer-link">
                  Giriş Yapın
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;