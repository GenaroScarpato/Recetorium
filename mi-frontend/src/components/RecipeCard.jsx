import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './RecipeCard.module.css';

const RecipeCard = ({ receta }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/receta/${receta._id}`);
  };

  return (
    <div className="recipe-card" onClick={handleClick}>
      <img src={receta.foto} alt={receta.nombre} className="recipe-image" />
      <div className="recipe-details">
        <h3 className="recipe-name">{receta.nombre}</h3>
        <div className="recipe-meta">
          <span className="recipe-time">⏱️ {receta.tiempoPreparacion}</span>
          <span className="recipe-difficulty">⚙️ {receta.nivelDificultad}</span>
        </div>
      </div>
    </div>
  );
};

RecipeCard.propTypes = {
  receta: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    foto: PropTypes.string.isRequired,
    nombre: PropTypes.string.isRequired,
    descripcion: PropTypes.string, // Cambiado a no requerido
    tiempoPreparacion: PropTypes.string.isRequired,
    nivelDificultad: PropTypes.string.isRequired,
  }).isRequired,
};

export default RecipeCard;