import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

const NavigationSidebar = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null; // o un spinner si querés

  const esChef = user?.role === 'CHEF';

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
        </ul>
      </nav>
    </div>
  );
};

export default NavigationSidebar;
    