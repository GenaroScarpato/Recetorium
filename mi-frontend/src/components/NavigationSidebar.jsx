import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

const NavigationSidebar = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null; // o un spinner si querés

  // Si el usuario no está logueado, solo mostrar "Inicio"
  if (!user) {
    return (
      <div className="left-column">
        <h2>RECETORIUM</h2>
        <nav className="navigation-menu">
          <ul className="navigation-menu">
            <li>
              <Link to="/dashboard" className="nav-link">
                <span className="icon">🏠</span> Inicio
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    );
  }

  // Si el usuario está logueado, mostrar todas las opciones
  const esChef = user?.role === 'CHEF';
  const esAdmin = user?.role === 'ADMIN';


  return (
    <div className="left-column">
      <h2>RECETORIUM</h2>
      <nav className="navigation-menu">
        <ul className="navigation-menu">
          <li>
            <Link to="/dashboard" className="nav-link">
              <span className="icon">🏠</span> Inicio
            </Link>
          </li>

          {esChef && (
            <li>
              <Link to="/mis-recetas" className="nav-link">
                <span className="icon">📖</span> Mis recetas
              </Link>
            </li>
          )}

          <li>
            <Link to="/guardadas" className="nav-link">
              <span className="icon">📚</span> Guardadas
            </Link>
          </li>
          <li>
            <Link to="/chefs" className="nav-link">
              <span className="icon">👥</span> Chefs
            </Link>
          </li>
          <li>
            <Link to="/perfil" className="nav-link">
              <span className="icon">👤</span> Perfil
            </Link>
          </li>

          {/* Panel de administración solo visible para admins */}
          {esAdmin && (
  <>
    <li>
      <Link to="/admin" className="nav-link">
        <span className="icon">🧑‍💼</span> Gestionar web
      </Link>
    </li>
  </>
)}

        </ul>
      </nav>
    </div>
  );
};

export default NavigationSidebar;