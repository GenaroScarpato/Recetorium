const mongoose = require('mongoose');
const hashPassword = require('../middlewares/hashPassword');

// Definir el esquema de usuario
const usuarioSchema = new mongoose.Schema({
    foto: { type: String, required: false },
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        required: true,
        enum: ['CLIENTE', 'ADMIN', 'CHEF'], // Define los roles permitidos
    },
    recetasGuardadas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Receta', // Referencia al modelo Receta
    }],
    seguidores: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario', // Referencia a usuarios que siguen a este usuario
        }
    ],
    siguiendo: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario', // Referencia a usuarios que este usuario sigue
        }
    ],
}, { versionKey: false });

usuarioSchema.pre('save', hashPassword);
usuarioSchema.pre('findOneAndUpdate',hashPassword);

// Crear el modelo 'Usuario' para la colección 'usuarios'
const Usuario = mongoose.model('Usuario', usuarioSchema);

const getUsuarios = async () => {
    return await Usuario.find();
}

const getByName = async (username) => {
    return await Usuario.findOne({ username });  // Cambiar el argumento a un objeto
}

const getById = async (id) => {
    return await Usuario.findById(id).select('username foto role');
};

const add = async (newUser) => {
    const user = new Usuario(newUser);
    return await user.save(); 
};

const deleteById = async (id) => {
    return await Usuario.findByIdAndDelete(id);
}

const updateById = async (id, ingredienteActualizado) => {
    return await Usuario.findByIdAndUpdate(id, ingredienteActualizado, { new: true });
}

const getChefs = async () => {
    return await Usuario.find({ role: 'CHEF' }).select('username foto role seguidores');
};
const getRecetasGuardadas = async (userId) => {
    return await Usuario.findById(userId)
      .populate({
        path: 'recetasGuardadas',
        select: 'nombre descripcion foto tiempoPreparacion tipoComida tipoCocina ingredientes metodoCoccion nivelDificultad ingredientePrincipal temporada pasos comentarios likes likeCount',
        populate: {
          path: 'chef',
          select: 'username foto'
        }
      })
      .select('recetasGuardadas');
  };
  

  

const guardarReceta = async (userId, recetaId) => {
    return await Usuario.findByIdAndUpdate(
        userId,
        { $addToSet: { recetasGuardadas: recetaId } },
        { new: true }
    );
};

const eliminarRecetaGuardada = async (userId, recetaId) => {
    return await Usuario.findByIdAndUpdate(
        userId,
        { $pull: { recetasGuardadas: recetaId } },
        { new: true }
    );
};

// Métodos para seguimiento de usuarios
const getSeguidos = async (userId) => {
    return await Usuario.findById(userId)
        .populate({
            path: 'siguiendo',
            select: 'username foto role'
        })
        .select('siguiendo');
};

const getSeguidores = async (userId) => {
    return await Usuario.findById(userId)
        .populate({
            path: 'seguidores',
            select: 'username foto role'
        })
        .select('seguidores');
};

const seguirUsuario = async (seguidorId, usuarioId) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        // Añadir a siguiendo del seguidor
        const seguidor = await Usuario.findByIdAndUpdate(
            seguidorId,
            { $addToSet: { siguiendo: usuarioId } },
            { new: true, session }
        );
        
        // Añadir a seguidores del usuario seguido
        await Usuario.findByIdAndUpdate(
            usuarioId,
            { $addToSet: { seguidores: seguidorId } },
            { session }
        );
        
        await session.commitTransaction();
        return seguidor;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

const dejarDeSeguir = async (seguidorId, usuarioId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Quitar de siguiendo del seguidor
        const seguidor = await Usuario.findByIdAndUpdate(
            seguidorId,
            { $pull: { siguiendo: usuarioId } },
            { new: true, session }
        );

        // Quitar de seguidores del usuario
        await Usuario.findByIdAndUpdate(
            usuarioId,
            { $pull: { seguidores: seguidorId } },
            { session }
        );

        await session.commitTransaction();
        return seguidor;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};


module.exports = {
    Usuario,
    getUsuarios,
    getByName,
    getById,
    add,
    deleteById,
    updateById,
    getChefs,
    getRecetasGuardadas,
    guardarReceta,
    eliminarRecetaGuardada,
    getSeguidos,
    getSeguidores,
    seguirUsuario,
    dejarDeSeguir
    
};
