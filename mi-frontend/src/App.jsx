import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register';
import ProfilePage from './components/ProfilePage';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import axios from 'axios';
import ChefsPage from './components/ChefsPage';
import MisRecetas from './components/MisRecetas';
import Guardadas from './components/Guardadas';
import AdminDashboard from './components/AdminDashboard';

// Configurar axios para enviar cookies automáticamente
axios.defaults.withCredentials = true;

// Ruta privada
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  useEffect(() => {
    if (isLoading) {
      axios.get('/api/verify-auth').catch(() => {});
    }
  }, [isLoading]);

  if (isLoading) return <div>Cargando...</div>;

  return isAuthenticated ? children : <Navigate to="/login" />;
  };

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired
};
function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Privadas */}
        <Route path="/perfil" element={<PrivateRoute><ProfilePage /></PrivateRoute> } />
        <Route path="/perfil/:id" element={ <PrivateRoute> <ProfilePage /> </PrivateRoute>} />
        <Route path="/mis-recetas" element={ <PrivateRoute>   <MisRecetas /> </PrivateRoute>  } />
        <Route path="/guardadas" element={ <PrivateRoute>   <Guardadas /> </PrivateRoute>  } />
        <Route path="/chefs" element={ <PrivateRoute>   <ChefsPage /></PrivateRoute>  } />
        <Route path="/admin" element={ <PrivateRoute>   <AdminDashboard /></PrivateRoute>  } />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
