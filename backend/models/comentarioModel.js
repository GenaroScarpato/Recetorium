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
const getTodos = async () => {
  return await Comentario.find()
    .populate('usuarioId', 'username -_id')  // Selecciona solo el 'username' y excluye el '_id'
    .populate('recetaId', 'nombre -_id');    // Selecciona solo el 'titulo' y excluye el '_id'
};


const getById = async (id) => {
    return await Comentario.findById(id)
        .populate('usuarioId', 'username')
        .populate('recetaId', 'nombre');
};

const getByReceta = async (recetaId) => {
    return await Comentario.find({ recetaId }).populate('usuarioId', 'username'); // Poblamos el username del usuario
};

const getByUser = async (usuarioId) => {
    return await Comentario.find({ usuarioId }).populate('recetaId', 'nombre'); // Poblamos el título de la receta
};

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
