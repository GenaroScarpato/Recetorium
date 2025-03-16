import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from './Login';
import RecipeCard from './RecipeCard';
import UserInfo from './UserInfo';
import './Dashboard.css';
import axios from 'axios';
import Register from './Register';

const Dashboard = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [recetas, setRecetas] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [userData, setUserData] = useState(null);
  const [filters, setFilters] = useState({
    tipoComida: [],
    nivelDificultad: [],
    ingredientes: [], // Cambiamos "ingredientePrincipal" a "ingredientes"
  });
  const [searchIngredient, setSearchIngredient] = useState('');
  const [ingredientesDisponibles, setIngredientesDisponibles] = useState([]); // Estado para almacenar los ingredientes
  const navigate = useNavigate();

  // Obtener los ingredientes desde la API
  useEffect(() => {
    fetch('http://localhost:3000/api/ingredientes')
      .then((response) => response.json())
      .then((data) => {
        // Extraer solo los nombres de los ingredientes
        const nombresIngredientes = data.map((ingrediente) => ingrediente.nombre);
        setIngredientesDisponibles(nombresIngredientes);
      })
      .catch((error) => console.error('Error al obtener los ingredientes:', error));
  }, []);

  // Filtrar ingredientes según la búsqueda
  const ingredientesFiltrados = ingredientesDisponibles.filter((ingrediente) =>
    ingrediente.toLowerCase().includes(searchIngredient.toLowerCase())
  );

  // Obtener las recetas desde la API
  useEffect(() => {
    fetch('http://localhost:3000/api/recetas', {
      credentials: 'include', // Incluir cookies en la solicitud
    })
      .then((response) => response.json())
      .then((data) => setRecetas(data))
      .catch((error) => console.error('Error al obtener las recetas:', error));
  }, []);

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Función para manejar cambios en los filtros
  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (updatedFilters[filterType].includes(value)) {
        // Si el valor ya está en los filtros, lo removemos
        updatedFilters[filterType] = updatedFilters[filterType].filter((item) => item !== value);
      } else {
        // Si el valor no está en los filtros, lo agregamos
        updatedFilters[filterType] = [...updatedFilters[filterType], value];
      }
      return updatedFilters;
    });
  };

  // Función para mostrar la información del usuario
  const handleUserInfoClick = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/usuarios/${user.id}`, {
        withCredentials: true, // Asegúrate de incluir las cookies
      });
      setUserData(response.data);
      setShowUserInfo(true);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('No autorizado: Token inválido o expirado');
        alert('No autorizado: Por favor, inicia sesión nuevamente.');
      } else {
        console.error('Error al obtener los datos del usuario:', error);
      }
    }
  };

  // Función de filtrado corregida
  const filteredRecetas = recetas.filter((receta) => {
    // Verificar si la receta contiene todos los ingredientes seleccionados
    const contieneTodosLosIngredientes = filters.ingredientes.every((ingredienteSeleccionado) => {
      return receta.ingredientes.some((ingredienteReceta) => 
        ingredienteReceta.ingrediente.nombre === ingredienteSeleccionado
      );
    });

    // Verificar si la receta cumple con todos los filtros
    return (
      (filters.tipoComida.length === 0 || filters.tipoComida.includes(receta.tipoComida)) &&
      (filters.nivelDificultad.length === 0 || filters.nivelDificultad.includes(receta.nivelDificultad)) &&
      (filters.ingredientes.length === 0 || contieneTodosLosIngredientes)
    );
  });

  return (
    <div className="dashboard-container">
      <div className="header">
        <img src="../public/icono.png" alt="Icono" className="header-icon" />
        <div className="auth-buttons">
          {isAuthenticated && user ? (
            <div className="user-info">
              <button className="user-name" onClick={handleUserInfoClick}>
                Bienvenido, {user.username}
              </button>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <>
              <button className="login-btn" onClick={() => setShowLogin(true)}>
                Login
              </button>
              <button className="register-btn" onClick={() => setShowRegister(true)}>
                Register
              </button>
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
            <h4>Ingredientes</h4>
            <input
              type="text"
              placeholder="Buscar ingredientes..."
              onChange={(e) => setSearchIngredient(e.target.value)}
            />
            {ingredientesFiltrados.map((ingrediente) => (
              <label key={ingrediente} className="filter-label">
                {ingrediente}
                <input
                  type="checkbox"
                  value={ingrediente}
                  checked={filters.ingredientes.includes(ingrediente)}
                  onChange={() => handleFilterChange('ingredientes', ingrediente)}
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
      {showRegister && <Register setShowRegister={setShowRegister} />}
    </div>
  );
};

export default Dashboard;