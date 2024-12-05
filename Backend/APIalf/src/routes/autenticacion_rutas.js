import express from 'express';
import { login } from '../controladores/autenticacion_controlador.js';

const router = express.Router();

// Ruta de inicio de sesión
router.post('/login', login);

export default router;