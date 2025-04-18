const fileUpload = require('express-fileupload'); // Para manejar la subida de archivos
const cloudinary = require('./config/cloudinaryConfig'); // Importa la configuración de Cloudinary
const express = require('express');
const mongoose = require('mongoose');
const ingredientesRoutes = require('./routes/ingredientes');
const usuariosRoutes = require('./routes/usuarios');
const recetasRoutes = require('./routes/recetas');
const comentariosRoutes = require('./routes/comentarios');
const cors = require('cors'); // Asegúrate de instalarlo: npm install cors
const cookieParser = require('cookie-parser'); // Middleware para manejar cookies

class Server {
    constructor() {
        this.port = process.env.PORT;
        this.app = express();
        this.cargarMiddlewares();
        this.cargarRutas();
        this.conectarABD();
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is listening on port ${this.port}`);
        });
    }

    cargarMiddlewares() {
        this.app.use(cors({
            origin: 'http://localhost:5173', // Cambia este valor por la URL de tu frontend
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Métodos permitidos
            allowedHeaders: ['Content-Type', 'Authorization', 'x-token'], // Cabeceras permitidas
            credentials: true, // Permitir el envío de cookies
        }));
        this.app.use(express.json());
        this.app.use(cookieParser()); // Usar cookie-parser para manejar cookies
        this.app.use(fileUpload({
            useTempFiles: true, // Guarda los archivos en una ubicación temporal
            tempFileDir: './tmp/', // Carpeta temporal para guardar los archivos
        }));
    }

    cargarRutas() {
        this.app.use("/api/ingredientes", require('./routes/ingredientes'));
        this.app.use("/api/usuarios", require('./routes/usuarios'));
        this.app.use("/api", require('./routes/auth'));
        this.app.use("/api/recetas", require('./routes/recetas'));
        this.app.use("/api/comentarios", require('./routes/comentarios'));
    }

    conectarABD() {
        mongoose.connect(process.env.MONG_URI)
            .then(() => {
                console.log('Connecting to the database...', process.env.PORT);
            })
            .catch((err) => {
                console.log(`error connecting to the database ${err}`);
            });
    }
}

module.exports = Server;