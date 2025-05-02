import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Header from "./Header";
import RecipePost from "./RecipePost";
import NavigationSidebar from "./NavigationSidebar";
import Footer from "./Footer";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  const recommendedChefs = [
    {
      username: "chef_martin",
      followers: "152 seguidores",
      specialty: "Cocina italiana",
    },
    {
      username: "cocina_con_ana",
      followers: "98 seguidores",
      specialty: "Postres saludables",
    },
    {
      username: "el_rincon_del_chef",
      followers: "245 seguidores",
      specialty: "Carnes y parrillas",
    },
    {
      username: "recetas_veganas",
      followers: "320 seguidores",
      specialty: "Comida vegana",
    },
    {
      username: "sabores_del_mundo",
      followers: "187 seguidores",
      specialty: "Cocina internacional",
    },
  ];

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/recetas");
        setRecipes(response.data);
      } catch (error) {
        console.error("Error cargando recetas:", error);
        setError("No se pudieron cargar las recetas. Por favor intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };
  
    if (isAuthenticated) {
      fetchRecipes();
    }
  }, [isAuthenticated]); // Añade isAuthenticated como dependencia

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

  return (
    <div className="recipe-app-layout">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        user={user}
      />

      {/* Columna izquierda */}
      <div className="main-content-dashboard">
        <NavigationSidebar />

        {/* Columna central */}
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
                <RecipePost key={recipe._id} recipe={recipe} user={user}  />
 


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

        {/* Columna derecha */}
        <div className="right-column">
          <div className="suggestions-header">
            <span>Chefs destacados</span>
            <button>Ver todos</button>
          </div>
          <div className="recommended-chefs">
            {recommendedChefs.map((chef, index) => (
              <div className="chef-card" key={index}>
                <div className="chef-avatar">
                  <img
                    src={`https://i.pravatar.cc/150?img=${index + 10}`}
                    alt={chef.username}
                  />
                </div>
                <div className="chef-info">
                  <span className="chef-username">{chef.username}</span>
                  <span className="chef-followers">
                    {chef.followers} • {chef.specialty}
                  </span>
                </div>
                <button className="follow-button">Seguir</button>
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
