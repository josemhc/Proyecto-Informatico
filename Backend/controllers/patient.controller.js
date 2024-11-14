import Patient from "../models/patient.model.js";
import User from "../models/user.model.js"; // Asegúrate de importar el modelo de User
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { uploadFiles } from "../functions/s3.js";
import exp from "constants";

export const getPatients = async (req, res) => {
    const patients = await Patient.find({
        medico: req.user.id
    }).populate('medico');
    console.log(patients);
    res.json(patients);
};

export const getPatientbyEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await Patient.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Paciente no encontrado" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error al obtener el Paciente por email:', error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const createPatient = async (req, res) => {
    try {
        const { name, lastname, email, password } = req.body;

        const existingPatient = await Patient.findOne({ email });
        if (existingPatient) {
            return res.status(400).json({ message: "El paciente ya existe" });
        }

        // Se encripta la contraseña del paciente y se crea el nuevo usuario
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newPatient = new Patient({
            name,
            lastname,
            email,
            password: hashedPassword,
            medico: req.user.id,
            role: 'Paciente'
        });

        const savedPatient = await newPatient.save();

        // Crear el usuario en la colección users
        const newUser = new User({
            name,
            lastname,
            email,
            password: hashedPassword,
            role: 'Paciente'
        });

        await newUser.save();

        // Configuración del transporte de correo
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false, // Ignorar certificados autofirmados
            },
        });

        // Configuración del correo
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Confirmación de registro',
            text: `Querido paciente del médico ${req.user.name},\n\nSe ha creado su cuenta en la aplicación de manera correcta.\n\nEstos son sus datos:\nNombre: ${name} ${lastname}\nEmail: ${email}\n\nSaludos,\nEquipo de EcoMed4D`
        };

        // Enviar el correo
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error al enviar el correo:', error);
            } else {
                console.log('Correo enviado:', info.response);
            }
        });

        res.status(201).json(savedPatient);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el paciente", error });
    }
};

export const deletePatient = async (req, res) => {
    const { email } = req.params;
    const patientFound = await Patient.findOneAndDelete({ email });
    if (!patientFound) return res.status(404).json({ message: "Paciente no encontrado" });
    return res.status(204).json({
        message: "Paciente eliminado",
        name: patientFound.name,
        email: patientFound.email,
    });
};

export const sendFileEmail = async (req, res) => {
    const { patientId, patientName, patientEmail } = req.body;
    const files = req.files;

    if (!patientId || !files || !patientName || !patientEmail) {
        return res.status(400).json({ message: 'Faltan datos necesarios' });
    }

    try {
        // Almacenar archivos
        const fileUrls = await uploadFiles(files, patientId);

        // Actualizar el paciente con las URLs en la base de datos
        await Patient.findByIdAndUpdate(patientId, {
            $push: { fileUrls: { $each: fileUrls } } // Agrega las URLs al arreglo existente
        });

        // Configura el transportador de nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false, // Ignorar certificados autofirmados
            },
        });

        // Configura el correo electrónico
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: patientEmail,
            subject: 'Archivo adjunto',
            html: `
                <p>Hola <strong>${patientName}</strong>,</p>
                <p>Por favor, encuentra el/los archivo(s) adjunto(s).</p>
                <p>Saludos,</p>
                <p><strong>Equipo de EcoMed4D</strong></p>
            `,
            attachments: files.map(file => ({
                filename: file.originalname,
                path: file.path,
            })),
        };

        // Envía el correo electrónico
        await transporter.sendMail(mailOptions);

        // Elimina los archivos después de enviarlos
        files.forEach(file => fs.unlinkSync(file.path));

        res.status(200).json({ message: 'Correo enviado exitosamente' });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ message: 'Error al enviar el correo' });
    }
};

export const loginPatient = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Se verifica si el paciente ya existe
        const patient = await Patient.findOne({ email });

        if (!patient) {
            return res.status(404).json({ message: "Paciente no encontrado, puede continuar" });
        }

        // Se verifica si la contraseña es correcta
        const validPassword = await bcrypt.compare(password, patient.password);

        if (!validPassword) {
            return res.status(400).json({ message: "Usuario o contraseña incorrectos" });
        }

        const token = jwt.sign({ id: patient._id, email: patient.email, name: patient.name }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Se crea el token de acceso
        res.cookie('token', token);
        res.status(201).json({
            id: patient._id,
            name: patient.name,
            email: patient.email,
            token
        });

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: "Error interno del servidor: " });
    }
};