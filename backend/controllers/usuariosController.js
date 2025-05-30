const usuarioModel = require('../models/usuarioModel');
const fs = require('fs'); // Importa el módulo "fs" para manejar archivos
const path = require('path'); // Importa el módulo "path" para manejar rutas
const fileUpload = require('express-fileupload'); // Para manejar la subida de archivos
const cloudinary = require('../config/cloudinaryConfig'); // Importa la configuración de Cloudinary
const Receta = require('../models/recetaModel'); // Importa el modelo de receta

// Obtener todos los usuarios
const getUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioModel.getUsuarios(); // Obtener todos los usuarios
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al obtener los usuarios' });
    }
}

// Obtener un usuario por ID
const getUsuarioById = async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await usuarioModel.getById(id);
        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ error: 'usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ error: 'Hubo un error al obtener el usuario' });
    }
}

// Agregar un nuevo usuario
const addUsuario = async (req, res) => {
    try {
        const { username, password, role = 'CLIENTE' } = req.body; // Asigna 'CLIENTE' por defecto

        // Verificar si el usuario ya existe
        const existeUsuario = await usuarioModel.getByName(username);
        if (existeUsuario) {
            return res.status(400).json({
                message: 'El nombre de usuario ya está en uso'
            });
        }

        // Verifica si se subió una foto
        let fotoUrl = null;
        if (req.files && req.files.foto) {
            const file = req.files.foto;

            // Verifica si el archivo tiene una ruta temporal
            if (!file.tempFilePath) {
                return res.status(400).json({ error: 'El archivo de imagen no es válido' });
            }

            // Sube la imagen a Cloudinary
            const result = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'usuarios', // Opcional: Organiza las imágenes en una carpeta
            });

            // Elimina el archivo temporal después de subirlo a Cloudinary
            fs.unlink(file.tempFilePath, (err) => {
                if (err) {
                    console.error("Error al eliminar el archivo temporal:", err);
                } else {
                    console.log("Archivo temporal eliminado:", file.tempFilePath);
                }
            });

            // Obtiene la URL de la foto subida
            fotoUrl = result.secure_url;
        }

        // Si no hay foto, se asigna un valor por defecto
        const nuevoUsuario = { 
            username, 
            password, 
            role, // Aquí se usa el valor por defecto si no se proporciona
            foto: fotoUrl || 'url_default_foto_perfil'  // URL por defecto si no se sube foto
        };

        const usuarioAgregado = await usuarioModel.add(nuevoUsuario);

        res.status(201).json({
            message: 'Usuario agregado exitosamente',
            usuario: usuarioAgregado
        });
    } catch (error) {
        res.status(500).json({
            message: 'Hubo un error al agregar al usuario',
            error: error.message
        });
    }
};

// Actualizar un usuario por ID
const updateById = async (req, res) => {
    const { id } = req.params;
    try {
        // Verifica si se subió una nueva foto
        let fotoUrl = req.body.foto; // Se preserva la foto si no se actualiza
        if (req.files && req.files.foto) {
            const file = req.files.foto;

            // Verifica si el archivo tiene una ruta temporal
            if (!file.tempFilePath) {
                return res.status(400).json({ error: 'El archivo de imagen no es válido' });
            }

            // Sube la nueva imagen a Cloudinary
            const result = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'usuarios', // Opcional: Organiza las imágenes en una carpeta
            });

            // Elimina el archivo temporal después de subirlo a Cloudinary
            fs.unlink(file.tempFilePath, (err) => {
                if (err) {
                    console.error("Error al eliminar el archivo temporal:", err);
                } else {
                    console.log("Archivo temporal eliminado:", file.tempFilePath);
                }
            });

            // Actualiza la foto con la nueva URL
            fotoUrl = result.secure_url;
        }

        // Combina los datos del usuario con los nuevos (si hay)
        const updatedUser = await usuarioModel.updateById(id, { ...req.body, foto: fotoUrl });

        if (updatedUser) {
            res.status(200).json({ message: `Usuario con ID ${id} actualizado correctamente`, updatedUser });
        } else {
            res.status(404).json({ error: `Usuario con ID ${id} no encontrado` });
        }
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al actualizar el usuario' });
    }
}

// Eliminar un usuario por ID
const deleteById = async (req, res) => {
    const { id } = req.params;
    try {
        await usuarioModel.deleteById(id);
        res.status(200).json({ message: `Usuario con ID ${id} eliminado correctamente` });
    } catch (error) {
        res.status(404).json({ error: `Usuario con ID ${id} no encontrado` });
    }
};

// Obtener chefs
const getChefs = async (req, res) => {
    try {
        const chefs = await usuarioModel.getChefs();
        res.json(chefs);
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al obtener los chefs' });
    }
};

const getRecetasGuardadas = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await usuarioModel.getRecetasGuardadas(id);
        
        if (!result) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        res.status(200).json(result.recetasGuardadas);
    } catch (error) {
        console.error('Error al obtener recetas guardadas:', error);
        res.status(500).json({ error: 'Error al obtener recetas guardadas' });
    }
};

// Guardar receta
const save = async (req, res) => {
    const { userId, recetaId } = req.body;
    try {
        // Verificar si la receta existe
        const receta = await Receta.getById(recetaId);
        if (!receta) {
            return res.status(404).json({ error: 'Receta no encontrada' });
        }
        
        // Verificar si ya está guardada
        const usuario = await usuarioModel.getById(userId);
        if (usuario && Array.isArray(usuario.recetasGuardadas) && usuario.recetasGuardadas.includes(recetaId)) {
            return res.status(400).json({ error: 'La receta ya está guardada' });
        }
        
        const usuarioActualizado = await usuarioModel.guardarReceta(userId, recetaId);
        res.status(200).json(usuarioActualizado.recetasGuardadas);
    } catch (error) {
        console.error('Error al guardar receta:', error);
        res.status(500).json({ error: 'Error al guardar receta' });
    }
};

// Eliminar receta guardada
const unsave = async (req, res) => {
    const { userId, recetaId } = req.body;
    try {
        const usuarioActualizado = await usuarioModel.eliminarRecetaGuardada(userId, recetaId);
        
        if (!usuarioActualizado) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        res.status(200).json(usuarioActualizado.recetasGuardadas);
    } catch (error) {
        console.error('Error al eliminar receta guardada:', error);
        res.status(500).json({ error: 'Error al eliminar receta guardada' });
    }
};

// Obtener usuarios seguidos
const getSeguidos = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await usuarioModel.getSeguidos(id);
        if (!result) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json(result.siguiendo || []); // ← importante
    } catch (error) {
        console.error('Erroor al obtener seguidos:', error);
        res.status(500).json({ error: 'Error al obtener seguidos' });
    }
};

// Obtener seguidores
const getSeguidores = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await usuarioModel.getSeguidores(id);

        if (!result) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json(result.seguidores || []); // ← importante
    } catch (error) {
        console.error('Error al obtener seguidores:', error);
        res.status(500).json({ error: 'Error al obtener seguidores' });
    }
};


// Seguir usuario
const seguirUsuario = async (req, res) => {
    const { seguidorId, usuarioId } = req.body;
    
    try {
        if (seguidorId === usuarioId) {
            return res.status(400).json({ error: 'No puedes seguirte a ti mismo' });
        }
        
        const usuarioASeguir = await usuarioModel.getById(usuarioId);
        if (!usuarioASeguir) {
            return res.status(404).json({ error: 'Usuario a seguir no encontrado' });
        }
        
        const seguidor = await usuarioModel.seguirUsuario(seguidorId, usuarioId);
        res.status(200).json(seguidor.siguiendo);
    } catch (error) {
        console.error('Error al seguir usuario:', error);
        res.status(500).json({ error: 'Error al seguir usuario' });
    }
};

// Dejar de seguir
const dejarDeSeguir = async (req, res) => {
    const { seguidorId, usuarioId } = req.body;  // Cambié req.params a req.body

    try {
        const seguidor = await usuarioModel.dejarDeSeguir(seguidorId, usuarioId);

        if (!seguidor) {
            return res.status(404).json({ error: 'Seguidor no encontrado' });
        }
//validar que el usuario este en seguidos
  if(!seguidor.siguiendo.includes(usuarioId)) {
    console.log("usuario no esta seguido");
  }


        res.status(200).json(seguidor.siguiendo);
    } catch (error) {
        console.error('Error al dejar de seguir:', error);
        res.status(500).json({ error: 'Error al dejar de seguir' });
    }
};

module.exports = {
    getUsuarios,
    getUsuarioById,
    addUsuario,
    deleteById,
    updateById,
    getChefs,
    getRecetasGuardadas,
    save,
    unsave,
    getSeguidos,
    getSeguidores,
    seguirUsuario,
    dejarDeSeguir
};
