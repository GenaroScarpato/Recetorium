const comentariosModel = require("../models/comentarioModel"); // Cambiado para usar comentariosModel

const add = async (req, res) => {
    try {
        const { recetaId, texto } = req.body;
        const usuarioId = req.usuario.id;
        
        // 1. Crea el comentario
        const nuevoComentario = await comentariosModel.add(usuarioId, recetaId, texto);
        
        // 2. Actualiza la receta para incluir el comentario
        await Receta.findByIdAndUpdate(
            recetaId,
            { $push: { comentarios: nuevoComentario._id } }
        );
        
        res.status(201).json(nuevoComentario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getTodos = async (req, res) => {
    try {
        const comentarios = await comentariosModel.getTodos();
        res.json(comentarios);
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al obtener los comentarios' });
    }
}

const getById = async (req, res) => {
    const { id } = req.params;

    try {
        const comentario = await comentariosModel.getById(id);

        if (comentario) {
            res.json(comentario);
        } else {
            res.status(404).json({ id, encontrado: false });
        }
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al obtener el comentario' });
    }
}


const getByReceta = async (req, res) => {
    const { id : recetaId } = req.params;
         
    try {
        const comentarios = await comentariosModel.getByReceta(recetaId); // Usando getByReceta

        if (comentarios.length > 0) {
            res.json(comentarios);
        } else {
            res.status(404).json({ mensaje: 'No se encontraron comentarios para esta receta' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al obtener los comentarios' });
    }
}

const getByUser = async (req, res) => {
    const usuarioId = req.params.id; // Obtenemos el ID del usuario desde los parámetros de la solicitud

    try {
        const comentarios = await comentariosModel.getByUser(usuarioId); // Usando getByUser

        if (comentarios.length > 0) {
            res.json(comentarios);
        } else {
            res.status(404).json({ mensaje: 'No se encontraron comentarios para este usuario' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al obtener los comentarios del usuario' });
    }
}

const deleteById = async (req, res) => {
    const { id } = req.params;
    const { usuario } = req; // Obtiene el usuario del token

    try {
        // Primero, busca el comentario por ID
        const comentario = await comentariosModel.getById(id);

        // Verifica si el comentario existe
        if (!comentario) {
            return res.status(404).json({ error: `Comentario con ID ${id} no encontrado` });
        }

        // Agrega console.log para depuración
        

        // Verifica si el usuario es el autor del comentario o un administrador
        const comentarioUsuarioId = comentario.usuarioId._id.toString(); // Accede al _id del usuario en el comentario
       
        if (comentarioUsuarioId !== usuario._id.toString() && usuario.role !== 'ADMIN') {
            return res.status(403).json({ error: 'No tienes permisos para eliminar este comentario' });
        }

        // Si pasa las verificaciones, elimina el comentario
        await comentariosModel.deleteById(id);
        res.status(200).json({ message: `Comentario con ID ${id} eliminado correctamente` });

    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al eliminar el comentario' });
    }
};


module.exports = {
    add,
    getTodos,
    getById,
    getByReceta,
    getByUser,
    deleteById
}
