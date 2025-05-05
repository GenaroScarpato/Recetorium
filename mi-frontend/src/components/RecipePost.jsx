import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/RecipePost.css';
import RecipeDetails from './RecipeDetails';
import '@fortawesome/fontawesome-free/css/all.min.css';

const RecipePost = ({ recipe = {} }) => {
  const [commentText, setCommentText] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [comments, setComments] = useState([]);
  const [likesCount, setLikesCount] = useState(recipe.likes?.length || 0);
  const [loadingComments, setLoadingComments] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, updateSavedRecipes } = useAuth();

  const defaultImage = 'https://res.cloudinary.com/dkpwnkhza/image/upload/v1741732506/usuarios/vwmsergnpyzw8ktvq8yg.png';
  const profileImage = recipe.chef?.foto && recipe.chef.foto !== 'url_default_foto_perfil'
    ? recipe.chef.foto
    : defaultImage;

  const chefUsername = recipe.chef?.username || 'Chef';
  
  const showAuthMessage = (msg) => {
    setAuthMessage(msg);
    setTimeout(() => setAuthMessage(''), 2500); 
  };
  
  useEffect(() => {
    if (recipe.likes && user?.id) {
      setIsLiked(recipe.likes.includes(user.id));
    } else {
      setIsLiked(false); // ← importante para usuarios no logueados
    }
  
    if (user?.recetasGuardadas && recipe?._id) {
      setIsSaved(Array.isArray(user.recetasGuardadas) && user.recetasGuardadas.includes(recipe._id));
    } else {
      setIsSaved(false);
    }
  
    if (user?.siguiendo && recipe.chef?._id) {
      setIsFollowing(user.siguiendo.includes(recipe.chef._id));
    } else {
      setIsFollowing(false);
    }
  }, [recipe.likes, recipe._id, recipe.chef?._id, user]);
  

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoadingComments(true);
        setError(null);
        const response = await axios.get(`/api/recetas/${recipe._id}/comentarios`);
        setComments(response.data);
      } catch (error) {
        console.error('Error loading comments:', error);
        setError('Error al cargar comentarios');
        setComments([]);
      } finally {
        setLoadingComments(false);
      }
    };

    if (recipe._id) {
      fetchComments();
    }
  }, [recipe._id]);

  const toggleDetails = (e) => {
    if (e.target.closest('button') || e.target.classList.contains('comment-input')) return;
  
    if (!isAuthenticated) {
      showAuthMessage('Necesitas iniciar sesión para ver los detalles');
      return;
    }
  
    setShowDetails(!showDetails);
  };
  

  const handleLike = async () => {
    if (!isAuthenticated) {
      showAuthMessage('Necesitas iniciar sesión para realizar esta acción');
        return;
    }

    try {
      const endpoint = isLiked ? 'unlike' : 'like';
      await axios.post(
        `/api/recetas/${recipe._id}/${endpoint}`,
        {
          recetaId: recipe._id,
          userId: user?.id
        },
        { withCredentials: true }
      );
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    } catch (error) {
      console.error('Error updating like:', error);
      setError('Error al actualizar like');
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      showAuthMessage('Necesitas iniciar sesión para guardar recetas');
      return;
    }

    try {
      const endpoint = isSaved ? 'unsave' : 'save';
      await axios.post(
        `/api/usuarios/${endpoint}`,
        {
          recetaId: recipe._id,
          userId: user?.id
        },
        { withCredentials: true }
      );
      setIsSaved(!isSaved);
      updateSavedRecipes(recipe._id, isSaved ? 'unsave' : 'save');
    } catch (error) {
      console.error('Error saving recipe:', error);
      setError('Error al guardar receta');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showAuthMessage('Necesitas iniciar sesión para comentar');
      return;
    }

    if (!commentText.trim()) return;

    try {
      const response = await axios.post(
        `/api/recetas/${recipe._id}/comentarios`,
        { texto: commentText , recetaId: recipe._id },
        { withCredentials: true }
      );
      setComments(prev => [...prev, { ...response.data, isNew: true }]);
      setCommentText('');
      setError(null);
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError('Error al enviar comentario');
    }
  };

  const handleFollow = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      showAuthMessage('Necesitas iniciar sesión para realizar esta acción');
      return;
    }

    try {
        const endpoint = isFollowing ? '/unfollow' : '/follow'; 
        await axios({
            method: isFollowing ? 'delete' : 'post', 
            url: `/api/usuarios/${endpoint}`, 
            data: { 
                seguidorId: user?.id,
                usuarioId: recipe.chef._id,
            },
            withCredentials: true,
        });

        setIsFollowing(!isFollowing);
    } catch (error) {
        console.error('Error al actualizar el estado de seguimiento:', error);
        setError('Error al seguir usuario');
    }
  };

  const visibleComments = comments.slice(0, 2);

  if (!recipe || !recipe._id) return <div>Loading...</div>;

  return (
    <div className="social-post">
      <div className="recipe-post-container" onClick={toggleDetails}>
      {authMessage && (
  <div
    className="auth-message"
    onClick={() => setAuthMessage('')}
  >
    {authMessage}
  </div>
)}

        <div className="post-header">
        <div
  className="username-container"
  onClick={(e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      showAuthMessage('Necesitas iniciar sesión para ver el perfil');
      return;
    }
    navigate(`/perfil/${recipe.chef?._id}`);
  }}
>

            <img
              src={profileImage}
              alt={`Foto de ${chefUsername}`}
              className="user-avatar"
            />
            <span className="username">
              {chefUsername}
            </span>
          </div>

          {user?.id !== recipe.chef?._id && (
            <button className="follow-button" onClick={handleFollow}>
              {isFollowing ? 'Siguiendo' : 'Seguir'}
            </button>
          )}
        </div>

        <div className="post-image-container">
          <img
            src={recipe.foto || '/default-recipe.jpg'}
            alt={recipe.nombre}
            className="post-image"
          />
        </div>

        <div className="recipe-title">{recipe.nombre}</div>

        <div className="post-buttons-row">
          <div className="action-buttons">
            <button className={`like-button ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
              {isLiked ? '❤️' : '🤍'}
            </button>
            <button className="comment-button">💬</button>
          </div>

          <button
            className={`save-button ${isSaved ? 'saved' : ''}`}
            onClick={handleSave}
          >
            <i className={`fa${isSaved ? 's' : 'r'} fa-bookmark`}></i>
          </button>
        </div>

        <span className="likes-count">{likesCount} Me gusta</span>

        <div className="post-content">
          <p className="post-caption">{recipe.descripcion}</p>
        </div>

        <div className="comments-section">
          {error && <p className="error-message">{error}</p>}
          {loadingComments ? (
            <p>Cargando comentarios...</p>
          ) : (
            <>
              <div className="comments-list">
                {visibleComments.length > 0 ? (
                  visibleComments.map(comment => (
                    <div key={comment._id} className={`comment ${comment.isNew ? 'new' : ''}`}>
                      <p>
                        <span className="comment-user">
                          {comment.usuarioId?.username || 'Usuario'}
                        </span>
                        {`: ${comment.texto}`}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="no-comments">No hay comentarios aún</p>
                )}
              </div>

              {comments.length > 2 && (
                <button
                  className="view-all-comments"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDetails(true);
                  }}
                >
                  Ver todos los comentarios
                </button>
              )}

              <form onSubmit={handleCommentSubmit} className="comment-form">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Agrega un comentario..."
                  className="comment-input"
                />
                <button
                  type="submit"
                  className="comment-submit"
                  disabled={!commentText.trim()}
                >
                  Publicar
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {showDetails && (
        <RecipeDetails
          recipe={{
            ...recipe,
            likes: likesCount,
            chef: recipe.chef || { username: 'Chef' }
          }}
          comments={comments}
          onClose={() => setShowDetails(false)}
          onCommentSubmit={handleCommentSubmit}
          commentText={commentText}
          onCommentChange={(e) => setCommentText(e.target.value)}
          onLike={handleLike}
          isLiked={isLiked}
        />
      )}
    </div>
  );
};

RecipePost.propTypes = {
  recipe: PropTypes.shape({
    _id: PropTypes.string,
    nombre: PropTypes.string,
    foto: PropTypes.string,
    tiempoPreparacion: PropTypes.string,
    nivelDificultad: PropTypes.string,
    descripcion: PropTypes.string,
    likes: PropTypes.array,
    savedBy: PropTypes.array,
    chef: PropTypes.shape({
      _id: PropTypes.string,
      foto: PropTypes.string,
      username: PropTypes.string,
      role: PropTypes.string
    })
  }),
  user: PropTypes.shape({
    id: PropTypes.string
  })
};

export default RecipePost;
