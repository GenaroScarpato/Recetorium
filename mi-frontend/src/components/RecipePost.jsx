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

  useEffect(() => {
    if (recipe.likes && user?.id) {
      setIsLiked(recipe.likes.includes(user.id));
    }

    if (user?.recetasGuardadas && recipe?._id) {
      setIsSaved(
        Array.isArray(user.recetasGuardadas) &&
        user.recetasGuardadas.includes(recipe._id)
      );
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
    setShowDetails(!showDetails);
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const endpoint = isLiked ? 'unlike' : 'like';
      await axios.post(
        `/api/recetas/${recipe._id}/${endpoint}`,
        {
          recetaId: recipe._id,
          userId: user.id
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
      navigate('/login');
      return;
    }

    try {
      const endpoint = isSaved ? 'unsave' : 'save';
      await axios.post(
        `/api/usuarios/${endpoint}`,
        {
          recetaId: recipe._id,
          userId: user.id
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
      navigate('/login');
      return;
    }

    if (!commentText.trim()) return;

    try {
      const response = await axios.post(
        `/api/recetas/${recipe._id}/comentarios`,
        { texto: commentText },
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
        navigate('/login');
        return;
    }

    try {
        const endpoint = isFollowing ? '/unfollow' : '/follow'; // Cambié aquí el endpoint
        // Realiza la solicitud a la API de seguimiento o dejar de seguir
        await axios({
            method: isFollowing ? 'delete' : 'post', // Usa DELETE para unfollow, POST para follow
            url: `/api/usuarios/${endpoint}`, 
            data: { 
                seguidorId: user.id, // ID del usuario autenticado
                usuarioId: recipe.chef._id, // ID del usuario objetivo (chef)
            },
            withCredentials: true, // Para mantener las cookies (sesión)
        });

        // Actualiza el estado para reflejar si el usuario está siguiendo o no
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
        <div className="post-header">
          <div
            className="username-container"
            onClick={(e) => {
              e.stopPropagation();
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
