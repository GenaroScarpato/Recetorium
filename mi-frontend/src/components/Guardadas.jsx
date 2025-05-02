import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header'; // Asegúrate de tener este componente
import Sidebar from '../components/NavigationSidebar'; // Asegúrate de tener este componente
import Footer from '../components/Footer'; // Asegúrate de tener este componente
import RecipePost from '../components/RecipePost'; // Componente para mostrar una receta
import '../styles/guardadas.css';

const Misguardadas = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      try {
        // Solicitar las recetas guardadas del usuario
        const response = await axios.get(`/api/usuarios/${user.id}/recetas-guardadas`);
        setSavedRecipes(response.data); // Guardamos las recetas obtenidas en el estado
      } catch (error) {
        console.error('Error al cargar las recetas guardadas', error);
      }
    };

    // Si el usuario está autenticado, cargamos las recetas guardadas
    if (isAuthenticated) {
      fetchSavedRecipes();
    }
  }, [user, isAuthenticated, navigate]); // Dependencias del useEffect

  return (
    <div className="saved-recipes-page">
      <Header />
  
      <div className="content-wrapper">
        <Sidebar />
  
        <div className="recipes-section">
          <h3 className="recipes-title">Recetas Guardadas</h3>
  
          {savedRecipes.length === 0 ? (
            <p>No tienes recetas guardadas.</p>
          ) : (
            <div className="recipes-grid">
              {savedRecipes.map(recipe => (
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
