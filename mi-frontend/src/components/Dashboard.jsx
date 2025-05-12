import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import RecipePost from "./RecipePost";
import NavigationSidebar from "./NavigationSidebar";
import Footer from "./Footer";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [recommendedChefs, setRecommendedChefs] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authMessage, setAuthMessage] = useState(""); // ← authMessage añadido

  const { user , isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const showAuthMessage = (msg) => {
    setAuthMessage(msg);
    setTimeout(() => setAuthMessage(''), 2500);
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/recetas");
        setRecipes(response.data.reverse());
      } catch (error) {
        console.error("Error cargando recetas:", error);
        setError("No se pudieron cargar las recetas. Por favor intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    const fetchChefs = async () => {
      try {
        const response = await axios.get("/api/usuarios/chefs");
        const sorted = response.data
          .filter(chef => chef.seguidores)
          .sort((a, b) => (b.seguidores.length || 0) - (a.seguidores.length || 0))
          .slice(0, 5);
        setRecommendedChefs(sorted);
      } catch (error) {
        console.error("Error cargando chefs destacados:", error);
      }
    };

    fetchRecipes();
    fetchChefs();
  }, []);

  const filteredRecipes = recipes.filter((recipe) => {
    if (!recipe || !recipe.nombre) return false;
    return (
      recipe.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.descripcion?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const sortedRecipes = [...filteredRecipes].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const handleChefClick = (chefId) => {
    if (!isAuthenticated) {
      showAuthMessage("Debes iniciar sesión para ver el perfil del chef.");
      return;
    }
    if (user && user.id === chefId) {
      navigate("/perfil");
    } else {
      navigate(`/perfil/${chefId}`);
    }
  };

  const handleClickviewChefs = () => {
    if (!isAuthenticated) {
      console.log("No autenticado, redirigiendo a login...");
      showAuthMessage("Debes iniciar sesión para ver los chefs.");
      return;
    }
    navigate("/chefs");
  };

  return (
    <div className="recipe-app-layout">
      {authMessage && (
        <div className="auth-message" onClick={() => setAuthMessage("")}>
          {authMessage}
        </div>
      )}

      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        user={user}
      />

      <div className="main-content-dashboard">
        {/* Sidebar a la izquierda */}
        <NavigationSidebar />

        {/* Contenido principal */}
        <div className="center-column">
          <div className="full-post-view">
            {loading ? (
              <div className="loading">
                <div className="loading-spinner"></div>
                <p>Cargando recetas...</p>
              </div>
            ) : error ? (
              <div className="error">
                <h2>Error</h2>
                <p>{error}</p>
              </div>
            ) : sortedRecipes.length > 0 ? (
              sortedRecipes.map((recipe) => (
                <RecipePost
                  key={recipe._id}
                  recipe={recipe}
                  user={user}
                  showAuthMessage={showAuthMessage}
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

        {/* Columna de chefs recomendados */}
        <div className="right-column">
          <div className="suggestions-header">
            <span>Chefs destacados</span>
            <button onClick={handleClickviewChefs}>Ver todos</button>
          </div>
          <div className="recommended-chefs">
            {recommendedChefs.map((chef) => (
              <div
                className="dashboard-chef-card"
                key={chef._id}
                onClick={() => handleChefClick(chef._id)}
              >
                <div className="dashboard-chef-avatar">
                  <img
                    src={
                      chef.foto === "url_default_foto_perfil"
                        ? "https://res.cloudinary.com/dkpwnkhza/image/upload/v1741732506/usuarios/vwmsergnpyzw8ktvq8yg.png"
                        : chef.foto
                    }
                    alt={chef.username}
                  />
                </div>
                <div className="chef-info">
                  <span className="chef-username">{chef.username}</span>
                  <span className="chef-followers">
                    {chef.seguidores.length} seguidores
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
