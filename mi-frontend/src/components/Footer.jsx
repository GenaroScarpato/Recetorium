import { Link } from 'react-router-dom';
import { FiHome, FiBookmark, FiUser, FiMail } from 'react-icons/fi';
import { FaUtensils } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <FaUtensils /> RECETORIUM
        </div>
        <nav className="footer-nav">
          <Link to="/"> <FiHome /> Inicio</Link>
          <Link to="/dashboard"> <FiBookmark /> Recetas</Link>
          <Link to="#about"> <FiUser /> Nosotros</Link>  {/* Ruta a la sección "Sobre nosotros" */}
          <Link to="/contact"> <FiMail /> Contacto</Link> {/* Ruta de contacto vacía o futura */}
        </nav>
      </div>
      <div className="copyright">
        © {new Date().getFullYear()} Recetorium. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
