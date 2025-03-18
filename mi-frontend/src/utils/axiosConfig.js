import axios from 'axios';
import { Navigate } from 'react-router-dom';

const setupAxiosInterceptors = (logout) => {
  axios.interceptors.response.use(
    (response) => {
      // Si la respuesta es exitosa, simplemente la devolvemos
      return response;
    },
    (error) => {
      // Si hay un error en la respuesta
      if (error.response) {
        const { status } = error.response;

        // Si el token es inválido o ha expirado (código 401)
        if (status === 401) {
          // Cerramos la sesión
          logout();

          // Redirigimos al usuario a la página de inicio de sesión
          Navigate('/login');
        }
      }

      // Propagamos el error para que pueda ser manejado por el código que hizo la solicitud
      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptors;