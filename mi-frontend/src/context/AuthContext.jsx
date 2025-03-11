import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    const storedId = localStorage.getItem('id'); // Obtener el ID del localStorage
    console.log("Inicialización del estado - storedUser:", storedUser, "storedRole:", storedRole, "storedId:", storedId);
    return storedUser && storedRole && storedId ? { username: storedUser, role: storedRole, id: storedId } : null;
  });
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    const storedId = localStorage.getItem('id'); // Obtener el ID del localStorage
    console.log("useEffect ejecutado - storedUser:", storedUser, "storedRole:", storedRole, "storedId:", storedId);
    if (storedUser && storedRole && storedId) {
      setUser({ username: storedUser, role: storedRole, id: storedId });
    }
  }, []);

  const login = (token, username, role, id) => {
    console.log("Login recibido - token:", token, "username:", username, "role:", role, "id:", id);
    localStorage.setItem('token', token);
    localStorage.setItem('user', username);
    localStorage.setItem('role', role);
    localStorage.setItem('id', id); // Guardar el ID en localStorage
    console.log("Login guardado en localStorage - token:", localStorage.getItem('token'), 
                "user:", localStorage.getItem('user'), "role:", localStorage.getItem('role'), 
                "id:", localStorage.getItem('id'));
    setIsAuthenticated(true);
    setUser({ username, role, id }); // Incluir el ID en el estado del usuario
  };

  const logout = () => {
    console.log("Logout ejecutado");
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('id'); // Eliminar el ID del localStorage
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);