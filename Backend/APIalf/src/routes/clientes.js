import express from "express";
import {
  actualizarCliente,
  borrarCliente,
  crearCliente,
  obtenerClientePorId,
  obtenerClientes,
} from "../controllers/controladorcliente.js";
import { verificarToken, soloAdmin } from "../midleware/auth.js";

const routes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Registro de usuarios y gestión de clientes (admin)
 */

/**
 * @swagger
 * /api/clientes:
 *   post:
 *     summary: Registrar un nuevo cliente (registro público)
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       201:
 *         description: Cliente creado correctamente
 *       400:
 *         description: Error en los datos de entrada
 */
routes.post("/", crearCliente);

/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: Obtener todos los clientes (solo admin)
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes
 *       403:
 *         description: Acceso denegado
 */
routes.get("/", verificarToken, soloAdmin, obtenerClientes);

/**
 * @swagger
 * /api/clientes/{id}:
 *   get:
 *     summary: Obtener un cliente por ID (solo admin)
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del cliente
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Cliente no encontrado
 */
routes.get("/:id", verificarToken, soloAdmin, obtenerClientePorId);

/**
 * @swagger
 * /api/clientes/{id}:
 *   put:
 *     summary: Actualizar un cliente (solo admin)
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del cliente
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       200:
 *         description: Cliente actualizado
 */
routes.put("/:id", verificarToken, soloAdmin, actualizarCliente);

/**
 * @swagger
 * /api/clientes/{id}:
 *   delete:
 *     summary: Eliminar un cliente (solo admin)
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del cliente
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente eliminado
 *       404:
 *         description: Cliente no encontrado
 */
routes.delete("/:id", verificarToken, soloAdmin, borrarCliente);

export default routes;

