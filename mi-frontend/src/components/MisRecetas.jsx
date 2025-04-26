import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Header from './Header';
import NavigationSideBar from './NavigationSidebar';
import Footer from './Footer';
import Modal from './ModalReceta';
import '../styles/MisRecetas.css';

const MisRecetas = () => {
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchRecetas = async () => {
      try {
        if (!isAuthenticated || !user?.id) {
          setError('Debes iniciar sesión para ver tus recetas');
          setLoading(false);
          return;
        }
        const response = await axios.get(`/api/recetas/getMyRecipes`, {
          withCredentials: true
        });
        setRecetas(response.data);
      } catch (err) {
        setError('No se pudieron cargar las recetas');
        console.error('Error al cargar recetas:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchRecetas();
    } else {
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  const handleEdit = (id) => {
    window.location.href = `/editar-receta/${id}`;
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta receta?')) {
      try {
        await axios.delete(`/api/recetas/${id}`, {
          withCredentials: true
        });
        setRecetas(recetas.filter(receta => receta._id !== id));
      } catch (err) {
        console.error('Error al eliminar receta:', err);
        alert('No se pudo eliminar la receta');
      }
    }
  };

  const handleAgregarReceta = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddRecipe = async (newRecipe) => {
    try {
      const response = await axios.post('/api/recetas', newRecipe, {
        withCredentials: true
      });
      setRecetas([...recetas, response.data]);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error al agregar receta:', err);
      alert('No se pudo agregar la receta');
    }
  };

  if (loading) return <div className="loading">Cargando recetas...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!isAuthenticated) return <div className="error">Debes iniciar sesión para ver esta página</div>;

  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <NavigationSideBar />
        <div className="mis-recetas-container">
          <h1>Mis Recetas</h1>
          <button className="agregar-receta-button" onClick={handleAgregarReceta}>
            + Agregar Receta
          </button>
          {recetas.length > 0 ? (
            <div className="recetas-grid">
              {recetas.map((receta) => (
                <div key={receta._id} className="receta-card">
                  <h3>{receta.nombre}</h3>
                  <img 
                    src={receta.foto || '/default-recipe.jpg'} 
                    alt={receta.nombre} 
                    className="receta-image"
                  />
                  <p>{receta.descripcion?.substring(0, 100)}...</p>
                  <div className="actions">
                    <button 
                      className="edit-button" 
                      onClick={() => handleEdit(receta._id)}
                    >
                      Editar
                    </button>
                    <button 
                      className="delete-button" 
                      onClick={() => handleDelete(receta._id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-recipes-message">No has subido ninguna receta aún.</p>
          )}
        </div>
      </div>
      <Footer />
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onAddRecipe={handleAddRecipe}
      />
    </div>
  );
};

export default MisRecetas;