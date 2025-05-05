import { Link } from 'react-router-dom';
import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import '../styles/Home.css';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  

  // Testimonios
  const testimonials = [
    {
      id: 1,
      name: "Carlos Méndez",
      role: "Food Blogger",
      content: "Recetorium ha transformado mi manera de cocinar. Las recetas son claras y los resultados profesionales.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 2,
      name: "Ana López",
      role: "Ama de casa",
      content: "Nunca pensé que podría hacer platos tan deliciosos. Mis hijos ahora piden repetición todos los días.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 3,
      name: "Javier Ruiz",
      role: "Chef amateur",
      content: "Las técnicas que aprendí aquí me ayudaron a ganar un concurso local de cocina. ¡Increíble!",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg"
    }
  ];

  return (
    <div className="home-container">
      {/* Header */}
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} /> {/* <-- Nuevo componente */} 

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
          <div className="recipe-badge">⭐ CHEF&apos;S PICK</div>
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
      <a href="https://youtu.be/Z7SwhTZ5tOM" target="_blank" rel="noopener noreferrer" className="technique-link">
        Ver tutorial →
      </a>
    </div>
    <div className="technique-card">
      <div className="technique-icon">🍳</div>
      <h3>Puntos de cocción</h3>
      <p>Carne al punto, huevos pochados, verduras al dente.</p>
      <a href="https://youtu.be/0lTy1_Eg-74" target="_blank" rel="noopener noreferrer" className="technique-link">
        Aprender →
      </a>
    </div>
    <div className="technique-card">
      <div className="technique-icon">🥄</div>
      <h3>Salsas madre</h3>
      <p>Bechamel, velouté, española y sus derivados.</p>
      <a href="https://youtu.be/K7ZUN-skV4s" target="_blank" rel="noopener noreferrer" className="technique-link">
        Dominar →
      </a>
    </div>
  </div>
</section>

      {/* Testimonios */}
      <section className="testimonials-section">
        <h2 className="section-title">Lo que dicen nuestros usuarios</h2>
        <p className="section-subtitle">Experiencias reales de la comunidad Recetorium</p>
        <div className="testimonials-grid">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-content">
                <p>{testimonial.content}</p>
              </div>
              <div className="testimonial-author">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="testimonial-avatar"
                />
                <div>
                  <h4>{testimonial.name}</h4>
                  <p className="testimonial-role">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default Home;