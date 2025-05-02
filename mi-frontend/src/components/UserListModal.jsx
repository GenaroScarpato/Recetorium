import PropTypes from 'prop-types';
import { useEffect,useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Asegúrate de importar useNavigate
const UserListModal = ({ title, users, onClose, isAuthenticated  , autenticatedUser }) => {
  const navigate = useNavigate();  // Usa el hook useNavigate para obtener la función navigate
  const [followStatus, setFollowStatus] = useState({});


  useEffect(() => {
    if (autenticatedUser && autenticatedUser.siguiendo && users) {
      const status = {};
      users.forEach(user => {
        status[user._id] = autenticatedUser.siguiendo.includes(user._id);
      });
      setFollowStatus(status);
    }
  }, [users, autenticatedUser]);

  const handleFollow = async (userId, e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login'); // Redirige a login si no está autenticado
      return;
    }

    try {
      const isFollowing = followStatus[userId]; // Verificamos el estado de seguimiento
      const endpoint = isFollowing ? 'unfollow' : 'follow'; // Cambié aquí el endpoint

      // Realiza la solicitud a la API de seguimiento o dejar de seguir
      await axios({
        method: isFollowing ? 'delete' : 'post', // Usa DELETE para unfollow, POST para follow
        url: `/api/usuarios/${endpoint}`,
        data: {
          seguidorId: autenticatedUser.id, // ID del usuario autenticado
          usuarioId: userId, // ID del usuario objetivo
        },
        withCredentials: true, // Para mantener las cookies (sesión)
      });

      // Actualiza el estado para reflejar si el usuario está siguiendo o no
      setFollowStatus(prevState => ({
        ...prevState,
        [userId]: !isFollowing,
      }));
    } catch (error) {
      console.error('Error al actualizar el estado de seguimiento:', error);
    }
  };

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="profile-modal-close" onClick={onClose}>×</button>
        <h3 className="profile-modal-title">{title}</h3>

        {users?.length > 0 ? (
          <ul className="profile-modal-list">
            {users.map(user => (
              <li key={user._id} className="profile-modal-user">
                <img
                  src={user.foto || 'https://res.cloudinary.com/dkpwnkhza/image/upload/v1741732506/usuarios/vwmsergnpyzw8ktvq8yg.png'}
                  alt={user.username}
                  className="user-avatar"
                  style={{ width: '32px', height: '32px', borderRadius: '50%', marginRight: '10px' }}
                />
                {user.username}
                <button
                  onClick={(e) => handleFollow(user._id, e)}
                  className="follow-button"
                >
                {followStatus[user._id] ? 'Siguiendo' : 'Seguir'}
                    </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay usuarios para mostrar</p>
        )}
      </div>
    </div>
  );
};

UserListModal.propTypes = {
  title: PropTypes.string.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      foto: PropTypes.string,
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired, // Aseguramos que el estado de autenticación se pase al componente
    autenticatedUser: PropTypes.shape({
        id: PropTypes.string.isRequired,
        siguiendo: PropTypes.arrayOf(PropTypes.string),
    }), // Aseguramos que el usuario autenticado se pase al componente
};

UserListModal.defaultProps = {
  users: [],
};

export default UserListModal;
