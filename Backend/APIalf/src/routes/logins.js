// routes/auth.routes.js
import { validatorHandler } from '../midleware/validator.handler.js';
import { loginSchema } from '../validators/loginValidarDTO.js';
import { loginController } from '../controllers/controladorlogin.js';
import express from 'express';
import logins from '../models/logins.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión con credenciales de usuario
 *     description: Permite a un usuario autenticarse y obtener un token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "usuario@dominio.com"
 *               password:
 *                 type: string
 *                 example: "contraseña123"
 *     responses:
 *       200:
 *         description: Token JWT generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Error en la validación de los datos o contraseña incorrecta
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/", validatorHandler(loginSchema, "body"), loginController);




export default router;
