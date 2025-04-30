const express = require('express')
const router = express.Router()
const {getAll, getById, deleteById, updateById, add, buscarRecetasPorIngredientes,
     buscarPorTipoComida , calcularCostoReceta, agregarPaso, obtenerRecetaConComentarios,
      likeReceta, unlikeReceta, getLikesReceta, agregarComentario, getComentariosReceta, getMyRecipes}
     = require("../controllers/recetaController");
const { validarJwt, validarAdmin } = require('../middlewares/validation');


router.post('/buscarPorIngredientes', buscarRecetasPorIngredientes);
router.post('/buscarPorTipoComida', buscarPorTipoComida);
router.get('/calcularCostoReceta/:id', calcularCostoReceta);
router.get('/getMyRecipes', [validarJwt], getMyRecipes);
router.get('/', getAll);
router.get('/all', getAll);
router.get('/:id', getById);
router.delete('/:id',[validarJwt], deleteById);
router.patch('/:id', updateById)
router.post('/',[validarJwt], add);

 
router.post('/:id/pasos', agregarPaso);
router.get('/:id/completa', obtenerRecetaConComentarios);

// Likes
router.post('/:id/like', validarJwt, likeReceta);
router.post('/:id/unlike', validarJwt, unlikeReceta);
router.get('/:id/likes', getLikesReceta);

// Comentarios
router.post('/:id/comentarios', validarJwt, agregarComentario);
router.get('/:id/comentarios', getComentariosReceta);
module.exports = router;