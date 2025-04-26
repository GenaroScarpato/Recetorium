import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { user, token } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [seguidores, setSeguidores] = useState([]);
  const [seguidos, setSeguidos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, seguidosRes, seguidoresRes] = await Promise.all([
          axios.get(`/api/usuarios/${user.id}`),
          axios.get(`/api/usuarios/seguidos/${user.id}`),
          axios.get(`/api/usuarios/seguidores/${user.id}`)
        ]);
        setUserData(userRes.data);
        setSeguidos(seguidosRes.data);
        setSeguidores(seguidoresRes.data);
      } catch (error) {
        console.error("Error al cargar datos del perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('foto', selectedFile);

    try {
      setUpdating(true);
      const response = await axios.patch(`/api/usuarios/${user.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });

      if (response.data.updatedUser) {
        setUserData(response.data.updatedUser);
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
      const response = await axios.patch(`/api/usuarios/${user.id}`, {
        foto: 'url_default_foto_perfil'
      }, { withCredentials: true });

      if (response.data.updatedUser) {
        setUserData(response.data.updatedUser);
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

  return (
    <div className="profile-page-container">
      <div className="profile-header">
        <div className="profile-avatar-wrapper">
          <img
            src={profileImage}
            alt="Foto de perfil"
            className="profile-avatar-large"
          />
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
        </div>

        <h1>{userData.username}</h1>

        {/* NUEVA SECCIÓN: Seguidores y Seguidos */}
        <div className="followers-summary">
          <span><strong>{seguidores.length}</strong> seguidores</span>
          <span><strong>{seguidos.length}</strong> seguidos</span>
        </div>

        {selectedFile && (
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
            <span className="detail-value">{userData.nombre || 'No especificado'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Rol:</span>
            <span className="detail-value">{userData.role}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{userData.email}</span>
          </div>
        </section>

        <section className="profile-section">
          <h2>Mis Recetas</h2>
          {userData.recetasCreadas?.length > 0 ? (
            <div className="recipes-grid">
              {userData.recetasCreadas.map(recipe => (
                <div key={recipe._id} className="recipe-card">
                  <h3>{recipe.nombre}</h3>
                  <p>{recipe.descripcion?.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No has creado ninguna receta aún.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
