import PropTypes from 'prop-types'; // Importa PropTypes
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirige a la página de inicio de sesión si no está autenticado
    return <Navigate to="/" replace />;
  }

  // Renderiza el contenido protegido si está autenticado
  return children;
};

// Agrega la validación de props
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, // children debe ser un nodo y es obligatorio
};

export default ProtectedRoute;
