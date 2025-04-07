import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import RecipeDetails from './components/RecipeDetails';
import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register';
import ProfilePage from './components/ProfilePage';
import RecipePost from './components/RecipePost';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import axios from 'axios';

// Componente mejorado para rutas privadas
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  useEffect(() => {
    // Verificar autenticación si está cargando
    if (isLoading) {
      axios.get('/api/verify-auth', { withCredentials: true })
        .catch(() => {});
    }
  }, [isLoading]);
  if (isLoading) {
    return <div>Cargando...</div>; // O un spinner de carga
  }
  return isAuthenticated ? children : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={   <Dashboard />  } />
        <Route path="/perfil" element={<ProfilePage />} />

        <Route path="/receta/:id" element={<RecipeDetails />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/receta/:id" element={<RecipePost />} />

      </Routes>
    </AuthProvider>
  );
}

export default App;