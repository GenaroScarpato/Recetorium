import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import App from './App.jsx';

// Configuración global de Axios
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:3000'; // Opcional: establece la URL base

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);