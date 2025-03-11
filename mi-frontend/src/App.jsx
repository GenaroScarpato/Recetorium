import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import RecipeDetails from './components/RecipeDetails';
import Login from './components/Login'; // Importa el componente Login

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Ruta principal para el Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* Ruta para los detalles de la receta */}
        <Route path="/receta/:id" element={<RecipeDetails />} />

        {/* Ruta para el inicio de sesión */}
        <Route path="/login" element={<Login setShowLogin={() => {}} />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;