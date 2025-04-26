import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import '../styles/ModalReceta.css';

const ModalReceta = ({ isOpen, onClose, onAddRecipe }) => {
  const [nombre, setNombre] = useState('');
  const [tipoComida, setTipoComida] = useState('');
  const [tipoCocina, setTipoCocina] = useState('');
  const [ingredientes, setIngredientes] = useState([{ ingrediente: '', cantidad: '', unidad: '' }]);
  const [metodoCoccion, setMetodoCoccion] = useState('');
  const [tiempoPreparacion, setTiempoPreparacion] = useState('');
  const [nivelDificultad, setNivelDificultad] = useState('');
  const [ingredientePrincipal, setIngredientePrincipal] = useState('');
  const [temporada, setTemporada] = useState('Todo el año');
  const [pasos, setPasos] = useState([{ orden: 1, descripcion: '' }]);
  const [foto, setFoto] = useState('');
  const [error, setError] = useState('');
  const [allIngredients, setAllIngredients] = useState([]);
  const [loadingIngredients, setLoadingIngredients] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchIngredients();
    }
  }, [isOpen]);

  const fetchIngredients = async () => {
    try {
      setLoadingIngredients(true);
      const response = await axios.get('http://localhost:3000/api/ingredientes');
      setAllIngredients(response.data);
    } catch (err) {
      console.error('Error al cargar ingredientes:', err);
      setError('No se pudieron cargar los ingredientes');
    } finally {
      setLoadingIngredients(false);
    }
  };

  const handleIngredienteChange = (index, field, value) => {
    const updatedIngredientes = [...ingredientes];
    updatedIngredientes[index][field] = value;
    setIngredientes(updatedIngredientes);
  };

  const handleAddIngrediente = () => {
    setIngredientes([...ingredientes, { ingrediente: '', cantidad: '', unidad: '' }]);
  };

  const handleRemoveIngrediente = (index) => {
    const updatedIngredientes = ingredientes.filter((_, i) => i !== index);
    setIngredientes(updatedIngredientes);
  };

  const handleAddPaso = () => {
    setPasos([...pasos, { orden: pasos.length + 1, descripcion: '' }]);
  };

  const handleRemovePaso = (index) => {
    const updatedPasos = pasos.filter((_, i) => i !== index);
    // Reordenar los pasos restantes
    const reorderedPasos = updatedPasos.map((paso, i) => ({
      ...paso,
      orden: i + 1
    }));
    setPasos(reorderedPasos);
  };

  const handlePasoChange = (index, value) => {
    const updatedPasos = [...pasos];
    updatedPasos[index].descripcion = value;
    setPasos(updatedPasos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!nombre || !tipoComida || !tipoCocina || !metodoCoccion || 
        !tiempoPreparacion || !nivelDificultad || !ingredientePrincipal || !foto) {
      setError('Todos los campos son requeridos');
      return;
    }

    // Validar ingredientes
    for (const ing of ingredientes) {
      if (!ing.ingrediente || !ing.cantidad || !ing.unidad) {
        setError('Todos los campos de ingredientes son requeridos');
        return;
      }
    }

    // Validar pasos
    for (const paso of pasos) {
      if (!paso.descripcion) {
        setError('Todos los pasos deben tener una descripción');
        return;
      }
    }

    const nuevaReceta = {
      nombre,
      tipoComida,
      tipoCocina,
      ingredientes: ingredientes.map(ing => ({
        ingrediente: ing.ingrediente,
        cantidad: Number(ing.cantidad),
        unidad: ing.unidad
      })),
      metodoCoccion,
      tiempoPreparacion,
      nivelDificultad,
      ingredientePrincipal,
      temporada,
      pasos,
      foto
    };

    try {
      await onAddRecipe(nuevaReceta);
      onClose();
    } catch (err) {
      console.error('Error al crear receta:', err);
      setError('Hubo un error al crear la receta');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Crear Nueva Receta</h2>
        {error && <p className="error-message">{error}</p>}
        
        <form onSubmit={handleSubmit} className="recipe-form">
          <div className="form-section">
            <h3>Información Básica</h3>
            <div className="form-group">
              <label>Nombre de la Receta</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Paella Valenciana"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tipo de Comida</label>
                <select
                  value={tipoComida}
                  onChange={(e) => setTipoComida(e.target.value)}
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="Entradas">Entradas</option>
                  <option value="Platos principales">Platos principales</option>
                  <option value="Postres">Postres</option>
                  <option value="Aperitivos">Aperitivos</option>
                  <option value="Sopas">Sopas</option>
                  <option value="Ensaladas">Ensaladas</option>
                  <option value="Bebidas">Bebidas</option>
                </select>
              </div>

              <div className="form-group">
                <label>Tipo de Cocina</label>
                <select
                  value={tipoCocina}
                  onChange={(e) => setTipoCocina(e.target.value)}
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="Cocina Italiana">Italiana</option>
                  <option value="Cocina Mexicana">Mexicana</option>
                  <option value="Cocina China">China</option>
                  <option value="Cocina Japonesa">Japonesa</option>
                  <option value="Cocina India">India</option>
                  <option value="Cocina Mediterránea">Mediterránea</option>
                  <option value="Cocina Francesa">Francesa</option>
                  <option value="Cocina Española">Española</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Método de Cocción</label>
                <select
                  value={metodoCoccion}
                  onChange={(e) => setMetodoCoccion(e.target.value)}
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="Al horno">Al horno</option>
                  <option value="A la parrilla">A la parrilla</option>
                  <option value="A la plancha">A la plancha</option>
                  <option value="Frito">Frito</option>
                  <option value="Hervido">Hervido</option>
                  <option value="Al vapor">Al vapor</option>
                  <option value="Crudo">Crudo</option>
                </select>
              </div>

              <div className="form-group">
                <label>Tiempo de Preparación</label>
                <select
                  value={tiempoPreparacion}
                  onChange={(e) => setTiempoPreparacion(e.target.value)}
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="Menos de 15 minutos">Menos de 15 min</option>
                  <option value="Entre 15 y 30 minutos">15-30 min</option>
                  <option value="Entre 30 minutos y 1 hora">30 min - 1 h</option>
                  <option value="Más de 1 hora">Más de 1 h</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Nivel de Dificultad</label>
                <select
                  value={nivelDificultad}
                  onChange={(e) => setNivelDificultad(e.target.value)}
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="Fácil">Fácil</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Difícil">Difícil</option>
                </select>
              </div>

              <div className="form-group">
                <label>Ingrediente Principal</label>
                <select
                  value={ingredientePrincipal}
                  onChange={(e) => setIngredientePrincipal(e.target.value)}
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="Carne">Carne</option>
                  <option value="Pollo">Pollo</option>
                  <option value="Pescado">Pescado</option>
                  <option value="Verduras">Verduras</option>
                  <option value="Frutas">Frutas</option>
                  <option value="Granos">Granos</option>
                  <option value="Mariscos">Mariscos</option>
                </select>
              </div>

              <div className="form-group">
                <label>Temporada</label>
                <select
                  value={temporada}
                  onChange={(e) => setTemporada(e.target.value)}
                >
                  <option value="Todo el año">Todo el año</option>
                  <option value="Verano">Verano</option>
                  <option value="Invierno">Invierno</option>
                  <option value="Primavera">Primavera</option>
                  <option value="Otoño">Otoño</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>URL de la Foto</label>
              <input
                type="text"
                value={foto}
                onChange={(e) => setFoto(e.target.value)}
                placeholder="https://ejemplo.com/foto.jpg"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Ingredientes</h3>
            {ingredientes.map((ing, index) => (
              <div key={index} className="ingredient-row">
                <div className="form-group">
                  <label>Ingrediente</label>
                  {loadingIngredients ? (
                    <select disabled>
                      <option>Cargando ingredientes...</option>
                    </select>
                  ) : (
                    <select
                      value={ing.ingrediente}
                      onChange={(e) => handleIngredienteChange(index, 'ingrediente', e.target.value)}
                      required
                    >
                      <option value="">Seleccionar</option>
                      {allIngredients.map(ing => (
                        <option key={ing._id} value={ing._id}>{ing.nombre}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="form-group">
                  <label>Cantidad</label>
                  <input
                    type="number"
                    value={ing.cantidad}
                    onChange={(e) => handleIngredienteChange(index, 'cantidad', e.target.value)}
                    placeholder="Ej: 200"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Unidad</label>
                  <select
                    value={ing.unidad}
                    onChange={(e) => handleIngredienteChange(index, 'unidad', e.target.value)}
                    required
                  >
                    <option value="">Seleccionar</option>
                    <option value="unidades">Unidades</option>
                    <option value="gramos">Gramos</option>
                    <option value="ml">ml</option>
                    <option value="tazas">Tazas</option>
                    <option value="cucharadas">Cucharadas</option>
                    <option value="kg">kg</option>
                    <option value="lt">lt</option>
                  </select>
                </div>

                {ingredientes.length > 1 && (
                  <button 
                    type="button" 
                    className="remove-button"
                    onClick={() => handleRemoveIngrediente(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button" 
              className="add-button"
              onClick={handleAddIngrediente}
            >
              + Agregar Ingrediente
            </button>
          </div>

          <div className="form-section">
            <h3>Pasos de Preparación</h3>
            {pasos.map((paso, index) => (
              <div key={index} className="step-row">
                <div className="step-number">{paso.orden}.</div>
                <div className="form-group step-description">
                  <textarea
                    value={paso.descripcion}
                    onChange={(e) => handlePasoChange(index, e.target.value)}
                    placeholder={`Describe el paso ${paso.orden}`}
                    required
                  />
                </div>
                {pasos.length > 1 && (
                  <button 
                    type="button" 
                    className="remove-button"
                    onClick={() => handleRemovePaso(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button" 
              className="add-button"
              onClick={handleAddPaso}
            >
              + Agregar Paso
            </button>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              Guardar Receta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ModalReceta.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddRecipe: PropTypes.func.isRequired,
};

export default ModalReceta;