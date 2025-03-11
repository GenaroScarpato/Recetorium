
const express = require('express')
const router = express.Router()
const {getTodos, getById, deleteById, updateById, add, addMany} = require("../controllers/ingredientes");
const { validarJwt, validarAdmin } = require('../middlewares/validation');

router.get('/', getTodos);
router.get('/all', getTodos);
router.get('/:id',[validarJwt], getById);
router.delete('/:id',[validarJwt,validarAdmin], deleteById);
router.put('/:id',[validarJwt,validarAdmin], updateById);
router.post('/', [validarJwt, validarAdmin], (req, res) => {
    if (Array.isArray(req.body)) {
        addMany(req, res); // Si el cuerpo es un array, llamar a addMany
    } else {
        add(req, res); // Si no, llamar a add
    }
});


module.exports = router;