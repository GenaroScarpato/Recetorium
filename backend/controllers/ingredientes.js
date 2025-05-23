const ingredientesModel = require("../models/ingredienteModel");


const getTodos = async (req, res) => {    
    try {
        const ingredientes = await ingredientesModel.getTodos();
        res.json(ingredientes);
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al obtener los ingredientes' });
    }
}

const getById = async (req, res) => {
    const { id } = req.params;
   
    try {
        const ingrediente = await ingredientesModel.getById(id);

        if (ingrediente) {
            res.json(ingrediente);
        } else {
            res.status(404).json({ id, encontrado: false });
        }
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al obtener el ingrediente' });
    }
}

const deleteById = async (req, res) => {
    const { id } = req.params;
    try {
        // Eliminar el ingrediente y sus recetas asociadas
        const result = await ingredientesModel.deleteById(id);

        // Verificar si el ingrediente y las recetas asociadas fueron eliminados
        if (result.ingredienteEliminado) {
            res.status(200).json({
                message: `Ingrediente con ID ${id} y ${result.recetasEliminadas} recetas asociadas eliminadas correctamente.`
            });
        } else {
            // Si no se encuentra el ingrediente
            res.status(404).json({
                error: `Ingrediente con ID ${id} no encontrado en la base de datos.`
            });
        }
    } catch (error) {
        console.error('Error en el controlador de eliminación:', error.message);
        res.status(500).json({
            error: `Hubo un problema al intentar eliminar el ingrediente y sus recetas asociadas. Detalles: ${error.message}`
        });
    }
};


const updateById = async (req, res) => {
    const { id } = req.params;

   
    try {
        const updatedIngrediente = await ingredientesModel.updateById(id, req.body);

        if (updatedIngrediente) {
            res.status(200).json({ message: `Ingrediente con ID ${id} actualizado correctamente`, updatedIngrediente });
        } else {
            res.status(404).json({ error: `Ingrediente con ID ${id} no encontrado` });
        }
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al actualizar el ingrediente' });
    }
}

const add = async (req, res) => {
    try {
        let { nombre } = req.body;

        // Normalizar
        nombre = nombre.trim().toLowerCase();
        const nombreCapitalizado = nombre.charAt(0).toUpperCase() + nombre.slice(1);

        
        const ingredienteExistente = await ingredientesModel.getByName(nombre);
        if (ingredienteExistente) {
            return res.status(400).json({ message: 'El ingrediente ya existe' });
        }

        // Guardar con nombre capitalizado
        const ingredienteAgregado = await ingredientesModel.add({ nombre: nombreCapitalizado });

        res.status(201).json({
            message: 'Ingrediente agregado exitosamente',
            ingrediente: ingredienteAgregado
        });
    } catch (error) {
        res.status(500).json({
            message: 'Hubo un error al agregar el ingrediente',
            error: error.message
        });
    }
};

// METODO ADD PARA AGREGAR MULTIPLES INGREDIENTES EN UNA SOLA PETICIÓN
const addMany = async (req, res) => {
    try {
        const nuevosIngredientes = req.body;

        const ingredientesAgregados = await Promise.all(
            nuevosIngredientes.map(async (ingrediente) => {
                let nombre = ingrediente.nombre.trim().toLowerCase();
                const nombreCapitalizado = nombre.charAt(0).toUpperCase() + nombre.slice(1);

                const ingredienteExistente = await ingredientesModel.getByName(nombre);
                if (!ingredienteExistente) {
                    return await ingredientesModel.add({ nombre: nombreCapitalizado });
                }
                return null;
            })
        );

        const filtrados = ingredientesAgregados.filter(i => i !== null);

        res.status(201).json({
            message: 'Ingredientes agregados exitosamente',
            ingredientes: filtrados
        });
    } catch (error) {
        res.status(500).json({
            message: 'Hubo un error al agregar los ingredientes',
            error: error.message
        });
    }
};


module.exports = {
    getTodos,
    getById,
    deleteById,
    updateById,
    add,
    addMany,
}
