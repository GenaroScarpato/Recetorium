import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import RecipeDetails from './components/RecipeDetails';
import Login from './components/Login';
import Home from './components/Home'; // Importa un nuevo componente Home para la página de inicio

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Nueva ruta principal para la página de inicio con contenido de relleno */}
        <Route path="/" element={<Home />} />
        {/* Ruta para el Dashboard (ahora accesible desde otra URL) */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Ruta para los detalles de la receta */}
        <Route path="/receta/:id" element={<RecipeDetails />} />

        {/* Ruta para el inicio de sesión */}
        <Route path="/login" element={<Login setShowLogin={() => {}} />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;