import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Login.module.css';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        username: formData.username,
        password: formData.password
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response.data.token) {
        await login(response.data.token, {
          username: response.data.usuario,
          role: response.data.role,
          id: response.data.id,
          foto: response.data.foto,
          recetasGuardadas: response.data.recetasGuardadas || [],
          seguidores: response.data.seguidores || [],
          siguiendo: response.data.siguiendo || []
        });
        navigate('/');
      } else {
        throw new Error('No se recibió un token válido');
      }
  
    } catch (err) {
      console.error('Error completo:', err.response?.data || err.message);
      const backendMsg = err.response?.data?.msg;
  
      if (err.response?.status === 401 && backendMsg?.startsWith('Credenciales inválidas')) {
        setError('Usuario o contraseña incorrectos');
      } else if (err.response?.status === 500) {
        setError('Error del servidor. Intenta más tarde.');
      } else {
        setError(backendMsg || 'Ocurrió un error al iniciar sesión. Intenta de nuevo.');
      }
  
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
<div className={styles.loginPage} data-theme="login">

<div 
  className={styles.loginIllustration}
  data-theme="login"
>
       <div className={styles.illustrationContent}>
          <h2>Bienvenido a Recetorium</h2>
          <p>Descubre el chef que llevas dentro con nuestras recetas paso a paso</p>
        </div>
      </div>
      
      <div className={styles.loginFormContainer}>
        <div className={styles.loginFormWrapper}>
          <h1>Iniciar Sesión</h1>
          
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="username">Nombre de Usuario</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                placeholder="Tu nombre de usuario"
                required
                autoComplete="username"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
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
                'Ingresar'
              )}
            </button>
            
            <div className={styles.linksContainer}>
              <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
              <span>¿No tienes cuenta? <Link to="/register">Regístrate</Link></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;