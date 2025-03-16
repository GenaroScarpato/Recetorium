const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Usuario, getByName } = require('../models/usuarioModel'); // Importar correctamente

// Función para el login
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Buscar el usuario en la base de datos
        const usuario = await getByName(username);

        // Validar si el usuario existe
        if (!usuario) {
            return res.status(401).json({
                msg: "Credenciales inválidas !usuario"
            });
        }

        // Validar la contraseña
        const validPassword = await bcrypt.compare(password, usuario.password);
        if (!validPassword) {
            return res.status(401).json({
                msg: "Credenciales inválidas !password"
            });
        }

        // Generar el JWT con el id del usuario
        const token = await generarJWT(usuario._id);

        // Configurar cookies en la respuesta
        res.cookie('token', token, {
            httpOnly: true, // La cookie no es accesible desde JavaScript
            secure: process.env.NODE_ENV === 'production', // Solo se envía sobre HTTPS en producción
            sameSite: 'strict', // Previene el envío en solicitudes entre sitios
            maxAge: 2 * 60 * 60 * 1000, // Expira en 2 horas (igual que el token)
        });

        res.cookie('user', usuario.username, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 2 * 60 * 60 * 1000 });
        res.cookie('role', usuario.role, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 2 * 60 * 60 * 1000 });
        res.cookie('id', usuario._id, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 2 * 60 * 60 * 1000 });

        // Enviar respuesta exitosa
        res.status(200).json({
            usuario: usuario.username,
            id: usuario._id,
            role: usuario.role,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            msg: 'Error interno del servidor'
        });
    }
};

// Función para verificar la autenticación del usuario
const verifyAuth = async (req, res) => {
    try {
        // Obtener el token de las cookies
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        // Verificar el token
        const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // Obtener los datos del usuario desde la base de datos
        const usuario = await Usuario.findById(decoded.id);

        if (!usuario) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        // Devolver los datos del usuario
        res.status(200).json({
            user: {
                id: usuario._id,
                username: usuario.username,
                role: usuario.role,
            },
        });
    } catch (error) {
        console.error('Error al verificar autenticación:', error);
        res.status(401).json({ message: 'No autorizado' });
    }
};

// Función para cerrar sesión
const logout = async (req, res) => {
    try {
      // Eliminar las cookies de autenticación
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      res.clearCookie('user', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      res.clearCookie('role', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      res.clearCookie('id', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
  
      res.status(200).json({ message: 'Logout exitoso' });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
// Función para generar un token JWT
const generarJWT = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = { id: userId };  // Usar solo el ID del usuario

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '2h'  // Token expira en 2 horas
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }
        });
    });
};

// Exportar las funciones
module.exports = {
    login,
    verifyAuth,
    logout,
};