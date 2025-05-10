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
              foto: response.data.user.foto || 'https://res.cloudinary.com/dkpwnkhza/image/upload/v1741732506/usuarios/vwmsergnpyzw8ktvq8yg.png',
              recetasGuardadas: response.data.user.recetasGuardadas || [],
              seguidores: response.data.user.seguidores || [],
              siguiendo: response.data.user.siguiendo || []
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

        if (error.response?.status !== 401) {
          console.error("Error inesperado al verificar auth:", error);
        }
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
        foto: userData.foto,
        recetasGuardadas: userData.recetasGuardadas || [],
        seguidores: userData.seguidores || [],
        siguiendo: userData.siguiendo || []
      },
      isAuthenticated: true,
      isLoading: false
    });
    navigate('/');
  };

  const logout = async () => {
    try {
      await axios.post('/api/logout', {}, { withCredentials: true });
    } finally {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
      navigate('/');
    }
  };

  const updateSavedRecipes = (recipeId, action) => {
    setAuthState(prevState => {
      if (!prevState.user) return prevState;

      const currentSavedRecipes = prevState.user.recetasGuardadas || [];
      let updatedSavedRecipes;

      if (action === 'save') {
        if (!currentSavedRecipes.includes(recipeId)) {
          updatedSavedRecipes = [...currentSavedRecipes, recipeId];
        } else {
          return prevState;
        }
      } else {
        updatedSavedRecipes = currentSavedRecipes.filter(id => id !== recipeId);
      }

      return {
        ...prevState,
        user: {
          ...prevState.user,
          recetasGuardadas: updatedSavedRecipes
        }
      };
    });
  };

  const updateFollowing = (usuarioId, action) => {
    setAuthState(prevState => {
      if (!prevState.user) return prevState;

      const siguiendoActual = prevState.user.siguiendo || [];
      let nuevoSiguiendo;

      if (action === 'follow') {
        if (!siguiendoActual.includes(usuarioId)) {
          nuevoSiguiendo = [...siguiendoActual, usuarioId];
        } else {
          return prevState;
        }
      } else {
        nuevoSiguiendo = siguiendoActual.filter(id => id !== usuarioId);
      }

      return {
        ...prevState,
        user: {
          ...prevState.user,
          siguiendo: nuevoSiguiendo
        }
      };
    });
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      setAuthState, // <- ahora expuesto
      login,
      logout,
      updateSavedRecipes,
      updateFollowing
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
