const express = require('express');
const { getUsuarios, getUsuarioById, addUsuario,deleteById,updateById } = require('../controllers/usuariosController'); // Ajusta la ruta si es necesario
const { validarJwt,validarAdmin } = require('../middlewares/validation');

const router = express.Router();

router.get('/',[validarJwt,validarAdmin], getUsuarios); // Obtener todos los usuarios
router.get('/:id',[validarJwt], getUsuarioById); // Obtener un usuario por ID
router.post('/', addUsuario); // Crear un nuevo usuario
router.delete('/:id',[validarJwt,validarAdmin], deleteById); // Eliminar un usuario por ID
router.patch('/:id',[validarJwt,validarAdmin], updateById);

module.exports = router;
