import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PropTypes from 'prop-types';
import styles from './login.module.css'; // Importar CSS Modules

function Login({ setShowLogin }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        username,
        password,
      }, {
        withCredentials: true, // Incluir cookies en la solicitud
      });

      if (response.status === 200 && response.data.token && response.data.usuario) {
        const { token, usuario, role, id } = response.data;

        // Actualizar el estado de autenticación en el contexto
        login(token, usuario, role, id);

        // Cerrar el modal de login
        setShowLogin(false);

        // Redirigir al usuario a la página principal
        navigate('/'); // Cambia '/' por la ruta que desees
      } else {
        setError('Credenciales inválidas');
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err.message);
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <button onClick={() => setShowLogin(false)} className={styles.closeButton}>×</button>
        <h2 className={styles.title}>Iniciar Sesión</h2>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Usuario:</label>
            <input type="text" id="username" name="username" className={styles.input} required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Contraseña:</label>
            <input type="password" id="password" name="password" className={styles.input} required />
          </div>

          {error && <div className={styles.errorMessage}><p>{error}</p></div>}

          <button type="submit" className={styles.button}>Iniciar Sesión</button>
        </form>
      </div>
    </div>
  );
}

Login.propTypes = {
  setShowLogin: PropTypes.func.isRequired,
};

export default Login;