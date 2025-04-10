import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });
  const navigate = useNavigate();
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await axios.get('/api/verify-auth', {
          withCredentials: true
        });
  
        if (response.data?.user) {
          setAuthState({
            user: {
              username: response.data.user.username,
              role: response.data.user.role,
              id: response.data.user.id,
              foto: response.data.user.foto || 'https://res.cloudinary.com/dkpwnkhza/image/upload/v1741732506/usuarios/vwmsergnpyzw8ktvq8yg.png'
            },
            isAuthenticated: true,
            isLoading: false
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      } catch (error) {
        console.error("Error verifying auth:", error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    };
    verifyAuth();
  }, []);

  const login = async (token, userData) => {
  setAuthState({
    user: {
      username: userData.username,
      role: userData.role,
      id: userData.id,
      foto: userData.foto

    },
    isAuthenticated: true,
    isLoading: false
  });
  navigate('/');
};

  const logout = async () => {
    try {
      await axios.post(
        'http://localhost:3000/api/logout', 
        {}, 
        { withCredentials: true }
      );
    } finally {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
      navigate('/');
    }
  };

  
  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};