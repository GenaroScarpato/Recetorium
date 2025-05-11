import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import NavigationSidebar from './NavigationSidebar';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [seccionActiva, setSeccionActiva] = useState('usuarios');
  const [usuarios, setUsuarios] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);
  const [nuevoIngrediente, setNuevoIngrediente] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const defaultImage = 'https://res.cloudinary.com/dkpwnkhza/image/upload/v1741732506/usuarios/vwmsergnpyzw8ktvq8yg.png';

  useEffect(() => {
    setCargando(true);
    const endpointMap = {
      usuarios: '/api/usuarios',
      comentarios: '/api/comentarios',
      ingredientes: '/api/ingredientes',
    };

    axios.get(endpointMap[seccionActiva], { withCredentials: true })
      .then(res => {
        if (seccionActiva === 'usuarios') setUsuarios(res.data);
        if (seccionActiva === 'comentarios') setComentarios(res.data);
        if (seccionActiva === 'ingredientes') setIngredientes(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setCargando(false));
  }, [seccionActiva]);

  const eliminarIngrediente = (id) => {
    axios.delete(`/api/ingredientes/${id}`, { withCredentials: true })
      .then(() => setIngredientes(ingredientes.filter(i => i._id !== id)));
  };

  const agregarIngrediente = () => {
    if (!nuevoIngrediente.trim()) return;
    const ingredientesArray = nuevoIngrediente.split(',').map(i => i.trim()).filter(i => i);
    const payload = ingredientesArray.length > 1
      ? ingredientesArray.map(nombre => ({ nombre }))
      : { nombre: ingredientesArray[0] };

    axios.post('/api/ingredientes', payload, { withCredentials: true })
      .then(() => axios.get('/api/ingredientes', { withCredentials: true }))
      .then(res => {
        setIngredientes(res.data);
        setNuevoIngrediente('');
        setMensaje({ tipo: 'success', texto: 'Ingrediente(s) agregado(s) correctamente' });
      })
      .catch(err => {
        const errorMsg = err.response?.data?.message || 'Error al agregar ingrediente(s)';
        setMensaje({ tipo: 'error', texto: errorMsg });
      });
  };

  const eliminarComentario = (id) => {
    axios.delete(`/api/comentarios/${id}`, { withCredentials: true })
      .then(() => {
        setComentarios(comentarios.filter(c => c._id !== id));
        setMensaje({ tipo: 'success', texto: 'Comentario eliminado correctamente' });
      })
      .catch(err => {
        const errorMsg = err.response?.data?.error || 'Error al eliminar comentario';
        setMensaje({ tipo: 'error', texto: errorMsg });
      });
  };

  // Eliminar el mensaje después de 2 segundos
  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        setMensaje(null);
      }, 2000); // El mensaje desaparece después de 2 segundos

      return () => clearTimeout(timer); // Limpiar el timer si el componente se desmonta
    }
  }, [mensaje]);

  return (
    <div className="admin-dashboard-container">
      <Header />
      <div className="admin-dashboard-content">
        <NavigationSidebar />
        <main className="admin-dashboard-main">
          <h1>Panel de Administración</h1>

          <nav className="admin-nav-tabs">
            {['usuarios', 'ingredientes', 'comentarios'].map(tab => (
              <button
                key={tab}
                onClick={() => setSeccionActiva(tab)}
                className={seccionActiva === tab ? 'active' : ''}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>

          <div className="admin-content-container">
            {cargando ? (
              <div className="admin-loading"><div className="spinner"></div></div>
            ) : (
              <>
                {mensaje && (
                  <div className={`admin-message ${mensaje.tipo}`}>
                    {mensaje.texto}
                  </div>
                )}

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
                                <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <img
                                      src={!u.foto || u.foto === 'url_default_foto_perfil' ? defaultImage : u.foto}
                                      alt={u.username}
                                      className="user-avatar"
                                    />
                                    <span className="username">{u.username}</span>
                                  </div>
                                </td>
                                <td>{u.email || `${u.username}@recetorium.com`}</td>
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
                              className="admin-btn red"
                              onClick={() => eliminarComentario(c._id)}
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

                {seccionActiva === 'ingredientes' && (
                  <div className="admin-section">
                    <h2>Ingredientes ({ingredientes.length})</h2>

                    <div className="admin-add-ingredient">
                      <input
                        type="text"
                        value={nuevoIngrediente}
                        onChange={(e) => setNuevoIngrediente(e.target.value)}
                        placeholder="Nuevo ingrediente (separados por comas)"
                        onKeyPress={(e) => e.key === 'Enter' && agregarIngrediente()}
                      />
                      <button
                        onClick={agregarIngrediente}
                        className="admin-btn green"
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
                              className="admin-btn red"
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
