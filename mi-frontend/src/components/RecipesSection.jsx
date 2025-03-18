import PropTypes from 'prop-types';
import RecipeCard from './RecipeCard';
import Filters from './Filters';
import './Filters.css'; // Importar los estilos de los filtros

const RecipesSection = ({ filteredRecetas, filters, handleFilterChange, searchIngredient, setSearchIngredient, ingredientesFiltrados, activeFilter, toggleFilter }) => {
  return (
    <div className="recipes-section-container">
      <div className="filters-sidebar">
        <Filters
          filters={filters}
          handleFilterChange={handleFilterChange}
          searchIngredient={searchIngredient}
          setSearchIngredient={setSearchIngredient}
          ingredientesFiltrados={ingredientesFiltrados}
          activeFilter={activeFilter}
          toggleFilter={toggleFilter}
        />
      </div>
      <div className="recipes-content">
        <h2>Recetas</h2>
        {filteredRecetas.length > 0 ? (
          <div className="recipes-list">
            {filteredRecetas.map((receta) => (
              <RecipeCard key={receta._id} receta={receta} />
            ))}
          </div>
        ) : (
          <p>No hay recetas que coincidan con los filtros seleccionados.</p>
        )}
      </div>
    </div>
  );
};

RecipesSection.propTypes = {
  filteredRecetas: PropTypes.array.isRequired,
  filters: PropTypes.shape({
    tipoComida: PropTypes.arrayOf(PropTypes.string).isRequired,
    nivelDificultad: PropTypes.arrayOf(PropTypes.string).isRequired,
    ingredientes: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  handleFilterChange: PropTypes.func.isRequired,
  searchIngredient: PropTypes.string.isRequired,
  setSearchIngredient: PropTypes.func.isRequired,
  ingredientesFiltrados: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeFilter: PropTypes.string,
  toggleFilter: PropTypes.func.isRequired,
};

export default RecipesSection;