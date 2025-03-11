const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models/usuarioModel');

const validarJwt = async (req, res, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'Necesita  logearse para realizar esta acción'
        });
    }

    try {
        // Verificar el token
        const {id} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        if (!id) {
            return res.status(401).json({
                msg: 'Token no válido - No se encontró un _id en el token'
            });
        }        
        const usuario = await Usuario.findById({ _id: id });
        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe en la DB'
            });
        }

        // Pasar el usuario verificado al request para utilizarlo en otras rutas
        req.usuario = usuario;

        next();

    } catch (error) {
        res.status(401).json({
            msg: 'Token no válido'
        });
    }
};


const validarAdmin = async(req, resp, next) => {
    const usuario = req.usuario;     

        if (usuario.role === "ADMIN") {
            next();
        } else {
            resp.status(401).json({
                msg: "No tenes permisos de Administrador"
            })
        }
}

module.exports = {
    validarJwt,
    validarAdmin
}