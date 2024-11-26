import express from "express";
import {
  crearAdmin,
  obtenerAdmins,
  obtenerAdminPorId,
  actualizarAdmin,
  borrarAdmin,
} from "../controllers/controladoradmin.js";  

const routes = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre del administrador
 *         email:
 *           type: string
 *           description: Correo electrónico del administrador
 *         telefono:
 *           type: string
 *           description: Número de teléfono del administrador
 *       required:
 *         - nombre
 *         - email
 *         - telefono
 *       example:
 *         nombre: "Carlos"
 *         email: "carlos@example.com"
 *         telefono: "123456789"
 */

/**
 * @swagger
 * /api/admins:
 *   post:
 *     summary: Crea un nuevo administrador
 *     tags: [admins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Admin'
 *     responses:
 *       200:
 *         description: Administrador creado exitosamente
 */
routes.post("/admins", crearAdmin);

/**
 * @swagger
 * /api/admins:
 *   get:
 *     summary: Obtiene todos los administradores
 *     tags: [admins]
 *     responses:
 *       200:
 *         description: Lista de administradores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Admin'
 */
routes.get("/admins", obtenerAdmins);

/**
 * @swagger
 * /api/admins/{id}:
 *   get:
 *     summary: Obtiene un administrador por ID
 *     tags: [admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del administrador
 *     responses:
 *       200:
 *         description: Información del administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 */
routes.get("/admins/:id", obtenerAdminPorId);

/**
 * @swagger
 * /api/admins/{id}:
 *   put:
 *     summary: Actualiza un administrador por ID
 *     tags: [admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del administrador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Admin'
 *     responses:
 *       200:
 *         description: Administrador actualizado
 */
routes.put("/admins/:id", actualizarAdmin);

/**
 * @swagger
 * /api/admins/{id}:
 *   delete:
 *     summary: Elimina un administrador por ID
 *     tags: [admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del administrador
 *     responses:
 *       200:
 *         description: Administrador eliminado
 *       404:
 *         description: Administrador no encontrado
 */
routes.delete("/admins/:id", borrarAdmin);

export default routes;
