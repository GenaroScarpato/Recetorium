import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const HeroSection = ({ featuredRecipe }) => {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <h1 className="hero-title">Descubre el placer de cocinar</h1>
      <p className="hero-subtitle">
        Miles de recetas para todos los gustos y ocasiones. Desde platos sencillos hasta creaciones gourmet.
      </p>
      <button 
        className="hero-button"
        onClick={() => navigate(featuredRecipe ? `/receta/${featuredRecipe.id}` : '/recetas')}
      >
        {featuredRecipe ? featuredRecipe.name : 'Explorar recetas'}
      </button>
    </section>
  );
};

HeroSection.propTypes = {
  featuredRecipe: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  })
};

export default HeroSection;