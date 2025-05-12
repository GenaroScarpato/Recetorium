import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import App from './App.jsx';

// Configuración global de Axios
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_URL_LOCAL;

if (window.location.hostname === 'localhost') {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL_LOCAL;  // Para localhost
} else {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;  // Para dispositivos móviles en red local
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
