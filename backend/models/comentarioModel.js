const mongoose = require('mongoose');

const comentarioSchema = new mongoose.Schema({
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    recetaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Receta', required: true },
    texto: { type: String, required: true },
    fecha: { type: Date, default: Date.now }
}, { versionKey: false });

const Comentario = mongoose.model('Comentario', comentarioSchema);

// Funciones de manejo de comentarios
const add = async (usuarioId, recetaId, texto) => {
    const nuevoComentario = new Comentario({ usuarioId, recetaId, texto });
    return await nuevoComentario.save();
};

// Obtener todos los comentarios con los datos poblados de usuario y receta
const getTodos = async () => {
    return await Comentario.find()
        .populate('usuarioId', 'username foto')  // Incluye 'username' y 'foto'
        .populate('recetaId', 'nombre -_id');    // Solo el 'nombre' de la receta
};

// Obtener un comentario por ID, con los datos poblados de usuario y receta
const getById = async (id) => {
    return await Comentario.findById(id)
        .populate('usuarioId', 'username foto')  // Incluye 'username' y 'foto'
        .populate('recetaId', 'nombre');         // Solo el 'nombre' de la receta
};

// Obtener comentarios por receta, con los datos poblados de usuario
const getByReceta = async (recetaId) => {
    return await Comentario.find({ recetaId })
        .populate('usuarioId', 'username foto'); // Trae también la foto del usuario
};

// Obtener comentarios por usuario, con el título de la receta poblado
const getByUser = async (usuarioId) => {
    return await Comentario.find({ usuarioId })
        .populate('recetaId', 'nombre'); // Trae solo el nombre de la receta
};

// Eliminar un comentario por ID
const deleteById = async (id) => {
    return await Comentario.findByIdAndDelete(id);
};

module.exports = {
    Comentario,
    getTodos,
    add,
    getByReceta,
    getByUser,
    getById,
    deleteById
};
