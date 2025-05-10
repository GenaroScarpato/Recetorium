import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import NavigationSidebar from './NavigationSidebar';
import '../styles/AdminDashboard.css'; // Archivo CSS específico para este componente

const AdminDashboard = () => {
  const [seccionActiva, setSeccionActiva] = useState('usuarios');
  const [usuarios, setUsuarios] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);
  const [nuevoIngrediente, setNuevoIngrediente] = useState('');
  const [cargando, setCargando] = useState(false);

  // Cargar datos según la sección activa
  useEffect(() => {
    setCargando(true);
    if (seccionActiva === 'usuarios') {
      axios.get('/api/usuarios', { withCredentials: true })
        .then(res => {
          setUsuarios(res.data);
          setCargando(false);
        })
        .catch(err => {
          console.error(err);
          setCargando(false);
        });
    }
    if (seccionActiva === 'comentarios') {
      axios.get('/api/comentarios', { withCredentials: true })
        .then(res => {
          setComentarios(res.data);
          setCargando(false);
        })
        .catch(err => {
          console.error(err);
          setCargando(false);
        });
    }
    if (seccionActiva === 'ingredientes') {
      axios.get('/api/ingredientes', { withCredentials: true })
        .then(res => {
          setIngredientes(res.data);
          setCargando(false);
        })
        .catch(err => {
          console.error(err);
          setCargando(false);
        });
    }
  }, [seccionActiva]);

  const eliminarIngrediente = (id) => {
    axios.delete(`/api/ingredientes/${id}`, { withCredentials: true })
      .then(() => setIngredientes(ingredientes.filter(i => i._id !== id)));
  };

  const agregarIngrediente = () => {
    if (!nuevoIngrediente.trim()) return;
    axios.post('/api/ingredientes', { nombre: nuevoIngrediente }, { withCredentials: true })
      .then(res => {
        setIngredientes([...ingredientes, res.data]);
        setNuevoIngrediente('');
      });
  };

  return (
    <div className="admin-dashboard-container">
      <Header />
      
      <div className="admin-dashboard-content">
        <NavigationSidebar />
        
        <main className="admin-dashboard-main">
          <h1>Panel de Administración</h1>

          {/* Barra de navegación */}
          <nav className="admin-nav-tabs">
            <button
              onClick={() => setSeccionActiva('usuarios')}
              className={seccionActiva === 'usuarios' ? 'active' : ''}
            >
              Usuarios
            </button>
            <button
              onClick={() => setSeccionActiva('ingredientes')}
              className={seccionActiva === 'ingredientes' ? 'active' : ''}
            >
              Ingredientes
            </button>
            <button
              onClick={() => setSeccionActiva('comentarios')}
              className={seccionActiva === 'comentarios' ? 'active' : ''}
            >
              Comentarios
            </button>
          </nav>

          {/* Contenido principal */}
          <div className="admin-content-container">
            {cargando ? (
              <div className="admin-loading">
                <div className="spinner"></div>
              </div>
            ) : (
              <>
                {/* Sección de usuarios */}
                {seccionActiva === 'usuarios' && (
                  <div className="admin-section">
                    <h2>Lista de Usuarios ({usuarios.length})</h2>
                    {usuarios.length > 0 ? (
                      <div className="admin-table-container">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Usuario</th>
                              <th>Email</th>
                              <th>Rol</th>
                            </tr>
                          </thead>
                          <tbody>
                            {usuarios.map(u => (
                              <tr key={u._id}>
                                <td>{u.username}</td>
                                <td>{u.email || 'N/A'}</td>
                                <td>
                                  <span className={`admin-badge ${u.role === 'admin' ? 'admin' : 'user'}`}>
                                    {u.role}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="admin-no-data">No hay usuarios registrados</p>
                    )}
                  </div>
                )}

                {/* Sección de comentarios */}
                {seccionActiva === 'comentarios' && (
                  <div className="admin-section">
                    <h2>Comentarios ({comentarios.length})</h2>
                    {comentarios.length > 0 ? (
                      <div className="admin-comments-list">
                        {comentarios.map(c => (
                          <div key={c._id} className="admin-comment-item">
                            <div className="admin-comment-content">
                              <p>{c.texto}</p>
                              <small>{new Date(c.createdAt).toLocaleString()}</small>
                            </div>
                            <button 
                              className="admin-delete-btn"
                              onClick={() => console.log('Eliminar comentario', c._id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="admin-no-data">No hay comentarios</p>
                    )}
                  </div>
                )}

                {/* Sección de ingredientes */}
                {seccionActiva === 'ingredientes' && (
                  <div className="admin-section">
                    <h2>Ingredientes ({ingredientes.length})</h2>
                    <div className="admin-add-ingredient">
                      <input
                        type="text"
                        value={nuevoIngrediente}
                        onChange={(e) => setNuevoIngrediente(e.target.value)}
                        placeholder="Nuevo ingrediente"
                        onKeyPress={(e) => e.key === 'Enter' && agregarIngrediente()}
                      />
                      <button
                        onClick={agregarIngrediente}
                        className="admin-add-btn"
                      >
                        Agregar
                      </button>
                    </div>
                    {ingredientes.length > 0 ? (
                      <ul className="admin-ingredients-list">
                        {ingredientes.map(i => (
                          <li key={i._id} className="admin-ingredient-item">
                            <span>{i.nombre}</span>
                            <button
                              onClick={() => eliminarIngrediente(i._id)}
                              className="admin-delete-btn"
                            >
                              Eliminar
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="admin-no-data">No hay ingredientes registrados</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;