// components/NavigationSidebar.jsx
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

const NavigationSidebar = () => {
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
          <li>
            <Link to="/mis-recetas" className="nav-link">
              <span className="icon">📖</span> Mis recetas
            </Link>
          </li>
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