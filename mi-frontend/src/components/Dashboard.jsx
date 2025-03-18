import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from './Login';
import UserInfo from './UserInfo';
import './Dashboard.css';
import axios from 'axios';
import Register from './Register';
import Filters from './Filters'; // Importar el componente Filters
import RecipeCard from './RecipeCard'; // Importar el componente RecipeCard
import setupAxiosInterceptors from '../utils/axiosConfig'; // Importa el interceptor

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
    ingredientes: [],
  });
  const [searchIngredient, setSearchIngredient] = useState('');
  const [ingredientesDisponibles, setIngredientesDisponibles] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [activeSection, setActiveSection] = useState('recetas');
  const navigate = useNavigate();

  // Configura el interceptor de axios
  useEffect(() => {
    setupAxiosInterceptors(logout); // Pasa la función logout al interceptor
  }, [logout]);

  // Obtener los ingredientes desde la API
  useEffect(() => {
    fetch('http://localhost:3000/api/ingredientes')
      .then((response) => response.json())
      .then((data) => {
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
      credentials: 'include',
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
        updatedFilters[filterType] = updatedFilters[filterType].filter((item) => item !== value);
      } else {
        updatedFilters[filterType] = [...updatedFilters[filterType], value];
      }
      return updatedFilters;
    });
  };

  // Función para mostrar la información del usuario
  const handleUserInfoClick = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/usuarios/${user.id}`, {
        withCredentials: true, // Incluir cookies
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Incluir el token en el encabezado
        },
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
    const contieneTodosLosIngredientes = filters.ingredientes.every((ingredienteSeleccionado) => {
      return receta.ingredientes.some((ingredienteReceta) => 
        ingredienteReceta.ingrediente.nombre === ingredienteSeleccionado
      );
    });

    return (
      (filters.tipoComida.length === 0 || filters.tipoComida.includes(receta.tipoComida)) &&
      (filters.nivelDificultad.length === 0 || filters.nivelDificultad.includes(receta.nivelDificultad)) &&
      (filters.ingredientes.length === 0 || contieneTodosLosIngredientes)
    );
  });

  // Función para alternar el filtro activo
  const toggleFilter = (filterType) => {
    setActiveFilter(activeFilter === filterType ? null : filterType);
  };

  // Función para renderizar el contenido según la sección activa
  const renderContent = () => {
    switch (activeSection) {
      case 'perfil':
        return (
          <div className="content">
            <h2>Perfil</h2>
            <p>Aquí puedes ver y editar tu información de perfil.</p>
            {/* Aquí puedes agregar más contenido relacionado con el perfil */}
          </div>
        );
      case 'recetas':
        return (
          <div className="recipes-section-container">
            <div className="filters-sidebar">
              <Filters
                filters={filters}
                handleFilterChange={handleFilterChange}
                searchIngredient={searchIngredient}
                setSearchIngredient={setSearchIngredient}
                ingredientesFiltrados={ingredientesFiltrados}
                activeFilter={activeFilter}
                toggleFilter={toggleFilter}
              />
            </div>
            <div className="recipes-content">
              <h2>Recetas</h2>
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
        );
      case 'coleccion':
        return (
          <div className="content">
            <h2>Mi Colección</h2>
            <p>Aquí puedes ver las recetas que has guardado en tu colección.</p>
            {/* Aquí puedes agregar más contenido relacionado con la colección */}
          </div>
        );
      default:
        return <div className="content">Selecciona una sección</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <img src="../public/icono.png" alt="Icono" className="header-icon" />
        <div className="navigation-menu">
          <ul className="sidebar-menu">
            <li>
              <a href="#perfil" onClick={() => setActiveSection('perfil')}>
                Perfil
              </a>
            </li>
            <li>
              <a href="#recetas" onClick={() => setActiveSection('recetas')}>
                Recetas
              </a>
            </li>
            <li>
              <a href="#coleccion" onClick={() => setActiveSection('coleccion')}>
                Mi Colección
              </a>
            </li>
          </ul>
        </div>
        <div className="auth-buttons">
          {isAuthenticated && user ? (
            <div className="user-info">
              <button className="user-name" onClick={handleUserInfoClick}>
                Bienvenido, {user.username}
              </button>
              <button onClick={handleLogout} className="logout-btn">
                Cerrar sesión
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
        {renderContent()}
      </div>

      {showLogin && <Login setShowLogin={setShowLogin} />}
      {showUserInfo && <UserInfo user={userData} onClose={() => setShowUserInfo(false)} />}
      {showRegister && <Register setShowRegister={setShowRegister} />}
    </div>
  );
};

export default Dashboard;