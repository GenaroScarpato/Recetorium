import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/login.module.css';

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateUsername = (username) => {
    const errors = [];
    const minLength = 3;
    const maxLength = 20;
    const validChars = /^[a-zA-Z0-9_]+$/;

    if (username.length < minLength || username.length > maxLength) {
      errors.push('El nombre de usuario debe tener entre 3 y 20 caracteres.');
    }
    if (!validChars.test(username)) {
      errors.push('El nombre de usuario solo puede contener letras, números y guiones bajos.');
    }

    return errors;
  };

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

    const usernameErrors = validateUsername(username);
    const passwordErrors = validatePassword(password);
    const confirmPasswordErrors = password !== confirmPassword ? ['Las contraseñas no coinciden.'] : [];

    const allErrors = [...usernameErrors, ...passwordErrors, ...confirmPasswordErrors];

    if (allErrors.length > 0) {
      setError(allErrors.join('\n'));
      return;
    }

    try {
      const registerResponse = await axios.post('http://localhost:3000/api/usuarios', {
        username,
        password,
      }, {
        withCredentials: true,
      });

      if (registerResponse.status === 201) {
        setSuccess('Usuario registrado exitosamente. Iniciando sesión...');
        setError('');

        try {
          const loginResponse = await axios.post('http://localhost:3000/api/login', {
            username,
            password,
          }, {
            withCredentials: true,
          });
        
          if (loginResponse.status === 200 && loginResponse.data.token && loginResponse.data.usuario) {
            const { token, usuario, role, id } = loginResponse.data;
            login(token, { username: usuario, role, id });
            navigate('/');
          } else {
            setError('Error al iniciar sesión automáticamente: ' + 
                    (loginResponse.data.message || 'Error desconocido'));
          }
        } catch (loginError) {
          setError('Registro exitoso, pero falló el inicio de sesión automático: ' + 
                  (loginError.response?.data?.message || loginError.message));
          navigate('/login');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar el usuario');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
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

          <div className={styles.loginLink}>
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;