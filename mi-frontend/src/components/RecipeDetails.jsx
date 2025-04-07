import { useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/RecipeDetails.css';

const RecipeDetails = ({ 
  recipe = {}, 
  comments = [],
  onClose, 
  onCommentSubmit,
  commentText = '',
  onCommentChange,
  onLike,
  isLiked = false
}) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!recipe._id) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>
          &times;
        </button>
        
        <div className="recipe-details">
          <div className="recipe-header">
            <div className="user-info">
              <img 
                src={recipe.usuario?.avatar || '/default-avatar.png'} 
                alt={recipe.usuario?.username || 'Chef'} 
                className="user-avatar"
              />
              <span className="username">{recipe.usuario?.username || 'Chef'}</span>
            </div>
            <button 
              className={`like-button ${isLiked ? 'liked' : ''}`}
              onClick={onLike}
            >
              {isLiked ? '❤️' : '🤍'} {recipe.likes || 0}
            </button>
          </div>

          <div className="recipe-image-container">
            <img 
              src={recipe.foto || '/default-recipe.jpg'} 
              alt={recipe.nombre} 
              className="recipe-image"
            />
          </div>

          <div className="recipe-content">
            <h1 className="recipe-title">{recipe.nombre}</h1>
            <p className="recipe-description">{recipe.descripcion}</p>
            
            <div className="recipe-meta">
              <div className="meta-item">
                <span>⏱️ Tiempo:</span>
                <span>{recipe.tiempoPreparacion || 'No especificado'}</span>
              </div>
              <div className="meta-item">
                <span>⚡ Dificultad:</span>
                <span>{recipe.nivelDificultad || 'No especificada'}</span>
              </div>
            </div>

            <div className="recipe-comments-section">
              <h2>Comentarios</h2>
              <div className="comments-list">
                {comments.length > 0 ? (
                  comments.map(comment => (
                    <div key={comment._id} className="comment">
                      <img 
                        src={comment.usuarioId?.foto || '/default-avatar.png'} 
                        alt={comment.usuarioId?.username || 'Usuario'}
                        className="comment-avatar"
                      />
                      <div className="comment-content">
                        <span className="comment-username">
                          {comment.usuarioId?.username || 'Usuario'}
                        </span>
                        <p className="comment-text">{comment.texto}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-comments">No hay comentarios aún</p>
                )}
              </div>

              <form onSubmit={onCommentSubmit} className="comment-form">
                <input
                  type="text"
                  value={commentText}
                  onChange={onCommentChange}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

RecipeDetails.propTypes = {
  recipe: PropTypes.shape({
    _id: PropTypes.string,
    nombre: PropTypes.string,
    foto: PropTypes.string,
    tiempoPreparacion: PropTypes.string,
    nivelDificultad: PropTypes.string,
    descripcion: PropTypes.string,
    likes: PropTypes.number,
    usuario: PropTypes.shape({
      avatar: PropTypes.string,
      username: PropTypes.string
    })
  }),
  comments: PropTypes.array,
  onClose: PropTypes.func.isRequired,
  onCommentSubmit: PropTypes.func.isRequired,
  commentText: PropTypes.string,
  onCommentChange: PropTypes.func.isRequired,
  onLike: PropTypes.func.isRequired,
  isLiked: PropTypes.bool
};

export default RecipeDetails;