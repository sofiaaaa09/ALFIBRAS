import express from "express";
import {
  crearAdmin,
  obtenerAdmins,
  obtenerAdminPorId,
  actualizarAdmin,
  borrarAdmin,
  autenticarAdmin,
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
 *         password:
 *           type: string
 *           description: Contraseña del administrador
 *       required:
 *         - nombre
 *         - email
 *         - telefono
 *         - password
 *       example:
 *         nombre: "Carlos"
 *         email: "carlos@example.com"
 *         telefono: "123456789"
 *         password: "mi_contraseña_segura"
 */

/**
 * @swagger
 * tags:
 *   name: Administradores
 *   description: Gestión de administradores
 */

/**
 * @swagger
 * /api/admins:
 *   post:
 *     summary: Crea un nuevo administrador
 *     tags: [Administradores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Admin'
 *     responses:
 *       201:
 *         description: Administrador creado exitosamente
 *       500:
 *         description: Error al crear el administrador
 */
routes.post("/", crearAdmin);

/**
 * @swagger
 * /api/admins:
 *   get:
 *     summary: Obtiene todos los administradores
 *     tags: [Administradores]
 *     responses:
 *       200:
 *         description: Lista de administradores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Admin'
 *       500:
 *         description: Error al obtener los administradores
 */
routes.get("/", obtenerAdmins);

/**
 * @swagger
 * /api/admins/{id}:
 *   get:
 *     summary: Obtiene un administrador por ID
 *     tags: [Administradores]
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
 *       404:
 *         description: Administrador no encontrado
 *       500:
 *         description: Error al obtener el administrador
 */
routes.get("/:id", obtenerAdminPorId);

/**
 * @swagger
 * /api/admins/{id}:
 *   put:
 *     summary: Actualiza un administrador por ID
 *     tags: [Administradores]
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
 *         description: Administrador actualizado correctamente
 *       404:
 *         description: Administrador no encontrado
 *       500:
 *         description: Error al actualizar el administrador
 */
routes.put("/:id", actualizarAdmin);

/**
 * @swagger
 * /api/admins/{id}:
 *   delete:
 *     summary: Elimina un administrador por ID
 *     tags: [Administradores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del administrador
 *     responses:
 *       200:
 *         description: Administrador eliminado correctamente
 *       404:
 *         description: Administrador no encontrado
 *       500:
 *         description: Error al eliminar el administrador
 */
routes.delete("/:id", borrarAdmin);

/**
 * @swagger
 * /api/admins/login:
 *   post:
 *     summary: Autentica un administrador
 *     tags: [Administradores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del administrador
 *               password:
 *                 type: string
 *                 description: Contraseña del administrador
 *             required:
 *               - email
 *               - password
 *             example:
 *               email: "admin@example.com"
 *               password: "mi_contraseña_segura"
 *     responses:
 *       200:
 *         description: Autenticación exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 admin:
 *                   $ref: '#/components/schemas/Admin'
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error en el proceso de autenticación
 */
routes.post("/login", autenticarAdmin);

export default routes;