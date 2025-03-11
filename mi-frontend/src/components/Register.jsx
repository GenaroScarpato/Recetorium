import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importa el contexto de autenticación
import PropTypes from 'prop-types';
import './Login.css';

function Register({ setShowRegister }) {
  const navigate = useNavigate();
  const { login } = useAuth(); // Usa la función login del contexto
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      // Paso 1: Registrar al usuario
      const registerResponse = await axios.post('http://localhost:3000/api/usuarios', {
        username,
        password,
      });

      if (registerResponse.status === 201) {
        setSuccess('Usuario registrado exitosamente. Iniciando sesión...');
        setError('');

        // Paso 2: Iniciar sesión automáticamente con las credenciales registradas
        try {
          const loginResponse = await axios.post('http://localhost:3000/api/login', {
            username,
            password,
          });

          if (loginResponse.status === 200 && loginResponse.data.token && loginResponse.data.usuario) {
            const { token, usuario, role, id } = loginResponse.data; // Asegúrate de que la API devuelva el ID
            console.log('Inicio de sesión exitoso:', loginResponse.data);

            // Paso 3: Iniciar sesión en el contexto de autenticación
            login(token, usuario, role, id);

            // Cerrar el modal de registro y redirigir al usuario a la página de inicio
            setShowRegister(false);
            navigate('/');
          } else {
            setError('Error al iniciar sesión automáticamente');
          }
        } catch (loginError) {
          console.error('Error al iniciar sesión automáticamente:', loginError.message);
          setError('Error al iniciar sesión automáticamente');
        }
      } else {
        setError('Error al registrar el usuario');
      }
    } catch (err) {
      console.error('Error al registrar el usuario:', err.message);
      setError(err.response?.data?.message || 'Error al registrar el usuario');
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <button onClick={() => setShowRegister(false)} className="close-btn">×</button>
        <h2>Registrarse</h2>

        <form onSubmit={handleRegister}>
          <div>
            <label htmlFor="username">Usuario:</label>
            <input type="text" id="username" name="username" required />
          </div>

          <div>
            <label htmlFor="password">Contraseña:</label>
            <input type="password" id="password" name="password" required />
          </div>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <button type="submit">Registrarse</button>
        </form>
      </div>
    </div>
  );
}

Register.propTypes = {
  setShowRegister: PropTypes.func.isRequired,
};

export default Register;