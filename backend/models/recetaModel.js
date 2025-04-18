const mongoose = require('mongoose');
const { Ingrediente } = require('../models/ingredienteModel');
const { consultarPrecio } = require('../services/preciosService');
const Usuario = require('../models/usuarioModel'); // ⚠️ Importante para validar el rol CHEF

const pasoRecetaSchema = new mongoose.Schema({
  orden: { type: Number, required: true },
  descripcion: { type: String, required: true },
}, { _id: false });

const recetaSchema = new mongoose.Schema({
  chef: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  nombre: { type: String, required: true },
  tipoComida: {
    type: String,
    enum: ['Entradas', 'Platos principales', 'Postres', 'Aperitivos', 'Sopas', 'Ensaladas', 'Bebidas'],
    required: true
  },
  tipoCocina: {
    type: String,
    enum: ['Cocina Italiana', 'Cocina Mexicana', 'Cocina China', 'Cocina Japonesa', 'Cocina India', 'Cocina Mediterránea', 'Cocina Francesa', 'Cocina Española'],
    required: true
  },
  ingredientes: [
    {
      ingrediente: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingrediente', required: true },
      cantidad: { type: Number, required: true },
      unidad: {
        type: String,
        enum: ['unidades', 'gramos', 'ml', 'tazas', 'cucharadas', 'kg', 'lt'],
        required: true
      }
    }
  ],
  metodoCoccion: {
    type: String,
    enum: ['Al horno', 'A la parrilla', 'A la plancha', 'Frito', 'Hervido', 'Al vapor', 'Crudo'],
    required: true
  },
  tiempoPreparacion: {
    type: String,
    enum: ['Menos de 15 minutos', 'Entre 15 y 30 minutos', 'Entre 30 minutos y 1 hora', 'Más de 1 hora'],
    required: true
  },
  nivelDificultad: {
    type: String,
    enum: ['Fácil', 'Intermedio', 'Difícil'],
    required: true
  },
  ingredientePrincipal: {
    type: String,
    enum: ['Carne', 'Pollo', 'Pescado', 'Verduras', 'Frutas', 'Granos', 'Mariscos'],
    required: true
  },
  temporada: {
    type: String,
    enum: ['Verano', 'Invierno', 'Primavera', 'Otoño', 'Todo el año'],
    required: false
  },
  pasos: [pasoRecetaSchema],
  comentarios: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comentario'
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  }],
  likeCount: { type: Number, default: 0 },
  foto: { type: String, required: true }
}, { versionKey: false });

const Receta = mongoose.model('Receta', recetaSchema);

// Verifica si los ingredientes existen
const verificarIngredientesExistentes = async (ingredientes) => {
  const ids = ingredientes.map(item => item.ingrediente);
  const ingredientesExistentes = await Ingrediente.find({ _id: { $in: ids } });
  return ingredientesExistentes.length === ids.length;
};

// GET ALL
const getAll = async () => {
  return await Receta.find()
    .populate({
      path: 'chef',
      select: 'username foto'
    })
    .populate({
      path: 'ingredientes.ingrediente',
      select: 'nombre'
    });
};

// GET BY ID
const getById = async (id) => {
  return await Receta.findById(id)
    .populate({
      path: 'chef',
      select: 'username foto'
    })
    .populate({
      path: 'ingredientes.ingrediente',
      select: 'nombre'
    });
};

// DELETE
const deleteById = async (id) => {
  return await Receta.findByIdAndDelete(id);
};

// UPDATE
const updateById = async (id, recetaActualizada) => {
  // Validar ingredientes
  if (recetaActualizada.ingredientes) {
    const existen = await verificarIngredientesExistentes(recetaActualizada.ingredientes);
    if (!existen) {
      throw new Error('Uno o más ingredientes no existen en la base de datos');
    }
  }

  // Validar rol del chef
  if (recetaActualizada.chef) {
    const usuarioChef = await Usuario.findById(recetaActualizada.chef);
    if (!usuarioChef || usuarioChef.role !== 'CHEF') {
      throw new Error('El usuario asignado no tiene rol de CHEF');
    }
  }

  return await Receta.findByIdAndUpdate(id, recetaActualizada, { new: true })
    .populate({
      path: 'chef',
      select: 'username foto'
    })
    .populate({
      path: 'ingredientes.ingrediente',
      select: 'nombre -_id'
    });
};

// ADD
const add = async (nuevaReceta) => {
  const recetaExistente = await Receta.findOne({ nombre: nuevaReceta.nombre });
  if (recetaExistente) {
    throw new Error(`La receta ${nuevaReceta.nombre} ya existe`);
  }

  const existen = await verificarIngredientesExistentes(nuevaReceta.ingredientes);
  if (!existen) {
    throw new Error('Uno o más ingredientes no existen en la base de datos');
  }

  // Validar rol del chef
  if (nuevaReceta.chef) {
    const usuarioChef = await Usuario.findById(nuevaReceta.chef);
    if (!usuarioChef || usuarioChef.role !== 'CHEF') {
      throw new Error('El usuario asignado no tiene rol de CHEF');
    }
  }

  const receta = new Receta(nuevaReceta);
  return await receta.save();
};

// Buscar por ingredientes
const buscarPorIngredientes = async (ingredientesId) => {
  return await Receta.find({
    'ingredientes.ingrediente': { $all: ingredientesId }
  })
    .populate({
      path: 'chef',
      select: 'username foto'
    })
    .populate({
      path: 'ingredientes.ingrediente',
      select: 'nombre'
    });
};

// Buscar por tipo de comida
const buscarPorTipoComida = async (tiposComida) => {
  return await Receta.find({
    tipoComida: { $in: tiposComida }
  })
    .populate({
      path: 'chef',
      select: 'username foto'
    })
    .populate({
      path: 'ingredientes.ingrediente',
      select: 'nombre'
    });
};

// Calcular costo receta
async function calcularCostoReceta(idReceta) {
  try {
    const receta = await getById(idReceta);
    if (!receta) {
      throw new Error(`La receta con ID ${idReceta} no fue encontrada.`);
    }

    const detallesIngredientes = await Promise.all(
      receta.ingredientes.map(async (ingrediente) => {
        const precio = await consultarPrecio(ingrediente.ingrediente.nombre);

        let cantidadAjustada = ingrediente.cantidad;
        if (ingrediente.unidad === 'gramos') {
          cantidadAjustada /= 1000;
        } else if (ingrediente.unidad === 'ml') {
          cantidadAjustada /= 1000;
        }

        return {
          nombre: ingrediente.ingrediente.nombre,
          cantidad: ingrediente.cantidad,
          unidad: ingrediente.unidad,
          costo: precio ? cantidadAjustada * precio : 0
        };
      })
    );

    const costoTotal = detallesIngredientes.reduce((sum, i) => sum + i.costo, 0);
    return { detallesIngredientes, costoTotal };
  } catch (error) {
    console.error('Error al calcular el costo de la receta:', error.message);
    throw error;
  }
}

// GET RECETAS BY CHEF ID
const getByChefId = async (chefId) => {
  return await Receta.find({ chef: chefId })
    .populate({
      path: 'chef',
      select: 'username foto'
    })
    .populate({
      path: 'ingredientes.ingrediente',
      select: 'nombre'
    });
};
module.exports = {
  Receta,
  getAll,
  getById,
  deleteById,
  updateById,
  add,
  buscarPorIngredientes,
  buscarPorTipoComida,
  calcularCostoReceta,
  getByChefId
};
