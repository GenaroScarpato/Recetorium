import { useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/RecipeDetails.css';

const RecipeDetails = ({ 
  recipe = {}, 
  comments = [],
  onClose, 
  onCommentSubmit,
  commentText,
  onCommentChange,
  onLike,
  isLiked
}) => {
  console.log("🔍 Objeto recipe:", recipe);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!recipe._id) return null;

  const defaultImage = 'https://res.cloudinary.com/dkpwnkhza/image/upload/v1741732506/usuarios/vwmsergnpyzw8ktvq8yg.png';

  const profileImage =
    recipe.chef?.foto && recipe.chef.foto !== 'url_default_foto_perfil'
      ? recipe.chef.foto
      : defaultImage;

  const chefUsername = recipe.chef?.username || 'Chef';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>
          &times;
        </button>

        <div className="recipe-details-grid">
          {/* LADO IZQUIERDO */}
          <div className="recipe-left">
            <div className="recipe-header">
              <div className="user-info">
                <img
                  src={profileImage}
                  alt={`Foto de perfil de ${chefUsername}`}
                  className="user-avatar"
                />
                <span className="username">{chefUsername}</span>
              </div>
            </div>

            <div className="recipe-image-container">
              <img
                src={recipe.foto || defaultImage}
                alt={`Foto de la receta ${recipe.nombre}`}
                className="recipe-image"
              />
            </div>

            <div className="post-buttons-row">
              <button
                className={`like-button ${isLiked ? 'liked' : ''}`}
                onClick={onLike}
              >
                {isLiked ? '❤️' : '🤍'}
              </button>
              <button className="comment-button">💬</button>
            </div>
            <span className="likes-count">{recipe.likes || 0} Me gusta</span>

            <div className="recipe-content">
              <h1 className="recipe-title">{recipe.nombre}</h1>

              <p className="recipe-description">{recipe.descripcion}</p>

              <div className="recipe-meta">
                <div className="meta-item">⏱️ {recipe.tiempoPreparacion}</div>
                <div className="meta-item">⚡ {recipe.nivelDificultad}</div>
                <div className="meta-item">🍽️ {recipe.tipoComida}</div>
                <div className="meta-item">🌎 {recipe.tipoCocina}</div>
                <div className="meta-item">🔥 {recipe.metodoCoccion}</div>
                <div className="meta-item">🥩 {recipe.ingredientePrincipal}</div>
                {recipe.temporada && (
                  <div className="meta-item">🌤️ {recipe.temporada}</div>
                )}
              </div>

              <div className="ingredients-section">
                <h2>Ingredientes</h2>
                <ul className="ingredients-list">
                  {recipe.ingredientes?.map((ing, idx) => (
                    <li key={idx}>
                      {ing.cantidad} {ing.unidad} de{' '}
                      {ing.ingrediente?.nombre || 'Ingrediente'}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="instructions-section">
                <h2>Pasos</h2>
                <ol className="instructions-list">
                  {recipe.pasos
                    ?.sort((a, b) => a.orden - b.orden)
                    .map((paso, idx) => (
                      <li key={idx}>{paso.descripcion}</li>
                    ))}
                </ol>
              </div>
            </div>
          </div>

          {/* LADO DERECHO */}
          <div className="recipe-right">
            <div className="recipe-comments-section">
              <h2>Comentarios</h2>
              <div className="comments-list">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment._id} className="comment">
                      <img
                        src={comment.usuarioId?.foto || defaultImage}
                        alt={`Foto de ${comment.usuarioId?.username || 'Usuario'}`}
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
  recipe: PropTypes.object.isRequired,
  comments: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onCommentSubmit: PropTypes.func.isRequired,
  commentText: PropTypes.string.isRequired,
  onCommentChange: PropTypes.func.isRequired,
  onLike: PropTypes.func.isRequired,
  isLiked: PropTypes.bool.isRequired,
};

export default RecipeDetails;
