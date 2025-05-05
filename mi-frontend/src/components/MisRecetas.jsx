import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Header from './Header';
import NavigationSideBar from './NavigationSidebar';
import Footer from './Footer';
import Modal from './ModalReceta';
import RecipeDetails from './RecipeDetails'; // Asegúrate de que este componente esté disponible
import styles from '../styles/MisRecetas.module.css';
import { useNavigate } from 'react-router-dom';
const MisRecetas = () => {
  const navigate = useNavigate();
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
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
    navigate(`/editar-receta/${id}`); // ✅ Navegación fluida sin recarga
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

  const handleAddRecipe = async (receta) => {
    try {
      const formData = new FormData();
      formData.append('chef', user.id);
      formData.append('nombre', receta.nombre);
      formData.append('tipoComida', receta.tipoComida);
      formData.append('tipoCocina', receta.tipoCocina);
      formData.append('metodoCoccion', receta.metodoCoccion);
      formData.append('tiempoPreparacion', receta.tiempoPreparacion);
      formData.append('nivelDificultad', receta.nivelDificultad);
      formData.append('ingredientePrincipal', receta.ingredientePrincipal);
      formData.append('temporada', receta.temporada);

      formData.append('ingredientes', JSON.stringify(receta.ingredientes));
      formData.append('pasos', JSON.stringify(receta.pasos));

      if (receta.foto instanceof File) {
        formData.append('foto', receta.foto);
      } else {
        formData.append('foto', receta.foto || '');
      }

      const response = await axios.post('/api/recetas', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setRecetas([...recetas, response.data.receta]);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error al agregar receta:', err);
      if (err.response?.data?.message) {
        alert(`Error: ${err.response.data.message}`);
      } else {
        alert('No se pudo agregar la rece ta (error inesperado)');
      }
    }
  };

  const handleViewDetails = (receta) => {
    setSelectedRecipe(receta);
    setShowDetails(true);
  };

  if (loading) return <div className={styles.loading}>Cargando recetas...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!isAuthenticated) return <div className={styles.error}>Debes iniciar sesión para ver esta página</div>;

  return (
    <div className={styles.appContainer}>
      <Header />
      <div className={styles.mainContent}>
        <NavigationSideBar />
        <div className={styles.misRecetasContainer}>
          <h1>Mis Recetas</h1>
          <button
            className={styles.agregarRecetaButton}
            onClick={handleAgregarReceta}
          >
            + Agregar Receta
          </button>
  
          {recetas.length > 0 ? (
            <div className={styles.recetasGrid}>
              {recetas.map((receta) => (
                <div key={receta._id} className={styles.recetaCard}>
                  <h3>{receta.nombre}</h3>
                  <img
                    src={receta.foto || '/default-recipe.jpg'}
                    alt={receta.nombre}
                    className={styles.recetaImage}
                    onClick={() => handleViewDetails(receta)} // Al hacer click muestra los detalles
                  />
                  <div className={styles.interactions}>
                    <p className={styles.likesComments}>
                      <span className={styles.likes}>
                         {receta.likes?.length || 0} 
                         ❤️
                         Me gusta
                      </span>
                      <span className={styles.comments}>
                        {receta.comments?.length || 0} 
                        💬
                        Comentarios
                      </span>
                    </p>
                  </div>
                  <div className={styles.actions}>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEdit(receta._id)}
                    >
                      Editar
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(receta._id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noRecipesMessage}>
              ¡Aún no has subido ninguna receta! 🤔
            </p>
          )}
        </div>
      </div>
      <Footer />
  
      {/* Modal de detalles de receta */}
      {showDetails && selectedRecipe && (
        <RecipeDetails
          recipe={{
            ...selectedRecipe,
            likes: selectedRecipe.likes?.length || 0,
            chef: selectedRecipe.chef || { username: 'Chef' }
          }}
          comments={selectedRecipe.comments || []}
          onClose={() => setShowDetails(false)}
          onCommentSubmit={() => {}} // Si permites comentarios desde aquí
          commentText={''}            // Lógica de comentarios
          onCommentChange={() => {}}  // Lógica de comentarios
          onLike={() => {}}           // Si permites likes aquí
          isLiked={false}             // Si vas a manejar si la receta fue likeada
        />
      )}
  
      {/* Modal para agregar nueva receta */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddRecipe={handleAddRecipe}
      />
    </div>
  );
  
}
export default MisRecetas;
