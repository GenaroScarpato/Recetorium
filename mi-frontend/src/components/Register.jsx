import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PropTypes from 'prop-types';
import styles from './login.module.css'; // Importar CSS Modules

function Register({ setShowRegister }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Función para validar el nombre de usuario
  const validateUsername = (username) => {
    const errors = [];
    const minLength = 3;
    const maxLength = 20;
    const validChars = /^[a-zA-Z0-9_]+$/; // Solo letras, números y guiones bajos

    if (username.length < minLength || username.length > maxLength) {
      errors.push('El nombre de usuario debe tener entre 3 y 20 caracteres.');
    }
    if (!validChars.test(username)) {
      errors.push('El nombre de usuario solo puede contener letras, números y guiones bajos.');
    }

    return errors;
  };

  // Función para validar la contraseña
  const validatePassword = (password) => {
    const errors = [];
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      errors.push('La contraseña debe tener al menos 8 caracteres.');
    }
    if (!hasUpperCase) {
      errors.push('La contraseña debe incluir al menos una mayúscula.');
    }
    if (!hasLowerCase) {
      errors.push('La contraseña debe incluir al menos una minúscula.');
    }
    if (!hasNumbers) {
      errors.push('La contraseña debe incluir al menos un número.');
    }
    if (!hasSpecialChars) {
      errors.push('La contraseña debe incluir al menos un carácter especial.');
    }

    return errors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    // Validar nombre de usuario
    const usernameErrors = validateUsername(username);
    // Validar contraseña
    const passwordErrors = validatePassword(password);
    // Validar confirmación de contraseña
    const confirmPasswordErrors = password !== confirmPassword ? ['Las contraseñas no coinciden.'] : [];

    // Combinar todos los errores
    const allErrors = [...usernameErrors, ...passwordErrors, ...confirmPasswordErrors];

    if (allErrors.length > 0) {
      setError(allErrors.join('\n')); // Unir todos los errores con saltos de línea
      return;
    }

    try {
      const registerResponse = await axios.post('http://localhost:3000/api/usuarios', {
        username,
        password,
      } , {
        withCredentials: true, // Incluir cookies en la solicitud
      }
    );

      if (registerResponse.status === 201) {
        setSuccess('Usuario registrado exitosamente. Iniciando sesión...');
        setError('');

        try {
          const loginResponse = await axios.post('http://localhost:3000/api/login', {
            username,
            password,
          }, {
            withCredentials: true, // Incluir cookies en la solicitud
          });

          if (loginResponse.status === 200 && loginResponse.data.token && loginResponse.data.usuario) {
            const { token, usuario, role, id } = loginResponse.data;
            login(token, usuario, role, id);
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
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <button onClick={() => setShowRegister(false)} className={styles.closeButton}>×</button>
        <h2 className={styles.title}>Registrarse</h2>

        <form onSubmit={handleRegister} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Usuario:</label>
            <input type="text" id="username" name="username" className={styles.input} required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Contraseña:</label>
            <input type="password" id="password" name="password" className={styles.input} required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={styles.input}
              required
            />
          </div>

          {error && (
            <div className={styles.errorMessage}>
              {error.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          )}

          {success && <div className={styles.successMessage}>{success}</div>}

          <button type="submit" className={styles.button}>Registrarse</button>
        </form>
      </div>
    </div>
  );
}

Register.propTypes = {
  setShowRegister: PropTypes.func.isRequired,
};

export default Register;