import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/RecipePost.css';
import RecipeDetails from './RecipeDetails';

const RecipePost = ({ recipe = {}, user = null }) => {
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(recipe.likes?.includes(user?.id) || false);
  const [showDetails, setShowDetails] = useState(false);
  const [comments, setComments] = useState([]);
  const [likesCount, setLikesCount] = useState(recipe.likes?.length || 0);
  const [loadingComments, setLoadingComments] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const defaultImage = 'https://res.cloudinary.com/dkpwnkhza/image/upload/v1741732506/usuarios/vwmsergnpyzw8ktvq8yg.png';
  const profileImage = recipe.chef?.foto && recipe.chef.foto !== 'url_default_foto_perfil'
    ? recipe.chef.foto
    : defaultImage;

  const chefUsername = recipe.chef?.username || 'Chef';

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
        {},
        { withCredentials: true }
      );
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    } catch (error) {
      console.error('Error updating like:', error);
      setError('Error al actualizar like');
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

  if (!recipe._id) return null;

  // Mostrar solo los primeros 2 comentarios
  const visibleComments = comments.slice(0, 2);

  return (
    <div className="social-post">
      <div className="recipe-post-container" onClick={toggleDetails}>
        <div className="post-header">
          <a href={`/perfil/${recipe.chef?._id}`} className="username-container" onClick={(e) => e.stopPropagation()}>
            <img 
              src={profileImage}
              alt={`Foto de ${chefUsername}`}
              className="user-avatar"
            />
            <span className="username">
              {chefUsername}
              {recipe.chef?.role === 'CHEF' && (
                <span className="verified-badge" title="Chef verificado">✔</span>
              )}
            </span>
          </a>
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
          <button
            className={`like-button ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            {isLiked ? '❤️' : '🤍'}
          </button>
          <button className="comment-button">💬</button>
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
                    setShowDetails(true); // Mostrar el modal completo
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
