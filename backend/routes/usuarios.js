const express = require('express');
const { getUsuarios, getUsuarioById, addUsuario,deleteById,updateById ,getChefs, getRecetasGuardadas,
    save,
    unsave,
    getSeguidos,
    getSeguidores,
    seguirUsuario,
    dejarDeSeguir} = require('../controllers/usuariosController'); // Ajusta la ruta si es necesario
const { validarJwt,validarAdmin } = require('../middlewares/validation');

const router = express.Router();

router.get('/chefs',getChefs); // Obtener todos los chefs
router.get('/',[validarJwt,validarAdmin], getUsuarios); // Obtener todos los usuarios
router.get('/:id', getUsuarioById); // Obtener un usuario por ID
router.post('/', addUsuario); // Crear un nuevo usuario
router.delete('/:id',[validarJwt,validarAdmin], deleteById); // Eliminar un usuario por ID
router.patch('/:id',[validarJwt], updateById);
//guardar recetas
router.get('/:id/recetas-guardadas', [validarJwt], getRecetasGuardadas);
router.post('/save', [validarJwt], save);
router.post('/unsave', [validarJwt], unsave);

// Followers
router.get('/seguidos/:id', getSeguidos);
router.get('/seguidores/:id', [validarJwt], getSeguidores);
router.post('/seguir', [validarJwt], seguirUsuario);
router.delete('/:seguidorId/dejar-de-seguir/:usuarioId', [validarJwt], dejarDeSeguir);

module.exports = router;
