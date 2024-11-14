import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import db from "./database/db.js"; // Se importa para conectar a la base de datos
import cookieParser from 'cookie-parser';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import path from 'path';
import { uploadCloudinary } from './functions/UploadCloudinary.js';

// Importaciones de rutas de la API
import userRoutes from './routes/user.routes.js'; // Se importa la ruta de usuario
import patientRoutes from './routes/patient.routes.js'

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
// Configuración específica de CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Reemplaza con el origen de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Permite el envío de cookies y credenciales
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configuración de ffmpeg-static
ffmpeg.setFfmpegPath(ffmpegStatic);

// Configuración de multer para la carga de archivos
const upload = multer({ dest: 'uploads/' });

// Endpoint para la conversión de archivos
app.post('/convert', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const inputPath = req.file.path;
  const outputPath = path.join(path.dirname(inputPath), `${path.parse(inputPath).name}.mp4`);

  ffmpeg(inputPath)
    .output(outputPath)
    .on('end', () => {
      uploadCloudinary(outputPath)
      res.download(outputPath, (err) => {
        if (err) {
          res.status(500).json({ error: 'Error al descargar el archivo.' });
        }
      });
    })
    .on('error', (err) => {
      res.status(500).send('Error during conversion: ' + err.message);
    })
    .run();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);

app.listen(PORT, () => {
  console.log('Server UP running in http://localhost:', PORT)
});