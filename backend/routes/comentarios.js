
const express = require('express');
const router = express.Router();
const { getTodos,getById, getByReceta, getByUser, add, deleteById } = require('../controllers/comentarioController'); // Asegúrate de que la ruta sea correcta
const { validarJwt , validarAdmin } = require('../middlewares/validation');


router.get('/' ,getTodos); // Obtener todos los comentarios
router.get('/receta/:recetaId', [validarJwt], getByReceta);
router.get('/:id',[validarJwt,validarAdmin], getById); // Obtener un comentario por ID
router.get('/usuario/:id',[validarJwt,validarAdmin],    getByUser); // Obtener comentarios por ID de usuario
router.post('/',[validarJwt], add);        // Crear un nuevo comentario
router.delete('/:id',[validarJwt,validarAdmin], deleteById); // Eliminar un comentario por ID


module.exports = router;
 