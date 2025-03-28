import { useState } from 'react'; // Importar useState para manejar el estado de la búsqueda
import PropTypes from 'prop-types';
import RecipeCard from './RecipeCard';
import Filters from './Filters';
import '../styles/Filters.css'; // Importar los estilos de los filtros

const RecipesSection = ({ filteredRecetas, filters, handleFilterChange, searchIngredient, setSearchIngredient, ingredientesFiltrados, activeFilter, toggleFilter }) => {
  // Estado para almacenar el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Función para filtrar las recetas por nombre
  const searchRecipes = (recetas, term) => {
    if (!term) return recetas; // Si no hay término de búsqueda, devolver todas las recetas
    return recetas.filter((receta) =>
      receta.nombre.toLowerCase().includes(term.toLowerCase())
    );
  };

  // Filtrar las recetas según el término de búsqueda
  const searchedRecetas = searchRecipes(filteredRecetas, searchTerm);

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
        { 
        /* Barra de búsqueda */
         
        }
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar recetas por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {searchedRecetas.length > 0 ? (
          <div className="recipes-list">
            {searchedRecetas.map((receta) => (
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