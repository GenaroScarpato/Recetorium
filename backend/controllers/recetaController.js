const fs = require('fs'); // Importa el módulo "fs" para manejar archivos
const path = require('path'); // Importa el módulo "path" para manejar rutas
const fileUpload = require('express-fileupload'); // Para manejar la subida de archivos
const cloudinary = require('../config/cloudinaryConfig'); // Importa la configuración de Cloudinary
const { model } = require("mongoose");
const recetasModel = require("../models/recetaModel");
const comentarioModel = require("../models/comentarioModel");
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
  
      console.log("📤 PATCH recibido:", recetaActualizada);
  
      // Subida de nueva imagen (opcional)
      if (req.files && req.files.foto) {
        const file = req.files.foto;
  
        if (!file.tempFilePath) {
          console.error("❌ Archivo sin ruta temporal:", file);
          return res.status(400).json({ error: 'Archivo de imagen no válido' });
        }
  
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: 'recetas',
        });
  
        fs.unlink(file.tempFilePath, (err) => {
          if (err) {
            console.error("⚠️ Error al eliminar archivo temporal:", err);
          } else {
            console.log("🧹 Archivo temporal eliminado:", file.tempFilePath);
          }
        });
  
        recetaActualizada.foto = result.secure_url;
      }
  
      // Actualiza solo con los campos nuevos (no mergeamos con la receta existente)
      console.log("🛠️ Campos finales para actualizar:", recetaActualizada);
  
      const updatedReceta = await recetasModel.updateById(id, recetaActualizada);
  
      if (updatedReceta) {
        res.status(200).json({
          message: `Receta con ID ${id} actualizada correctamente`,
          updatedReceta,
        });
      } else {
        res.status(404).json({ error: `Receta con ID ${id} no encontrada` });
      }
    } catch (error) {
      console.error("💥 Error en PATCH updateById:", error);
      res.status(500).json({ error: 'Error al actualizar la receta', message: error.message });
    }
  };

const add = async (req, res) => {
    try {
        let fotoUrl = null;

        // Caso 1: Si se sube un archivo de imagen
        if (req.files && req.files.foto) {
            const file = req.files.foto;

            // Verifica si el archivo tiene una ruta temporal
            if (!file.tempFilePath) {
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

            fotoUrl = result.secure_url; // URL de la imagen subida a Cloudinary
        }
        // Caso 2: Si se proporciona una URL de imagen directamente
        else if (req.body.foto) {
            fotoUrl = req.body.foto; // Usa la URL proporcionada en el cuerpo de la solicitud
        }
        // Caso 3: Si no se proporciona ninguna imagen
        else {
            fotoUrl = 'https://ejemplo.com/imagen-predeterminada.jpg'; // URL de imagen predeterminada
        }

        // Asegúrate de que "ingredientes" sea un array
        let ingredientesArray = Array.isArray(req.body.ingredientes) ? req.body.ingredientes : [];

        // Crea la receta con la URL de la imagen y los ingredientes
        const nuevaReceta = {
            ...req.body, // Todos los campos de la receta
            foto: fotoUrl, // URL de la imagen (subida a Cloudinary, proporcionada o predeterminada)
            ingredientes: ingredientesArray, // Usar el array de ingredientes
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

const agregarPaso = async (req, res) => {
    try {
        const { id } = req.params;
        const { orden, descripcion, imagen } = req.body;
        
        const receta = await recetasModel.getById(id);
        if (!receta) return res.status(404).json({ error: 'Receta no encontrada' });

        receta.pasos.push({ orden, descripcion, imagen });
        await receta.save();
        
        res.status(201).json(receta);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const obtenerRecetaConComentarios = async (req, res) => {
    try {
        const { id } = req.params;
        const receta = await recetasModel.getById(id)
            .populate('comentarios')
            .populate({
                path: 'comentarios.usuarioId',
                select: 'username'
            });
            
        if (!receta) return res.status(404).json({ error: 'Receta no encontrada' });
        
        res.json(receta);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const likeReceta = async (req, res) => {
    try {
      const { id } = req.params;
      const usuarioId = req.usuario._id.toString();

      const receta = await recetasModel.getById(id);
      if (!receta) return res.status(404).json({ error: 'Receta no encontrada' });
  
      if (receta.likes.includes(usuarioId)) {
        return res.status(400).json({ error: 'Ya has dado like a esta receta' });
      }
  
      receta.likes.push(usuarioId);
      receta.likeCount = receta.likes.length;
      await receta.save();
  
      res.status(200).json({ message: 'Like agregado', likeCount: receta.likeCount });
    } catch (error) {
      console.error("💥 Error en likeReceta:", error.message);
      res.status(500).json({ error: error.message });
    }
  };
  
  const unlikeReceta = async (req, res) => {
    try {
      const { id } = req.params;
      const usuarioId = req.usuario._id.toString();
  
      const receta = await recetasModel.getById(id);
      if (!receta) return res.status(404).json({ error: 'Receta no encontrada' });
  
      const index = receta.likes.indexOf(usuarioId);
      if (index === -1) {
        return res.status(400).json({ error: 'No has dado like a esta receta' });
      }
  
      receta.likes.splice(index, 1);
      receta.likeCount = receta.likes.length;
      await receta.save();
  
      res.status(200).json({ message: 'Like removido', likeCount: receta.likeCount });
    } catch (error) {
      console.error("💥 Error en unlikeReceta:", error.message);
      res.status(500).json({ error: error.message });
    }
  };
  
const getLikesReceta = async (req, res) => {
    try {
        const { id } = req.params;
        const receta = await recetasModel.getById(id).populate('likes', 'username');
        
        if (!receta) return res.status(404).json({ error: 'Receta no encontrada' });
        
        res.json({
            likeCount: receta.likeCount,
            likes: receta.likes
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const agregarComentario = async (req, res) => {
    try {
        const { id } = req.params;
        const { texto } = req.body;
        const usuarioId = req.usuario._id;

        const receta = await recetasModel.getById(id);
        if (!receta) return res.status(404).json({ error: 'Receta no encontrada' });

        const nuevoComentario = await comentarioModel.add(usuarioId, id, texto);

        receta.comentarios.push(nuevoComentario._id);
        await receta.save();

        const comentarioPopulado = await comentarioModel.getById(nuevoComentario._id);

        res.status(201).json(comentarioPopulado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

  
  const getComentariosReceta = async (req, res) => {
    try {
      const { id } = req.params;
      const comentarios = await comentarioModel.getByReceta(id);
      res.json(comentarios);
    } catch (error) {
      console.error("💥 Error en getComentariosReceta:", error.message);
      res.status(500).json({ error: error.message });
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
    calcularCostoReceta,
    agregarPaso,
    obtenerRecetaConComentarios,
    likeReceta,
    unlikeReceta,
    getLikesReceta,
    agregarComentario,
    getComentariosReceta
};