import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './RecipeCard.module.css'; // Importar CSS Modules

const RecipeCard = ({ receta }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/receta/${receta._id}`);
  };

  return (
    <div className={styles['recipe-card']} onClick={handleClick}>
      <img src={receta.foto} alt={receta.nombre} className={styles['recipe-image']} />
      <div className={styles['recipe-details']}>
        <h3 className={styles['recipe-name']}>{receta.nombre}</h3>
        <div className={styles['recipe-meta']}>
          <span className={styles['recipe-time']}>⏱️ {receta.tiempoPreparacion}</span>
          <span className={styles['recipe-difficulty']}>⚙️ {receta.nivelDificultad}</span>
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
    descripcion: PropTypes.string,
    tiempoPreparacion: PropTypes.string.isRequired,
    nivelDificultad: PropTypes.string.isRequired,
  }).isRequired,
};

export default RecipeCard;