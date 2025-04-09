import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/login.module.css';

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState('CLIENTE');

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
    setIsLoading(true);
    const username = e.target.username.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    const usernameErrors = validateUsername(username);
    const passwordErrors = validatePassword(password);
    const confirmPasswordErrors = password !== confirmPassword ? ['Las contraseñas no coinciden.'] : [];

    const allErrors = [...usernameErrors, ...passwordErrors, ...confirmPasswordErrors];

    if (allErrors.length > 0) {
      setError(allErrors.join('\n'));
      setIsLoading(false);
      return;
    }

    try {
      const registerResponse = await axios.post('http://localhost:3000/api/usuarios', {
        username,
        password,
        role
      }, {
        withCredentials: true,
      });

      if (registerResponse.status === 201) {
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
          }
        } catch (loginError) {
          setError('Registro exitoso, pero falló el inicio de sesión automático');
          navigate('/login');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar el usuario');
    } finally {
      setIsLoading(false);
    }
  };

  
  return (
<div className={styles.loginPage} data-theme="register">

<div 
  className={styles.loginIllustration}
  data-theme="register"
>
           <div className={styles.illustrationContent}>
          <h2>Únete a nuestra comunidad</h2>
          <p>Comparte tus recetas y descubre nuevas creaciones</p>
          <div className={styles.roleEmoji}>
            {role === 'CHEF' ? '👨‍🍳' : '🍽️'}
          </div>
        </div>
      </div>
      
      <div className={styles.loginFormContainer}>
        <div className={styles.loginFormWrapper}>
          <h1 className={styles.registerTitle}>Crear Cuenta</h1>
          
          {error && (
            <div className={styles.errorMessage}>
              {error.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          )}
          
          <form onSubmit={handleRegister}>
            <div className={styles.formGroup}>
              <label htmlFor="username">Nombre de Usuario</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Ej: chef_maria"
                required
                autoComplete="username"
              />
            </div>

            {/* Selector de Rol */}
            <div className={styles.formGroup}>
              <label>¿Cuál será tu rol?</label>
              <div className={styles.roleSelector}>
                {['CLIENTE', 'CHEF'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`${styles.roleButton} ${role === r ? styles.active : ''}`}
                  >
                    {r === 'CHEF' ? 'Soy Chef' : 'Soy Cliente'}
                  </button>
                ))}
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password">Contraseña</label>
              <div className={styles.passwordInputContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Mínimo 8 caracteres con mayúsculas, números y símbolos"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.passwordToggle}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <div className={styles.passwordInputContainer}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Repite tu contraseña"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={styles.passwordToggle}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading} 
              className={styles.submitButton}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <span className={styles.spinner} aria-hidden="true"></span>
              ) : (
                'Registrarse'
              )}
            </button>
            
            <div className={styles.linksContainer}>
              <p>
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className={styles.loginLink}>
                  Inicia sesión
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;