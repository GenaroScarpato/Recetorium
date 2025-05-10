import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, setAuthState } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        // Verifica la autenticación al backend
        const res = await axios.get('/api/verify-auth', { withCredentials: true });

        if (!res.data?.user) {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      } catch {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      } finally {
        setChecking(false);
      }
    };

    verifySession();
  }, [setAuthState]);

  if (checking) return <div>Cargando...</div>; // Mostrar algo mientras verificas

  // Si no está autenticado, redirige a la página de inicio
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si está autenticado, muestra los children (contenido protegido)
  return children;
};

// Agrega validación de las props
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
