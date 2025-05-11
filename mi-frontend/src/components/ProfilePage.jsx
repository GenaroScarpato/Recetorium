import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Agregado useNavigate
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/ProfilePage.css';
import UserListModal from './UserListModal';
import RecipePost from './RecipePost';

const ProfilePage = () => {
  const { id } = useParams();
  const { user: loggedUser, token,updateUser   } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [seguidores, setSeguidores] = useState([]);
  const [seguidos, setSeguidos] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);
  const [recipesLoading, setRecipesLoading] = useState(true);

  const navigate = useNavigate(); // Hook para la navegación

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = id || loggedUser?.id;
        const [userRes, seguidosRes, seguidoresRes, recipesRes] = await Promise.all([
          axios.get(`/api/usuarios/${userId}`),
          axios.get(`/api/usuarios/seguidos/${userId}`),
          axios.get(`/api/usuarios/seguidores/${userId}`),
          axios.get(`/api/recetas/getUserRecipes/${userId}`)
        ]);

        setUserData(userRes.data);
        setSeguidos(seguidosRes.data);
        setSeguidores(seguidoresRes.data);
        setUserRecipes(recipesRes.data);
      } catch (error) {
        console.error("Error al cargar datos del perfil:", error);
      } finally {
        setLoading(false);
        setRecipesLoading(false);
      }
    };

    if (loggedUser || id) {
      fetchData();
    } else {
      setLoading(false); // Evita quedar en "Cargando..." si no hay sesión ni ID
    }

  }, [id, loggedUser]);

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('foto', selectedFile);

    try {
      setUpdating(true);
      const response = await axios.patch(`/api/usuarios/${loggedUser.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });

      if (response.data.updatedUser) {
        const updated = response.data.updatedUser;
        setUserData(updated);
        updateUser({ foto: updated.foto }); // 👈 actualiza el contexto global
        setSelectedFile(null);
      }
      
    } catch (error) {
      console.error("Error al actualizar la foto:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setUpdating(true);
      const response = await axios.patch(`/api/usuarios/${loggedUser.id}`, {
        foto: 'url_default_foto_perfil'
      }, { withCredentials: true });

      if (response.data.updatedUser) {
        const updated = response.data.updatedUser;
        setUserData(updated);
        updateUser({ foto: updated.foto }); // 👈 actualiza globalmente con la default
      }
      
    } catch (error) {
      console.error("Error al eliminar la foto:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="loading">Cargando perfil...</div>;
  if (!userData) return <div className="error">Error al cargar el perfil</div>;

  const defaultImage = 'https://res.cloudinary.com/dkpwnkhza/image/upload/v1741732506/usuarios/vwmsergnpyzw8ktvq8yg.png';
  const profileImage = userData.foto && userData.foto !== 'url_default_foto_perfil' ? userData.foto : defaultImage;
  const isOwnProfile = !id || id === loggedUser.id;

  return (
    <div className="profile-page-container">
      <button 
        className="back-button" 
        onClick={() => navigate(-1)} 
        style={{ position: 'absolute', top: '20px', left: '20px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>
        ←
      </button>

      {showModal === 'seguidores' && (
        <UserListModal 
          title="Seguidores" 
          users={seguidores} 
          onClose={() => setShowModal(null)} 
          isAuthenticated={!!loggedUser}
          autenticatedUser={loggedUser}
        />
      )}
      
      {showModal === 'seguidos' && (
        <UserListModal 
          title="Seguidos" 
          users={seguidos} 
          onClose={() => setShowModal(null)} 
          isAuthenticated={!!loggedUser}
          autenticatedUser={loggedUser}
        />
      )}

      <div className="profile-header">
        <div className="profile-avatar-wrapper">
          <img
            src={profileImage}
            alt="Foto de perfil"
            className="profile-avatar-large"
          />

          {isOwnProfile && (
            <div className="avatar-overlay">
              <label htmlFor="fileInput" className="icon-button edit-icon">✏️</label>
              <button className="icon-button delete-icon" onClick={handleRemoveImage}>🗑️</button>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>

        <h1>{userData.username}</h1>

        <div className="followers-summary">
          <span onClick={() => setShowModal('seguidores')} style={{ cursor: 'pointer' }}>
            <strong>{seguidores.length}</strong> seguidores
          </span>
          <span onClick={() => setShowModal('seguidos')} style={{ cursor: 'pointer' }}>
            <strong>{seguidos.length}</strong> seguidos
          </span>
        </div>

        {isOwnProfile && selectedFile && (
          <form onSubmit={handleImageUpload} className="upload-form">
            <button type="submit" disabled={updating}>
              {updating ? 'Actualizando...' : 'Guardar nueva foto'}
            </button>
          </form>
        )}
      </div>

      <div className="profile-details">
        <section className="profile-section">
          <h2>Información Personal</h2>
          <div className="detail-row">
            <span className="detail-label">Nombre:</span>
            <span className="detail-value">{userData.username || 'No especificado'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Rol:</span>
            <span className="detail-value">{userData.role}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{userData.username}@Recetorium.com</span>
          </div>
        </section>

        <section className="profile-section">
          <h2>Recetas de {userData.username}</h2>
          {recipesLoading ? (
            <div className="loading">Cargando recetas...</div>
          ) : userRecipes.length > 0 ? (
            <div className="recipes-grid">
              {userRecipes.map(recipe => (
                <RecipePost key={recipe._id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <p>Este usuario no ha creado ninguna receta aún.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
