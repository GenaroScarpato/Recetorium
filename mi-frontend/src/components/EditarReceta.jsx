import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

import Header from './Header';
import NavigationSideBar from './NavigationSidebar';
import Footer from './Footer';

import styles from '../styles/EditarReceta.module.css'; // crea este archivo si aún no lo tenés

const EditarReceta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    nombre: '',
    tipoComida: '',
    tipoCocina: '',
    metodoCoccion: '',
    tiempoPreparacion: '',
    nivelDificultad: '',
    ingredientePrincipal: '',
    temporada: '',
    ingredientes: [],
    pasos: [],
    foto: null,
  });

  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReceta = async () => {
      try {
        const response = await axios.get(`/api/recetas/${id}`, {
          withCredentials: true,
        });

        const receta = response.data;

        setFormData({
          nombre: receta.nombre,
          tipoComida: receta.tipoComida,
          tipoCocina: receta.tipoCocina,
          metodoCoccion: receta.metodoCoccion,
          tiempoPreparacion: receta.tiempoPreparacion,
          nivelDificultad: receta.nivelDificultad,
          ingredientePrincipal: receta.ingredientePrincipal,
          temporada: receta.temporada,
          ingredientes: receta.ingredientes || [],
          pasos: receta.pasos || [],
          foto: null, // No cargar archivo directamente
        });

        setPreviewImage(receta.foto);
      } catch (err) {
        console.error('Error al cargar la receta:', err);
        setError('No se pudo cargar la receta.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchReceta();
    } else {
      setLoading(false);
    }
  }, [id, isAuthenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = (e, index, type) => {
    const updatedArray = [...formData[type]];
    updatedArray[index] = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [type]: updatedArray,
    }));
  };

  const addArrayItem = (type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], ''],
    }));
  };

  const removeArrayItem = (type, index) => {
    const updatedArray = [...formData[type]];
    updatedArray.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      [type]: updatedArray,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, foto: file }));
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      for (const key in formData) {
        if (key === 'ingredientes' || key === 'pasos') {
          data.append(key, JSON.stringify(formData[key]));
        } else if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      }

      await axios.patch(`/api/recetas/${id}`, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/mis-recetas');
    } catch (err) {
      console.error('Error al actualizar receta:', err);
      alert('No se pudo actualizar la receta.');
    }
  };

  if (!isAuthenticated) {
    return <div className={styles.error}>Debes iniciar sesión para editar la receta</div>;
  }

  if (loading) {
    return <div className={styles.loading}>Cargando receta...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.appContainer}>
      <Header />
      <div className={styles.mainContent}>
        <NavigationSideBar />
        <div className={styles.editContainer}>
          <h2>Editar Receta</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              required
            />
            <input
              type="text"
              name="tipoComida"
              value={formData.tipoComida}
              onChange={handleChange}
              placeholder="Tipo de comida"
            />
            <input
              type="text"
              name="tipoCocina"
              value={formData.tipoCocina}
              onChange={handleChange}
              placeholder="Tipo de cocina"
            />
            <input
              type="text"
              name="metodoCoccion"
              value={formData.metodoCoccion}
              onChange={handleChange}
              placeholder="Método de cocción"
            />
            <input
              type="text"
              name="tiempoPreparacion"
              value={formData.tiempoPreparacion}
              onChange={handleChange}
              placeholder="Tiempo de preparación"
            />
            <input
              type="text"
              name="nivelDificultad"
              value={formData.nivelDificultad}
              onChange={handleChange}
              placeholder="Dificultad"
            />
            <input
              type="text"
              name="ingredientePrincipal"
              value={formData.ingredientePrincipal}
              onChange={handleChange}
              placeholder="Ingrediente principal"
            />
            <input
              type="text"
              name="temporada"
              value={formData.temporada}
              onChange={handleChange}
              placeholder="Temporada"
            />

            <h4>Ingredientes</h4>
            {formData.ingredientes.map((item, i) => (
              <div key={i} className={styles.arrayItem}>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange(e, i, 'ingredientes')}
                />
                <button type="button" onClick={() => removeArrayItem('ingredientes', i)}>❌</button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('ingredientes')}>+ Ingrediente</button>

            <h4>Pasos</h4>
            {formData.pasos.map((item, i) => (
              <div key={i} className={styles.arrayItem}>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange(e, i, 'pasos')}
                />
                <button type="button" onClick={() => removeArrayItem('pasos', i)}>❌</button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('pasos')}>+ Paso</button>

            <div className={styles.imageInput}>
              <label>Imagen</label>
              <input type="file" onChange={handleImageChange} />
              {previewImage && <img src={previewImage} alt="Vista previa" className={styles.previewImage} />}
            </div>

            <button type="submit" className={styles.submitButton}>Guardar Cambios</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditarReceta;
