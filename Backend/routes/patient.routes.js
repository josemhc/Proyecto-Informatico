import { Router } from "express";

import { createPatient, getPatientbyEmail, getPatients, sendFileEmail, loginPatient } from "../controllers/patient.controller.js";

import { authRequired } from "../middlewares/validateToken.js";
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' });


router.get('/', authRequired, getPatients);
router.post('/', authRequired, createPatient);
router.get('/:email', getPatientbyEmail);
router.post('/send-file', authRequired, upload.array('files', 2), sendFileEmail);
router.post('/login', loginPatient); // Ruta de inicio de sesión

export default router;