import { Router } from "express";
import { getUserRole, updateUserRole, resetPassword, createUser, getUserbyEmail, getUsers, updateUser, deleteUser, loginUser, initiateRegistration, verifyEmail, sendPasswordResetEmail, logout } from "../controllers/user.controller.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

router.post('/initiate-registration', initiateRegistration); // Iniciar el proceso de registro
router.get('/verify-email', verifyEmail); // Verificar el token de correo electrónico

router.post('/forgot-password', sendPasswordResetEmail); // Enviar correo electrónico de restablecimiento de contraseña
router.post('/reset-password', resetPassword); // Restablecer la contraseña

router.put('/:email', updateUser); // Se actualiza el usuario por email
router.put('/role/:id', updateUserRole); // Se actualiza el rol del usuario por ID

router.post('/register', createUser); // Se crea el usuario
router.get('/:email', getUserbyEmail); // Se obtiene el usuario por email
router.get('/', getUsers); // Se obtienen todos los usuarios
router.put('/:email', updateUser); // Se actualiza el usuario por email
router.delete('/:email', deleteUser); // Se elimina el usuario por email
router.post('/login', loginUser); // Ruta de inicio de sesión
router.post('/logout', logout)

router.get('/role/:id', getUserRole); // Nueva ruta para obtener el rol del usuario por ID

export default router;