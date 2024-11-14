import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import bycrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import TempUser from '../models/tempUser.model.js';
import ResetPasswordUser from '../models/resetPasswordUserModel.js';

export const createUser = async (req, res) => {
    try {
        const { name, lastname, email, password, role = 'Paciente' } = req.body;

        // Se verifica si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "El correo ya está registrado. Por favor, use otro." });
        }

        // Se encripta la contraseña del usuario y se crea el nuevo usuario
        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(password, salt);

        // Se crea el nuevo usuario
        const newUser = new User({ name, lastname, email, password: hashedPassword, role });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token);
        res.status(201).json({
            id: newUser._id,
            name: newUser.name,
            lastname: newUser.lastname,
            email: newUser.email,
            role: newUser.role,
        });

    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ message: "Error al crear el usuario", error: error.message });
    }
};

export const getUserbyEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error al obtener el usuario por email:', error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { email } = req.params;
        const updateData = req.body;

        const updatedUser = await User.findOneAndUpdate({ email }, updateData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({
            message: "Usuario actualizado exitosamente",
            user: updatedUser
        });

    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { email } = req.params;

        const deletedUser = await User.findOneAndDelete({ email });

        if (!deletedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({
            message: "Usuario eliminado exitosamente",
            user: deletedUser
        });
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Se verifica si el usuario existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Se verifica si la contraseña es correcta
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Usuario o contraseña incorrectos" });
        }

        // Se verifica si el rol coincide, excepto si el usuario es Admin
        if (user.role !== role && user.role !== 'Admin') {
            return res.status(403).json({ message: "Rol incorrecto. Por favor, contacte al administrador." });
        }

        // Se genera el token de autenticación para el usuario
        const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token);
        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        });

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const initiateRegistration = async (req, res) => {
    try {
        const { name, lastname, email, password, role = 'Medico' } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "El correo ya está registrado. Por favor, use otro." });
        }

        // Generar un token de verificación
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Guardar el token y los datos del usuario temporalmente (puedes usar una colección temporal en la base de datos)
        const tempUser = new TempUser({ name, lastname, email, password, role, verificationToken });
        await tempUser.save();

        // Configurar el transporte de nodemailer con OAuth2
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,

            },
            tls: {
                rejectUnauthorized: false, // Ignorar certificados autofirmados
            },
        });

        const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}`;

        // Enviar el correo de verificación
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verificación de correo electrónico',
            html: `<p>Por favor, haga clic en el siguiente enlace para verificar su correo electrónico:</p><p><a href="${verificationLink}">Verificar correo electrónico</a></p>`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Correo de verificación enviado. Por favor, revise su bandeja de entrada.' });
    } catch (error) {
        console.error('Error al iniciar el proceso de registro:', error);
        res.status(500).json({ message: "Error al iniciar el proceso de registro", error: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        // Buscar el usuario temporal por el token de verificación
        const tempUser = await TempUser.findOne({ verificationToken: token });
        if (!tempUser) {
            return res.status(400).json({ message: "Token de verificación inválido o expirado." });
        }

        // Crear el nuevo usuario
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(tempUser.password, salt);
        const newUser = new User({ name: tempUser.name, lastname: tempUser.lastname, email: tempUser.email, password: hashedPassword, role: tempUser.role });
        await newUser.save();

        // Eliminar el usuario temporal
        await TempUser.deleteOne({ _id: tempUser._id });

        res.status(201).json({ message: 'Correo verificado y usuario registrado exitosamente.' });
    } catch (error) {
        console.error('Error al verificar el correo electrónico:', error);
        res.status(500).json({ message: "Error al verificar el correo electrónico", error: error.message });
    }
};

export const sendPasswordResetEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'El correo no está registrado.' });
        }

        // Generar el token una sola vez
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Guardar el token en la base de datos
        const resetPasswordUser = new ResetPasswordUser({
            email: user.email,
            resetPasswordToken: resetToken,
            resetPasswordExpires: Date.now() + 3600000 // 1 hora
        });
        await resetPasswordUser.save();

        // Configurar el transporte de nodemailer
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        // Crear el enlace de restablecimiento de contraseña
        const resetLink = `http://localhost:3000/ResetPassword?token=${resetToken}`;

        // Configurar las opciones del correo
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Restablecimiento de contraseña',
            html: `<p>Por favor, haga clic en el siguiente enlace para restablecer su contraseña:</p><p><a href="${resetLink}">Restablecer contraseña</a></p>`,
        };

        // Enviar el correo
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Correo de restablecimiento de contraseña enviado. Por favor, revise su bandeja de entrada.' });
    } catch (error) {
        console.error('Error al enviar el correo de restablecimiento de contraseña:', error);
        res.status(500).json({ message: 'Error al enviar el correo de restablecimiento de contraseña', error: error.message });
    }
};



export const resetPassword = async (req, res) => {
    const { token, password } = req.body;

    console.log('Token recibido:', token);
    console.log('Contraseña recibida:', password);

    if (!token) {
        return res.status(400).json({ message: 'El token es requerido.' });
    }

    if (!password) {
        return res.status(400).json({ message: 'La contraseña no puede estar vacía.' });
    }

    try {
        const resetPasswordUser = await ResetPasswordUser.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!resetPasswordUser) {
            console.log('Usuario no encontrado o token expirado');
            return res.status(400).json({ message: 'Token no válido o expirado.' });
        }

        const user = await User.findOne({ email: resetPasswordUser.email });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        await ResetPasswordUser.deleteOne({ _id: resetPasswordUser._id });

        console.log('Contraseña restablecida con éxito para el usuario:', user._id);
        res.status(200).json({ message: 'Contraseña restablecida con éxito.' });
    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        res.status(500).json({ message: 'Error al restablecer la contraseña', error: error.message });
    }
};



//Zona de funciones de administrador

export const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        user.role = role;
        await user.save();

        res.status(200).json({ message: 'Rol actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el rol', error });
    }
};

export const getUserRole = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ role: user.role });
        console.log('Rol del usuario:', user.role);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logout = async (req, res) => {
    res.cookie('token', "", {
        expires: new Date(0),
    });
    return res.sendStatus(200);
}