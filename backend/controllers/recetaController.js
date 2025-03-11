const fs = require('fs'); // Importa el módulo "fs" para manejar archivos
const path = require('path'); // Importa el módulo "path" para manejar rutas
const fileUpload = require('express-fileupload'); // Para manejar la subida de archivos
const cloudinary = require('../config/cloudinaryConfig'); // Importa la configuración de Cloudinary
const { model } = require("mongoose");
const recetasModel = require("../models/recetaModel");

const getAll = async (req, res) => {    
    try {
        const recetas = await recetasModel.getAll();
        res.json(recetas);
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al obtener las recetas' });
    }
}

const getById = async (req, res) => {
    const { id } = req.params;

    try {
        const receta = await recetasModel.getById(id);

        if (receta) {
            res.json(receta);
        } else {
            res.status(404).json({ error: 'Receta no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al obtener la receta' });
    }
}

const deleteById = async (req, res) => {
    const { id } = req.params;
    try {
        await recetasModel.deleteById(id);
        res.status(200).json({ message: `Receta con ID ${id} eliminada correctamente` });
    } catch (error) {
        res.status(404).json({ error: `Receta con ID ${id} no encontrada` });
    }
};

const updateById = async (req, res) => {
    const { id } = req.params;

    try {
        let recetaActualizada = { ...req.body };

        // Verifica si se subió una nueva imagen
        if (req.files && req.files.foto) {
            const file = req.files.foto;

            // Verifica si el archivo tiene una ruta temporal
            if (!file.tempFilePath) {
                console.error("El archivo no tiene una ruta temporal:", file);
                return res.status(400).json({ error: 'El archivo de imagen no es válido' });
            }

            // Sube la nueva imagen a Cloudinary
            const result = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'recetas', // Opcional: Organiza las imágenes en una carpeta
            });

            // Elimina el archivo temporal después de subirlo a Cloudinary
            fs.unlink(file.tempFilePath, (err) => {
                if (err) {
                    console.error("Error al eliminar el archivo temporal:", err);
                } else {
                    console.log("Archivo temporal eliminado:", file.tempFilePath);
                }
            });

            // Actualiza el campo "foto" con la nueva URL
            recetaActualizada.foto = result.secure_url;
        }

        // Obtén la receta actual para preservar los campos no enviados
        const recetaExistente = await recetasModel.getById(id);
        if (!recetaExistente) {
            return res.status(404).json({ error: `Receta con ID ${id} no encontrada` });
        }

        // Combina los campos existentes con los nuevos
        const datosActualizados = { ...recetaExistente.toObject(), ...recetaActualizada };

        // Actualiza la receta en la base de datos
        const updatedReceta = await recetasModel.updateById(id, datosActualizados);

        if (updatedReceta) {
            res.status(200).json({
                message: `Receta con ID ${id} actualizada correctamente`,
                updatedReceta,
            });
        } else {
            res.status(404).json({ error: `Receta con ID ${id} no encontrada` });
        }
    } catch (error) {
        console.error("Error en updateById:", error); // Agrega este log para ver el error
        res.status(500).json({ error: 'Hubo un error al actualizar la receta', message: error.message });
    }
};
const add = async (req, res) => {
    try {
        // Verifica si se subió una imagen
        if (!req.files || !req.files.foto) {
            return res.status(400).json({ error: 'No se subió ninguna imagen' });
        }

        const file = req.files.foto;

        // Verifica si el archivo tiene una ruta temporal
        if (!file.tempFilePath) {
            return res.status(400).json({ error: 'El archivo de imagen no es válido' });
        }

        // Sube la nueva imagen a Cloudinary
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'recetas', // Opcional: Organiza las imágenes en una carpeta
        });

        // Parsea el campo "ingredientes" (que es un JSON stringificado) a un array de objetos
        let ingredientesArray = [];
        if (req.body.ingredientes) {
            try {
                ingredientesArray = JSON.parse(req.body.ingredientes);
            } catch (error) {
                return res.status(400).json({ error: 'El campo "ingredientes" no es un JSON válido' });
            }
        }

        // Crea la receta con la URL de la imagen y los ingredientes parseados
        const nuevaReceta = {
            ...req.body, // Todos los campos de la receta
            foto: result.secure_url, // URL de la imagen subida a Cloudinary
            ingredientes: ingredientesArray, // Usar el array parseado
        };

        // Guarda la receta en la base de datos
        const recetaAgregada = await recetasModel.add(nuevaReceta);

        res.status(201).json({
            message: 'Receta agregada exitosamente',
            receta: recetaAgregada,
        });
    } catch (error) {
        // Manejo detallado de errores de validación
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                message: 'Error de validación',
                errors,
            });
        }
        res.status(500).json({
            message: 'Hubo un error al agregar la receta',
            error: error.message,
        });
    }
};


const buscarRecetasPorIngredientes = async (req, res) => {
    const { ingredientes } = req.body; // IDs de ingredientes recibidos en el cuerpo de la solicitud
    try {
        const recetas = await recetasModel.buscarPorIngredientes(ingredientes);

        if (recetas.length > 0) {
            res.json(recetas);
        } else {
            res.status(404).json({ message: 'No se encontraron recetas con los ingredientes especificados' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al buscar las recetas' });
    }
};

const buscarPorTipoComida = async (req, res) => {
    try {
        let tipoComida = req.body.tipoComida;

        // Verifica si tipoComida está definido
        if (!tipoComida) {
            return res.status(400).json({ error: 'El parámetro tipoComida es requerido' });
        }

        // Si tipoComida es un string, conviértelo a array (maneja un solo valor o varios separados por comas)
        if (typeof tipoComida === 'string') {
            tipoComida = tipoComida.includes(',')
                ? tipoComida.split(',') // Si tiene coma, lo convierte en array
                : [tipoComida]; // Si no, lo convierte en un array con un solo valor
        }

        // Llama al modelo con el array de tipoComida
        const recetas = await recetasModel.buscarPorTipoComida(tipoComida);

        if (recetas.length > 0) {
            res.json(recetas);
        } else {
            res.status(404).json({ message: 'No se encontraron recetas para los tipos de comida especificados' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al buscar las recetas', detalle: error.message });
    }
};

const calcularCostoReceta = async (req, res) => {
    try {
        const { id } = req.params;
        const { detallesIngredientes, costoTotal } = await recetasModel.calcularCostoReceta(id);
        res.json({ detallesIngredientes, costoTotal });
    } catch (error) {
        res.status(500).json({ error: 'Error al calcular el costo de la receta', message: error.message });
    }
};







module.exports = {
    getAll,
    getById,
    deleteById,
    updateById,
    add,
    buscarRecetasPorIngredientes,
    buscarPorTipoComida,
    calcularCostoReceta

};