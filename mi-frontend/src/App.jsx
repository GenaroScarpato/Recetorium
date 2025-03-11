import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import RecipeDetails from './components/RecipeDetails'; // Correcto
// // import ProtectedRoute from './components/ProtectedRoute'; // Si necesitas rutas protegidas

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Ruta principal para el Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* Ruta para los detalles de la receta */}
        <Route path="/receta/:id" element={<RecipeDetails />} />

        {/* Si necesitas rutas protegidas, puedes usar ProtectedRoute */}
        {/* Ejemplo:
        <Route
          path="/ruta-protegida"
          element={
            <ProtectedRoute>
              <ComponenteProtegido />
            </ProtectedRoute>
          }
        />
        */}
      </Routes>
    </AuthProvider>
  );
}

export default App;