import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
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
  const { token } = useAuth();

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
    try {
      const endpoint = isLiked ? 'unlike' : 'like';
      await axios.post(`/api/recetas/${recipe._id}/${endpoint}`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    } catch (error) {
      console.error('Error updating like:', error);
      setError('Error al actualizar like');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    try {
      const response = await axios.post(
        `/api/recetas/${recipe._id}/comentarios`, 
        { texto: commentText },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setComments(prev => [...prev, response.data]);
      setCommentText('');
      setError(null);
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError('Error al enviar comentario');
    }
  };

  if (!recipe._id) return null;

  return (
    <div className="social-post">
      <div className="recipe-post-container" onClick={toggleDetails}>
        <div className="post-header">
          <div className="user-info">
            <img 
              src={recipe.usuario?.avatar || '/default-avatar.png'} 
              alt="User"
              className="user-avatar"
            />
            <span className="username">{recipe.usuario?.username || 'Chef'}</span>
          </div>
        </div>

        <div className="post-image-container">
          <img 
            src={recipe.foto || '/default-recipe.jpg'} 
            alt={recipe.nombre}
            className="post-image"
          />
        </div>

        <div className="post-actions">
          <div className="action-buttons">
            <button 
              className={`like-button ${isLiked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              {isLiked ? '❤️' : '🤍'}
            </button>
            <button className="comment-button">💬</button>
          </div>
          <span className="likes-count">{likesCount} Me gusta</span>
        </div>

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
                {comments.length > 0 ? (
                  comments.map(comment => (
                    <div key={comment._id} className="comment">
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
            usuario: recipe.usuario || { username: 'Chef' }
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
    usuario: PropTypes.shape({
      _id: PropTypes.string,
      avatar: PropTypes.string,
      username: PropTypes.string
    })
  }),
  user: PropTypes.shape({
    id: PropTypes.string
  })
};

export default RecipePost;