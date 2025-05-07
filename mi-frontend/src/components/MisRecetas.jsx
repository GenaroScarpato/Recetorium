  import { useState, useEffect } from 'react';
  import axios from 'axios';
  import { useAuth } from '../context/AuthContext';
  import Header from './Header';
  import NavigationSideBar from './NavigationSidebar';
  import Footer from './Footer';
  import ModalReceta from './ModalReceta';
  import RecipeDetails from './RecipeDetails';
  import styles from '../styles/MisRecetas.module.css';

  const MisRecetas = () => {
    const [recetas, setRecetas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [editingRecipe, setEditingRecipe] = useState(null);
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

    const handleEdit = (recipe) => {
      setEditingRecipe(recipe);
      setIsModalOpen(true);
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
      setEditingRecipe(null);
      setIsModalOpen(true);
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
      setEditingRecipe(null);
    };

    const handleSaveRecipe = async (recetaData, recipeId) => {
      try {
        const formData = new FormData();
        
        // Agregar campos básicos
        formData.append('nombre', recetaData.nombre);
        formData.append('tipoComida', recetaData.tipoComida);
        formData.append('tipoCocina', recetaData.tipoCocina);
        formData.append('metodoCoccion', recetaData.metodoCoccion);
        formData.append('tiempoPreparacion', recetaData.tiempoPreparacion);
        formData.append('nivelDificultad', recetaData.nivelDificultad);
        formData.append('ingredientePrincipal', recetaData.ingredientePrincipal);
        formData.append('temporada', recetaData.temporada);

        // Agregar arrays como JSON
        formData.append('ingredientes', JSON.stringify(recetaData.ingredientes));
        formData.append('pasos', JSON.stringify(recetaData.pasos));

        // Manejar la imagen
        if (recetaData.foto instanceof File) {
          formData.append('foto', recetaData.foto);
        } else if (recetaData.foto) {
          formData.append('foto', recetaData.foto);
        }

        let response;
        
        if (recipeId) {
          // Actualizar receta existente
          response = await axios.patch(`/api/recetas/${recipeId}`, formData, {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          // Actualizar la lista de recetas
          setRecetas(recetas.map(receta => 
            receta._id === recipeId ? response.data.updatedReceta : receta
          ));
        } else {
          // Crear nueva receta
          formData.append('chef', user.id);
          response = await axios.post('/api/recetas', formData, {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          // Agregar la nueva receta a la lista
          setRecetas([...recetas, response.data.receta]);
        }

        setIsModalOpen(false);
      } catch (err) {
        console.error('Error al guardar receta:', err);
        if (err.response?.data?.message) {
          alert(`Error: ${err.response.data.message}`);
        } else {
          alert('No se pudo guardar la receta (error inesperado)');
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
                      onClick={() => handleViewDetails(receta)}
                    />
                    <div className={styles.interactions}>
                      <p className={styles.likesComments}>
                        <span className={styles.likes}>
                          {receta.likes?.length || 0} 
                          ❤️
                        </span>
                        <span className={styles.comments}>
                          {receta.comments?.length || 0} 
                          💬
                        </span>
                      </p>
                    </div>
                    <div className={styles.actions}>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEdit(receta)}
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
            onCommentSubmit={() => {}}
            commentText={''}
            onCommentChange={() => {}}
            onLike={() => {}}
            isLiked={false}
          />
        )}
    
        {/* Modal para agregar/editar receta */}
        <ModalReceta
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddRecipe={handleSaveRecipe}
          isEditing={!!editingRecipe}
          existingRecipe={editingRecipe}
        />
      </div>
    );
  };

  export default MisRecetas;