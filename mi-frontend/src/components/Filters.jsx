import PropTypes from 'prop-types';
import '../styles/Filters.css'; // Importar los estilos de los filtros

const Filters = ({ filters, handleFilterChange, setSearchIngredient, ingredientesFiltrados, activeFilter, toggleFilter }) => {
  // Función para manejar la eliminación de un filtro seleccionado
  const removeFilter = (filterType, value) => {
    handleFilterChange(filterType, value); // Simplemente llamamos a handleFilterChange para eliminar el filtro
  };

  // Limitar la lista de ingredientes a 5
  const limitedIngredientes = ingredientesFiltrados.slice(0, 5);

  return (
    <div className="filters-container">
      {/* Filtro: Tipo de Comida */}
      <div className="filter-group">
        <button
          className={`filter-button ${activeFilter === 'tipoComida' ? 'active' : ''}`}
          onClick={() => toggleFilter('tipoComida')}
        >
          Tipo de Comida
        </button>
        {activeFilter === 'tipoComida' && (
          <div className="filter-content">
            {['Entradas', 'Platos principales', 'Postres', 'Aperitivos', 'Sopas', 'Ensaladas', 'Bebidas'].map((tipo) => (
              <label key={tipo} className="filter-label">
                {tipo}
                <input
                  type="checkbox"
                  value={tipo}
                  checked={filters.tipoComida.includes(tipo)}
                  onChange={() => handleFilterChange('tipoComida', tipo)}
                />
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Filtro: Nivel de Dificultad */}
      <div className="filter-group">
        <button
          className={`filter-button ${activeFilter === 'nivelDificultad' ? 'active' : ''}`}
          onClick={() => toggleFilter('nivelDificultad')}
        >
          Nivel de Dificultad
        </button>
        {activeFilter === 'nivelDificultad' && (
          <div className="filter-content">
            {['Fácil', 'Intermedio', 'Difícil'].map((nivel) => (
              <label key={nivel} className="filter-label">
                {nivel}
                <input
                  type="checkbox"
                  value={nivel}
                  checked={filters.nivelDificultad.includes(nivel)}
                  onChange={() => handleFilterChange('nivelDificultad', nivel)}
                />
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Filtro: Ingredientes */}
      <div className="filter-group">
        <button
          className={`filter-button ${activeFilter === 'ingredientes' ? 'active' : ''}`}
          onClick={() => toggleFilter('ingredientes')}
        >
          Ingredientes
        </button>
        {activeFilter === 'ingredientes' && (
          <div className="filter-content">
            <input
              type="text"
              placeholder="Buscar ingredientes..."
              onChange={(e) => setSearchIngredient(e.target.value)}
            />
            {limitedIngredientes.map((ingrediente) => (
              <label key={ingrediente} className="filter-label">
                {ingrediente}
                <input
                  type="checkbox"
                  value={ingrediente}
                  checked={filters.ingredientes.includes(ingrediente)}
                  onChange={() => handleFilterChange('ingredientes', ingrediente)}
                />
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Mostrar directamente los filtros seleccionados */}
      <div className="selected-filters-container">
        {filters.tipoComida.map((tipo) => (
          <div
            key={tipo}
            className="selected-filter"
            onClick={() => removeFilter('tipoComida', tipo)}
          >
            {tipo} <span>×</span>
          </div>
        ))}
        {filters.nivelDificultad.map((nivel) => (
          <div
            key={nivel}
            className="selected-filter"
            onClick={() => removeFilter('nivelDificultad', nivel)}
          >
            {nivel} <span>×</span>
          </div>
        ))}
        {filters.ingredientes.map((ingrediente) => (
          <div
            key={ingrediente}
            className="selected-filter"
            onClick={() => removeFilter('ingredientes', ingrediente)}
          >
            {ingrediente} <span>×</span>
          </div>
        ))}
      </div>
    </div>
  );
};

Filters.propTypes = {
  filters: PropTypes.shape({
    tipoComida: PropTypes.arrayOf(PropTypes.string).isRequired,
    nivelDificultad: PropTypes.arrayOf(PropTypes.string).isRequired,
    ingredientes: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  handleFilterChange: PropTypes.func.isRequired,
  setSearchIngredient: PropTypes.func.isRequired,
  ingredientesFiltrados: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeFilter: PropTypes.string,
  toggleFilter: PropTypes.func.isRequired,
};

export default Filters;