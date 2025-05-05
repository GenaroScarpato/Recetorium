import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import NavigationSidebar from './NavigationSidebar';
import '../styles/ChefPage.css';

const ChefPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/usuarios/chefs');
        const chefs = response.data;
  
        const chefsConSeguimiento = chefs.map(chef => ({
          ...chef,
          isFollowing: user?.siguiendo?.includes(chef._id)
        }));
  
        setUsuarios(chefsConSeguimiento);
      } catch (error) {
        console.error('Error cargando usuarios:', error);
        setError('No se pudieron cargar los usuarios. Por favor intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };
  
    if (user) {
      fetchUsuarios();
    }
  }, [user]);
  

  const handleFollow = async (usuarioId, isFollowing) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const endpoint = isFollowing ? '/unfollow' : '/follow';
      await axios({
        method: isFollowing ? 'delete' : 'post',
        url: `/api/usuarios/${endpoint}`,
        data: {
          seguidorId: user.id,
          usuarioId,
        },
        withCredentials: true,
      });

      setUsuarios(prevUsuarios =>
        prevUsuarios.map(usuario =>
          usuario._id === usuarioId
            ? { ...usuario, isFollowing: !isFollowing }
            : usuario
        )
      );
    } catch (error) {
      console.error('Error al actualizar el estado de seguimiento:', error);
      setError('Error al seguir el chef');
    }
  };

  const handleClickUser = (usuarioId) => {
    if (user && user.id === usuarioId) {
      navigate('/perfil');
    } else {
      navigate(`/perfil/${usuarioId}`);
    }
  };

  return (
    <div className="recipe-app-layout">
      <Header user={user} />
      <div className="main-content-dashboard">
        <NavigationSidebar />
        <div className="center-column">
          <div className="recipes-feed">
            <h2>Chefs Registrados en Recetorium</h2>

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
                    <div
                      className="chef-avatar"
                      onClick={() => handleClickUser(usuario._id)} 
                    >
                      <img
                        src={
                          usuario.foto === 'url_default_foto_perfil'
                            ? 'https://res.cloudinary.com/dkpwnkhza/image/upload/v1741732506/usuarios/vwmsergnpyzw8ktvq8yg.png'
                            : usuario.foto
                        }
                        alt={usuario.username}
                      />
                    </div>
                    <div className="chef-info">
                      <span
                        className="chef-username"
                        onClick={() => handleClickUser(usuario._id)} 
                      >
                        {usuario.username}
                      </span>
                      <span className="chef-followers">{usuario.role || 'Sin rol definido'}</span>
                    </div>
                    <button
                      className={`chef-follow-button ${usuario.isFollowing ? 'following' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click from navigating
                        handleFollow(usuario._id, usuario.isFollowing);
                      }}
                    >
                      {usuario.isFollowing ? 'Siguiendo' : 'Seguir'}
                    </button>
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

export default ChefPage;
