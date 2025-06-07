import express from 'express';
import { loginController } from '../controllers/controladorlogin.js';
import { validatorHandler } from '../midleware/validator.handler.js';
import { loginSchema } from '../validators/loginValidarDTO.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Endpoints para iniciar sesión
 */

/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Autenticación]
 *     description: Permite a un cliente autenticarse usando email y contraseña.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "sofi@alfibras.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso, devuelve el token y los datos del usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     nombre:
 *                       type: string
 *                     email:
 *                       type: string
 *                     rol:
 *                       type: string
 *       400:
 *         description: Contraseña incorrecta
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', validatorHandler(loginSchema, 'body'), loginController);

export default router;
