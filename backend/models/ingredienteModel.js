const mongoose = require('mongoose');

const ingredienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    foto: { type: String, required: true }
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
        console.log(`Recetas encontradas con el ingrediente ID ${id}:`, recetasConIngrediente);

        if (recetasConIngrediente.length > 0) {
            console.log(`Eliminando ${recetasConIngrediente.length} recetas con ingrediente de ID: ${id}`);
            await Promise.all(
                recetasConIngrediente.map(async (receta) => {
                    await recetasModel.deleteById(receta._id);  // Eliminamos cada receta por su ID
                    console.log(`Receta con ID ${receta._id} eliminada`);
                })
            );
        }
        const ingredienteEliminado = await Ingrediente.findByIdAndDelete(id);
        console.log(`Ingrediente eliminado:`, ingredienteEliminado);

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
    return await Ingrediente.findOne({ nombre });
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
