import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/NavigationSidebar';
import Footer from '../components/Footer';
import RecipePost from '../components/RecipePost';
import '../styles/guardadas.css';

const Misguardadas = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      try {
        setLoading(true);
        const response = await axios.get(`/api/usuarios/${user.id}/recetas-guardadas`);
        setSavedRecipes(response.data);
      } catch (error) {
        console.error('Error al cargar las recetas guardadas', error);
        setError('No se pudieron cargar las recetas guardadas.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchSavedRecipes();
    }
  }, [user, isAuthenticated, navigate]);

  // 🔍 Filtrado igual que en Dashboard
  const filteredRecipes = savedRecipes.filter((receta) => {
    if (!receta || !receta.nombre) return false;
    return (
      receta.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receta.descripcion?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // 📅 Ordenar por fecha de creación
  const sortedRecipes = [...filteredRecipes].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="saved-recipes-page">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <div className="content-wrapper">
        <Sidebar />

        <div className="recipes-section">
          <h3 className="recipes-title">Recetas Guardadas</h3>

          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Cargando recetas...</p>
            </div>
          ) : error ? (
            <div className="error">
              <p>{error}</p>
            </div>
          ) : sortedRecipes.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">📦</div>
              <h3 className="no-results-title">No se encontraron recetas</h3>
              <p>Intenta con otros términos de búsqueda</p>
            </div>
          ) : (
            <div className="recipes-grid">
              {sortedRecipes.map((recipe) => (
                <RecipePost key={recipe._id} recipe={recipe} user={user} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Misguardadas;
