import './UserInfo.css';
import PropTypes from 'prop-types';

const UserInfo = ({ user, onClose }) => {
  console.log("User data:", user);

  return (
    <div className="user-info-modal">
      <div className="user-info-content">
        <button onClick={onClose} className="close-btn">×</button>
        <h2>Información del Usuario</h2>
        
        {/* Mostrar la foto del usuario si está disponible */}
        {user.foto && (
          <div className="user-photo-container">
            <img src={user.foto} alt="Foto de perfil" className="user-photo" />
          </div>
        )}

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