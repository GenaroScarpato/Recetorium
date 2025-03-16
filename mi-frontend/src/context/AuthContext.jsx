import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/verify-auth', {
          credentials: 'include', // Incluir cookies en la solicitud
        });

        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setUser(data.user); // Actualizar el estado del usuario con los datos del backend
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    verifyAuth();
  }, []);

  // Función para iniciar sesión
  const login = async (token, username, role, id) => {
    try {
      setIsAuthenticated(true);
      setUser({ username, role, id }); // Actualizar el estado del usuario
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error; // Propagar el error para manejarlo en el componente de login
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/logout', {
        method: 'POST',
        credentials: 'include', // Incluir cookies en la solicitud
      });
  
      if (response.ok) {
        setIsAuthenticated(false);
        setUser(null);
      } else {
        console.error('Error al cerrar sesión: Respuesta no exitosa');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);