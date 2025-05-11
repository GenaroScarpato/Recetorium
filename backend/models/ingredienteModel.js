const mongoose = require('mongoose');

const ingredienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
}, {versionKey  : false});

const Ingrediente = mongoose.model('Ingrediente', ingredienteSchema);

const getTodos = async () => {
    return await Ingrediente.find();
}


const getById = async (id) => {
    return await Ingrediente.findById(id);
}

const deleteById = async (id) => {
    try {
        const recetasModel = require('./recetaModel');
        const recetasConIngrediente = await recetasModel.buscarPorIngredientes(id);

        if (recetasConIngrediente.length > 0) {
            await Promise.all(
                recetasConIngrediente.map(async (receta) => {
                    await recetasModel.deleteById(receta._id);  // Eliminamos cada receta por su ID
                })
            );
        }
        const ingredienteEliminado = await Ingrediente.findByIdAndDelete(id);

        return {
            ingredienteEliminado,
            recetasEliminadas: recetasConIngrediente.length
        };
    } catch (error) {
        throw new Error(`Error al eliminar el ingrediente y sus recetas: ${error.message}`);
    }
};


const updateById = async (id, ingredienteActualizado) => {
    return await Ingrediente.findByIdAndUpdate(id, ingredienteActualizado, { new: true });
}

const add = async (nuevoIngrediente) => {
    const ingrediente = new Ingrediente(nuevoIngrediente);
    return await ingrediente.save(); 
};

const getByName = async (nombre) => {
    return await Ingrediente.findOne({
        nombre: { $regex: new RegExp(`^${nombre.trim()}$`, 'i') }
    });
};



module.exports = {
    Ingrediente,
    getTodos,
    getById,
    deleteById,
    updateById,
    add,
    getByName,
}
