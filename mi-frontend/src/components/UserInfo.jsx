import './UserInfo.css';
import PropTypes from 'prop-types';

const UserInfo = ({ user, onClose }) => {
  console.log("User data:", user);

  const getProfilePhoto = (foto) => {
    // Si la foto es 'url_default_foto_perfil', usar la imagen de Cloudinary
    if (foto === 'url_default_foto_perfil') {
      return 'https://res.cloudinary.com/dkpwnkhza/image/upload/v1741732506/usuarios/vwmsergnpyzw8ktvq8yg.png';
    }
    // De lo contrario, usar la foto del usuario (si existe)
    return foto; // Si no hay foto, esto será `null` o `undefined`
  };

  return (
    <div className="user-info-modal">
      <div className="user-info-content">
        <button onClick={onClose} className="close-btn">×</button>
        <h2>Información del Usuario</h2>
        
        <div className="user-photo-container">
          <img 
            src={getProfilePhoto(user.foto)} 
            alt="Foto de perfil" 
            className="user-photo" 
            onError={(e) => {
              // Si la imagen del usuario no se carga, usar la imagen de Cloudinary
              e.target.src = 'https://res.cloudinary.com/dkpwnkhza/image/upload/v1741732506/usuarios/vwmsergnpyzw8ktvq8yg.png';
            }}
          />
        </div>

        <div className="user-details">
          <p><strong>Nombre:</strong> {user.username}</p>
          <p><strong>Rol:</strong> {user.role}</p>
        </div>
      </div>
    </div>
  );
};

UserInfo.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    foto: PropTypes.string, // Foto es una URL opcional
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UserInfo;