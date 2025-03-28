import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../styles/Home.css';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">🍳</span>
            <span className="logo-text">RECETORIUM</span>
          </Link>
          <div className="search-auth-container">
            <div className="search-box">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar recetas..."
                className="search-input"
              />
              <button className="search-button">
                <span role="img" aria-label="search">🔍</span>
              </button>
            </div>
            <div className="auth-buttons">
              <Link to="/login" className="auth-btn login">Ingresar</Link>
              <Link to="/register" className="auth-btn register">Regístrate</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay">
          <h1>Transforma ingredientes en <span className="highlight">obras maestras culinarias</span></h1>
          <p className="hero-subtitle">Descubre recetas gourmet, técnicas de chefs y secretos para impresionar en cada comida</p>
          <Link to="/dashboard" className="cta-button">Explorar recetas</Link>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content">
        <aside className="chefs-pick">
          <div className="recipe-card">
            <div className="recipe-badge">CHEF&apos;S PICK</div>
            <img 
              src="https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
              alt="Pasta Trufada con Hongos"
              className="recipe-image"
            />
            <h3>Pasta Trufada con Hongos</h3>
            <p>⭐ 4.8 (120 reseñas) | 20 min | Dificultad: Media</p>
            <p className="recipe-description">
              Una delicia cremosa con hongos silvestres, trufa negra rallada y un toque de vino blanco. 
              <strong> Consejo del chef:</strong> Sirve con parmesano fresco.
            </p>
            <Link to="/receta/1" className="recipe-link">Ver receta paso a paso →</Link>
          </div>
        </aside>

        <article className="about-us">
          <h2>SOBRE NOSOTROS</h2>
          <div className="about-content">
            <p>
              En <strong>Recetorium</strong>, creemos que cocinar es un arte accesible para todos. 
              Combinamos <span className="text-accent">técnicas de chefs profesionales</span> con instrucciones claras.
            </p>
            <div className="stats-container">
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Recetas verificadas</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100+</div>
                <div className="stat-label">Chefs colaboradores</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Comunidad activa</div>
              </div>
            </div>
            <div className="mission-card">
              <h3>Nuestra filosofía</h3>
              <p>
                No necesitas ingredientes caros para cocinar como un profesional. Dominar las bases es la clave.
                <br />
                <em>- Chef María Rodríguez, Fundadora</em>
              </p>
            </div>
            <div className="mission-card">
            <h3>Creemos que...</h3>
<p>
  Cada cocinero puede crear obras maestras con ingredientes simples, 
  cuando conoce los fundamentos del arte culinario.
  <br />
  <em>- Chef María Rodríguez, Fundadora</em>
</p>
            </div>
          </div>
        </article>
      </main>

      {/* Técnicas Básicas */}
      <section className="techniques-section">
        <h2 className="section-title">Domina las técnicas esenciales</h2>
        <p className="section-subtitle">Aprende de chefs profesionales con tutoriales paso a paso</p>
        <div className="techniques-grid">
          <div className="technique-card">
            <div className="technique-icon">🔪</div>
            <h3>Cortes básicos</h3>
            <p>Juliana, brunoise, chiffonade... y cuándo usarlos.</p>
            <Link to="/tecnicas/cortes" className="technique-link">Ver tutorial →</Link>
          </div>
          <div className="technique-card">
            <div className="technique-icon">🍳</div>
            <h3>Puntos de cocción</h3>
            <p>Carne al punto, huevos pochados, verduras al dente.</p>
            <Link to="/tecnicas/coccion" className="technique-link">Aprender →</Link>
          </div>
          <div className="technique-card">
            <div className="technique-icon">🥄</div>
            <h3>Salsas madre</h3>
            <p>Bechamel, velouté, española y sus derivados.</p>
            <Link to="/tecnicas/salsas" className="technique-link">Dominar →</Link>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="testimonials-section">
        <h2 className="section-title">Lo que dicen nuestros chefs</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>“Recetorium me ayudó a llevar mis habilidades culinarias a otro nivel. Las explicaciones son claras y profesionales.”</p>
            </div>
            <div className="testimonial-author">
              <img 
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=761&q=80" 
                alt="Ana López" 
                className="author-avatar"
              />
              <div>
                <h4>Ana López</h4>
                <p>Chef pastelera | 5 años de experiencia</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>“La mejor plataforma para aprender técnicas complejas simplificadas. ¡Mis alumnos la usan como referencia!”</p>
            </div>
            <div className="testimonial-author">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                alt="Carlos Méndez" 
                className="author-avatar"
              />
              <div>
                <h4>Carlos Méndez</h4>
                <p>Instructor de cocina | Michelin Star</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">RECETORIUM</div>
          <nav className="footer-nav">
            <Link to="/about">Nosotros</Link>
            <Link to="/contact">Contacto</Link>
            <Link to="/blog">Blog</Link>
          </nav>
        </div>
        <div className="copyright">© {new Date().getFullYear()} Recetorium. Todos los derechos reservados.</div>
      </footer>
    </div>
  );
};

export default Home;