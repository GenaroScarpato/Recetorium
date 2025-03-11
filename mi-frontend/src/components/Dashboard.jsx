import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from './Login';
import RecipeCard from './RecipeCard';
import UserInfo from './UserInfo';
import './Dashboard.css';
import axios from 'axios';

const Dashboard = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [recetas, setRecetas] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [userData, setUserData] = useState(null);
  const [filters, setFilters] = useState({
    tipoComida: [],
    nivelDificultad: [],
    ingredientePrincipal: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/api/recetas')
      .then((response) => response.json())
      .then((data) => setRecetas(data))
      .catch((error) => console.error('Error al obtener las recetas:', error));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (updatedFilters[filterType].includes(value)) {
        updatedFilters[filterType] = updatedFilters[filterType].filter((item) => item !== value);
      } else {
        updatedFilters[filterType] = [...updatedFilters[filterType], value];
      }
      return updatedFilters;
    });
  };

  const handleUserInfoClick = async () => {
    console.log("handleUserInfoClick ejecutado");
    try {
      console.log("Llamando a la API para obtener datos del usuario con ID:", user.id);
  
      // Obtener el token del localStorage
      const token = localStorage.getItem('token');
      
      // Hacer la solicitud con el token en el encabezado
      const response = await axios.get(`http://localhost:3000/api/usuarios/${user.id}`, {
        headers: {
         'x-token': token,   },
      });
  
      console.log("Respuesta de la API:", response.data);
      setUserData(response.data);
      setShowUserInfo(true);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('No autorizado: Token inválido o expirado');
        alert('No autorizado: Por favor, inicia sesión nuevamente.'); // O muestra un mensaje en la interfaz de usuario
      } else {
        console.error('Error al obtener los datos del usuario:', error);
      }
    }
  };

  const filteredRecetas = recetas.filter((receta) => {
    if (
      filters.tipoComida.length === 0 &&
      filters.nivelDificultad.length === 0 &&
      filters.ingredientePrincipal.length === 0
    ) {
      return true;
    }

    return (
      (filters.tipoComida.length === 0 || filters.tipoComida.includes(receta.tipoComida)) &&
      (filters.nivelDificultad.length === 0 || filters.nivelDificultad.includes(receta.nivelDificultad)) &&
      (filters.ingredientePrincipal.length === 0 || filters.ingredientePrincipal.includes(receta.ingredientePrincipal))
    );
  });

  return (
    <div className="dashboard-container">
      <div className="header">
        <img src="../public/icono.png" alt="Icono" className="header-icon" />
        <div className="auth-buttons">
          {isAuthenticated && user ? ( // Verifica que el usuario esté autenticado y que `user` no sea null
            <div className="user-info">
              <span className="user-name" onClick={handleUserInfoClick}>
                Bienvenido, {user.username} {/* Accede a `user.username` solo si `user` no es null */}
              </span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <>
              <button className="login-btn" onClick={() => setShowLogin(true)}>
                Login
              </button>
              <button className="register-btn">Register</button>
            </>
          )}
        </div>
      </div>

      <div className="main-content">
        <div className="sidebar">
          <h3>Filtrar por:</h3>
          <div className="filter-group">
            <h4>Tipo de Comida</h4>
            {['Entradas', 'Platos principales', 'Postres', 'Aperitivos', 'Sopas', 'Ensaladas', 'Bebidas'].map((tipo) => (
              <label key={tipo} className="filter-label">
                {tipo}
                <input
                  type="checkbox"
                  value={tipo}
                  checked={filters.tipoComida.includes(tipo)}
                  onChange={() => handleFilterChange('tipoComida', tipo)}
                />
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>Nivel de Dificultad</h4>
            {['Fácil', 'Intermedio', 'Difícil'].map((nivel) => (
              <label key={nivel} className="filter-label">
                {nivel}
                <input
                  type="checkbox"
                  value={nivel}
                  checked={filters.nivelDificultad.includes(nivel)}
                  onChange={() => handleFilterChange('nivelDificultad', nivel)}
                />
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>Ingrediente Principal</h4>
            {['Carne', 'Pollo', 'Pescado', 'Verduras', 'Frutas', 'Granos', 'Mariscos'].map((ingrediente) => (
              <label key={ingrediente} className="filter-label">
                {ingrediente}
                <input
                  type="checkbox"
                  value={ingrediente}
                  checked={filters.ingredientePrincipal.includes(ingrediente)}
                  onChange={() => handleFilterChange('ingredientePrincipal', ingrediente)}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="content">
          {filteredRecetas.length > 0 ? (
            <div className="recipes-list">
              {filteredRecetas.map((receta) => (
                <RecipeCard key={receta._id} receta={receta} />
              ))}
            </div>
          ) : (
            <p>No hay recetas que coincidan con los filtros seleccionados.</p>
          )}
        </div>
      </div>

      {showLogin && <Login setShowLogin={setShowLogin} />}
      {showUserInfo && <UserInfo user={userData} onClose={() => setShowUserInfo(false)} />}
    </div>
  );
};

export default Dashboard;