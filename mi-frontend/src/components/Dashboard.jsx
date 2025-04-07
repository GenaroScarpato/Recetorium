import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Header from './Header';
import RecipePost from './RecipePost';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const recommendedChefs = [
    { username: 'chef_martin', followers: '152 seguidores', specialty: 'Cocina italiana' },
    { username: 'cocina_con_ana', followers: '98 seguidores', specialty: 'Postres saludables' },
    { username: 'el_rincon_del_chef', followers: '245 seguidores', specialty: 'Carnes y parrillas' },
    { username: 'recetas_veganas', followers: '320 seguidores', specialty: 'Comida vegana' },
    { username: 'sabores_del_mundo', followers: '187 seguidores', specialty: 'Cocina internacional' }
  ];

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/recetas');
        setRecipes(response.data);
      } catch (error) {
        console.error("Error cargando recetas:", error);
        setError("No se pudieron cargar las recetas. Por favor intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter(recipe => {
    if (!recipe || !recipe.nombre) return false;
    return recipe.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || 
           recipe.descripcion?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const sortedRecipes = [...filteredRecipes].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  if (loading) {
    return (
      <div className="recipe-app-layout">
        <Header 
          searchQuery={searchQuery} 
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          user={user}
        />
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Cargando las mejores recetas para ti...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recipe-app-layout">
        <Header 
          searchQuery={searchQuery} 
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          user={user}
        />
        <div className="error">
          <h2>¡Ups! Ocurrió un error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-app-layout">
      <Header 
        searchQuery={searchQuery} 
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        user={user}
      />
      
      <div className="main-content">
        {/* Columna izquierda - Menú */}
        <div className="left-column">
          <h2>RECETORIUM</h2>
          <nav className="navigation-menu">
            <ul>
              <li className="active">
                <span className="icon">🏠</span>
                <span>Inicio</span>
              </li>
              <li>
                <span className="icon">📖</span>
                <span>Mis recetas</span>
              </li>
              <li>
                <span className="icon">📚</span>
                <span>Guardadas</span>
              </li>
              <li>
                <span className="icon">👥</span>
                <span>Chefs</span>
              </li>
              <li>
                <span className="icon">👤</span>
                <span>Perfil</span>
              </li>
            </ul>
          </nav>
        </div>
        
        {/* Columna central - Recetas */}
        <div className="center-column">
          <div className="recipes-feed">
            {sortedRecipes.length > 0 ? (
              sortedRecipes.map(recipe => (
                <RecipePost 
                  key={recipe._id}
                  recipe={recipe}
                  user={user}
                />
              ))
            ) : (
              <div className="no-results">
                <div className="no-results-icon">🍽️</div>
                <h3 className="no-results-title">No se encontraron recetas</h3>
                <p>Intenta con otros términos de búsqueda</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Columna derecha - Chefs */}
        <div className="right-column">
          <div className="user-profile">
            
          
          </div>
          
          <div className="suggestions-header">
            <span>Chefs destacados</span>
            <button>Ver todos</button>
          </div>
          
          <div className="recommended-chefs">
            {recommendedChefs.map((chef, index) => (
              <div className="chef-card" key={index}>
                <div className="chef-avatar">
                  <img src={`https://i.pravatar.cc/150?img=${index + 10}`} alt={chef.username} />
                </div>
                <div className="chef-info">
                  <span className="chef-username">{chef.username}</span>
                  <span className="chef-followers">{chef.followers} • {chef.specialty}</span>
                </div>
                <button className="follow-button">Seguir</button>
              </div>
            ))}
          </div>
          
          <div className="footer-links">
            <div className="links-row">
              <a href="#">Información</a>
              <a href="#">Ayuda</a>
              <a href="#">Prensa</a>
            </div>
            <div className="links-row">
              <a href="#">Privacidad</a>
              <a href="#">Condiciones</a>
              <a href="#">Empleo</a>
            </div>
            <div className="copyright">© 2023 Recetorium</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;