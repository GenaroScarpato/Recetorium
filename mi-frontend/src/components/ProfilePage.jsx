import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/usuarios/${user.id}`);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchUserData();
    }
  }, [user]);

  if (loading) {
    return <div className="loading">Cargando perfil...</div>;
  }

  if (!userData) {
    return <div className="error">Error al cargar el perfil</div>;
  }

  // ✅ Lógica para foto de perfil
  const defaultImage = 'https://res.cloudinary.com/dkpwnkhza/image/upload/v1741732506/usuarios/vwmsergnpyzw8ktvq8yg.png';
  const profileImage = userData.foto && userData.foto !== 'url_default_foto_perfil' ? userData.foto : defaultImage;

  return (
    <div className="profile-page-container">
      <div className="profile-header">
        <img 
          src={profileImage}
          alt="Foto de perfil"
          className="profile-avatar-large"
        />
        <h1>{userData.username}</h1>
        <p className="member-since">Miembro desde: {new Date(userData.fechaRegistro).toLocaleDateString()}</p>
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
