import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import PropTypes from 'prop-types';
import './Login.css';

function Login({ setShowLogin }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    console.log('Intentando iniciar sesión con', username, password);

    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        username,
        password,
      });

      if (response.status === 200 && response.data.token && response.data.usuario) {
        const { token, usuario, role, id } = response.data; // Asegúrate de que la API devuelva el ID
        console.log('Inicio de sesión exitoso:', response.data);

        login(token, usuario, role, id); // Pasar el ID a la función login
        setShowLogin(false);
        navigate('/');
      } else {
        setError('Credenciales inválidas');
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err.message);
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <button onClick={() => setShowLogin(false)} className="close-btn">×</button>
        <h2>Iniciar Sesión</h2>

        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">Usuario:</label>
            <input type="text" id="username" name="username" required />
          </div>

          <div>
            <label htmlFor="password">Contraseña:</label>
            <input type="password" id="password" name="password" required />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit">Iniciar Sesión</button>
        </form>
      </div>
    </div>
  );
}

Login.propTypes = {
  setShowLogin: PropTypes.func.isRequired,
};

export default Login;