const express = require('express');
const { login, verifyAuth, logout } = require('../controllers/auth'); // Importar las funciones correctamente
const router = express.Router();

// Rutas
router.post('/login', login);
router.get('/verify-auth', verifyAuth);
router.post('/logout', logout);

module.exports = router;