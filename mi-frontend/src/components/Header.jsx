import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css';
import PropTypes from 'prop-types';

const Header = ({ searchQuery, setSearchQuery }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const getProfilePhoto = () => {
    if (!user || !user.foto) {
      return 'https://res.cloudinary.com/dkpwnkhza/image/upload/v1741732506/usuarios/vwmsergnpyzw8ktvq8yg.png';
    }
    
    if (user.foto === 'url_default_foto_perfil') {
      return 'https://res.cloudinary.com/dkpwnkhza/image/upload/v1741732506/usuarios/vwmsergnpyzw8ktvq8yg.png';
    }
    
    if (user.foto.includes('res.cloudinary.com')) {
      return user.foto;
    }
    return 'https://res.cloudinary.com/dkpwnkhza/image/upload/v1741732506/usuarios/vwmsergnpyzw8ktvq8yg.png';
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-icon">🍳</span>
          <span className="logo-text">RECETORIUM</span>
        </Link>
        <div className="search-auth-container">
          <div className="search-box">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar recetas..."
              className="search-input"
            />
            <button className="search-button">
              <span role="img" aria-label="search">🔍</span>
            </button>
          </div>
          <div className="auth-buttons">
            {isAuthenticated ? (
              <div className="profile-container">
                <img
                  src={getProfilePhoto()}
                  alt="Foto perfil"
                  className="profile-avatar"
                  onClick={() => setShowDropdown(!showDropdown)}
                  onError={(e) => e.target.src = 'https://res.cloudinary.com/dkpwnkhza/image/upload/v1741732506/usuarios/vwmsergnpyzw8ktvq8yg.png'}
                />
                {showDropdown && (
                  <div className="dropdown-menu">
                    <Link to="/perfil" className="dropdown-item">Mi perfil</Link>
                    <button onClick={logout} className="dropdown-item logout">
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="auth-btn login">Ingresar</Link>
                <Link to="/register" className="auth-btn register">Regístrate</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
Header.defaultProps = {
  setSearchQuery: () => {},
};

Header.propTypes = {
    searchQuery: PropTypes.string.isRequired,
    setSearchQuery: PropTypes.func.isRequired,
  };
  
export default Header;