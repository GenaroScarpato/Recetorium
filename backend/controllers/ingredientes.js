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
        const { nombre } = req.body; // Obtiene el nombre del ingrediente del cuerpo de la petición

        // Verificar si el ingrediente ya existe en la base de datos
        const ingredienteExistente = await ingredientesModel.getByName(nombre); // Llama a la función para buscar por nombre
        if (ingredienteExistente) {
            return res.status(400).json({
                message: 'El ingrediente ya existe'
            });
        }

        // Si no existe, agregar el nuevo ingrediente
        const nuevoIngrediente = req.body;
        const ingredienteAgregado = await ingredientesModel.add(nuevoIngrediente);

        res.status(201).json({
            message: 'Ingrediente agregado exitosamente',
            ingrediente: ingredienteAgregado // Retorna el ingrediente agregado
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
        const nuevosIngredientes = req.body; // Obtiene el array de ingredientes del cuerpo de la petición

        // Verificar y agregar solo los ingredientes que no existen
        const ingredientesAgregados = await Promise.all(
            nuevosIngredientes.map(async (nuevoIngrediente) => {
                const { nombre } = nuevoIngrediente;

                // Verificar si el ingrediente ya existe
                const ingredienteExistente = await ingredientesModel.getByName(nombre);

                if (!ingredienteExistente) {
                    // Si no existe, lo agregamos a la base de datos
                    return await ingredientesModel.add(nuevoIngrediente);
                }
                return null; // Si existe, retornamos null
            })
        );

        // Filtramos los valores nulos (ingredientes duplicados)
        const ingredientesAgregadosFiltrados = ingredientesAgregados.filter(ingrediente => ingrediente !== null);

        // Respuesta con los ingredientes agregados
        res.status(201).json({
            message: 'Ingredientes agregados exitosamente',
            ingredientes: ingredientesAgregadosFiltrados, // Lista de ingredientes agregados
        });
    } catch (error) {
        res.status(500).json({
            message: 'Hubo un error al agregar los ingredientes',
            error: error.message,
        });
    }
};


module.exports = {
    getTodos,
    getById,
    deleteById,
    updateById,
    add,
    addMany
}
