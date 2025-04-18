// components/Chef.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Header from './Header';
import NavigationSidebar from './NavigationSidebar';
import '../styles/Dashboard.css';

const Chef = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/usuarios/chefs');
        setUsuarios(response.data);
      } catch (error) {
        console.error("Error cargando usuarios:", error);
        setError("No se pudieron cargar los usuarios. Por favor intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  return (
    <div className="recipe-app-layout">
      <Header user={user} />
      <div className="main-content-dashboard">
        <NavigationSidebar />
        <div className="center-column">
          <div className="recipes-feed">
            <h1>Chefs Registrados en Recetorium</h1>

            {loading ? (
              <div className="loading">
                <div className="loading-spinner"></div>
                <p>Cargando usuarios...</p>
              </div>
            ) : error ? (
              <div className="error">
                <h2>Error</h2>
                <p>{error}</p>
              </div>
            ) : usuarios.length > 0 ? (
              <div className="chefs-list">
                {usuarios.map(usuario => (
                  <div className="chef-card" key={usuario._id}>
                    <div className="chef-avatar">
                      <img 
                        src={
                          usuario.foto === "url_default_foto_perfil"
                            ? "https://res.cloudinary.com/dkpwnkhza/image/upload/v1741732506/usuarios/vwmsergnpyzw8ktvq8yg.png"
                            : usuario.foto
                        }
                        alt={usuario.username} 
                      />
                    </div>
                    <div className="chef-info">
                      <span className="chef-username">{usuario.username}</span>
                      <span className="chef-followers">{usuario.role || 'Sin rol definido'}</span>
                    </div>
                    <button className="follow-button">Seguir</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <div className="no-results-icon">👤</div>
                <h3 className="no-results-title">No se encontraron usuarios</h3>
                <p>Intenta más tarde</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chef;
