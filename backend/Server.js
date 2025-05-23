const fileUpload = require('express-fileupload'); // Para manejar la subida de archivos
const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors'); 
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
this.app.listen(this.port, '0.0.0.0', () => {
            console.log(`Server is listening on port ${this.port}`);
        });
    }

    cargarMiddlewares() {
        this.app.use(cors({
origin: (origin, callback) => {
    const allowlist = ['http://localhost:5173', 'http://192.168.0.231:5173'];
    if (!origin || allowlist.includes(origin)) {
        callback(null, true);
    } else {
        callback(new Error('Not allowed by CORS'));
    }
},
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
        this.app.use('/uploads', express.static('uploads'));

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
                console.log('✅ Conectado a la base de datos en el puerto', process.env.PORT);
            })
            .catch((err) => {
                console.error('❌ Error al conectar con la base de datos:', err.message);
            });
    }

}

module.exports = Server;