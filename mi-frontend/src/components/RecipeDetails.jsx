import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/RecipeDetails.module.css';

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [receta, setReceta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/recetas/${id}`)
      .then((response) => {
        setReceta(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener los detalles de la receta:', error);
        setError(error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p className={styles.loading}>Cargando...</p>;
  }

  if (error) {
    return <p className={styles.error}>Error al cargar la receta. Por favor, intenta nuevamente.</p>;
  }

  return (
    <div className={styles.recipeDetails}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        ❌
      </button>
      
      <div className={styles.contentWrapper}>
        {/* Sección izquierda (imagen y título) */}
        <div className={styles.leftSection}>
          <h1 className={styles.recipeTitle}>{receta.nombre}</h1>
          <img 
            src={receta.foto} 
            alt={receta.nombre} 
            className={styles.recipeImage} 
          />
        </div>

        {/* Sección derecha (detalles) */}
        <div className={styles.rightSection}>
          <p className={styles.description}>{receta.descripcion}</p>

          <div className={styles.recipeMeta}>
            <span>⏱️ Tiempo: {receta.tiempoPreparacion}</span>
            <span>⚙️ Dificultad: {receta.nivelDificultad}</span>
            <span>🍽️ Ingrediente principal: {receta.ingredientePrincipal}</span>
            <span>🍲 Tipo: {receta.tipoComida}</span>
            <span>🌍 Cocina: {receta.tipoCocina}</span>
            <span>🔥 Cocción: {receta.metodoCoccion}</span>
            <span>🍂 Temporada: {receta.temporada || "Todo el año"}</span>
          </div>

          <div className={styles.ingredientesSection}>
            <h2>Ingredientes</h2>
            <ul>
              {receta.ingredientes && receta.ingredientes.length > 0 ? (
                receta.ingredientes.map((ingrediente, index) => (
                  <li key={index} className={styles.ingredienteItem}>
                    <span className={styles.ingredienteNombre }>{ingrediente.ingrediente?.nombre || "Ingrediente desconocido"}</span>
                    {": "}
                    <span className={styles.ingredienteCantidad }>{ingrediente.cantidad} {ingrediente.unidad}</span>
                  </li>
                ))
              ) : (
                <li>No hay ingredientes disponibles.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
