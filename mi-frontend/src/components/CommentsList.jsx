import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const CommentsList = ({ recetaId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        console.log('Cargando comentarios...   ', recetaId);
        const response = await axios.get(`/api/recetas/${recetaId}/comentarios`);
        setComments(response.data);
        console.log('Comentarios obtenidos:', response.data);
      } catch (err) {
        setError('Error al cargar comentarios');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [recetaId]);

  if (loading) return <p>Cargando comentarios...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="comments-list">
      {comments.length > 0 ? (
        comments.map(comment => (
          <div key={comment._id} className="comment">
            <p>
              <span className="comment-user">{comment.usuarioId?.username || 'Usuario'}</span>
              {comment.texto}
            </p>
          </div>
        ))
      ) : (
        <p className="no-comments">No hay comentarios aún</p>
      )}
    </div>
  );
};

CommentsList.propTypes = {
  recetaId: PropTypes.string.isRequired,
};

export default CommentsList;
