import express from "express";
import {
  crearOrden,
  obtenerOrdenes,
  obtenerOrdenPorId,
  actualizarOrden,
  borrarOrden,
} from "../controllers/controladororden.js";
import {
  createOrdenSchema,
  getOrdenParamsSchema,
  updateOrdenSchema,
  deleteOrdenSchema,
} from "../validators/ordenValidarDTO.js";
import { validatorHandler } from "../midleware/validator.handler.js";
import { verificarToken, soloAdmin } from "../midleware/auth.js";

const routes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Órdenes
 *   description: Endpoints para la gestión de órdenes (admin)
 */

/**
 * @swagger
 * /api/ordenes:
 *   post:
 *     summary: Crear una nueva orden
 *     tags: [Órdenes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cliente_correo:
 *                 type: string
 *                 format: email
 *               estado:
 *                 type: string
 *                 example: pendiente
 *               fecha:
 *                 type: string
 *                 format: date
 *               detalles:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - cliente_correo
 *               - estado
 *               - fecha
 *               - detalles
 *             example:
 *               cliente_correo: cliente@example.com
 *               estado: pendiente
 *               fecha: 2025-04-15
 *               detalles: ["661d64d23264d33cdd8e188e", "661d64d23264d33cdd8e188f"]
 *     responses:
 *       201:
 *         description: Orden creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
routes.post(
  "/",
  verificarToken,
  soloAdmin,
  validatorHandler(createOrdenSchema, "body"),
  crearOrden
);

/**
 * @swagger
 * /api/ordenes:
 *   get:
 *     summary: Obtener todas las órdenes
 *     tags: [Órdenes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de órdenes
 *       500:
 *         description: Error del servidor
 */
routes.get("/", verificarToken, soloAdmin, obtenerOrdenes);

/**
 * @swagger
 * /api/ordenes/{id}:
 *   get:
 *     summary: Obtener una orden por ID
 *     tags: [Órdenes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la orden
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Orden encontrada
 *       404:
 *         description: Orden no encontrada
 *       500:
 *         description: Error del servidor
 */
routes.get(
  "/:id",
  verificarToken,
  soloAdmin,
  validatorHandler(getOrdenParamsSchema, "params"),
  obtenerOrdenPorId
);

/**
 * @swagger
 * /api/ordenes/{id}:
 *   put:
 *     summary: Actualizar una orden por ID
 *     tags: [Órdenes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la orden
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cliente_correo:
 *                 type: string
 *                 format: email
 *               estado:
 *                 type: string
 *               total:
 *                 type: number
 *               fecha:
 *                 type: string
 *                 format: date
 *               detalles:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - cliente_correo
 *               - estado
 *               - total
 *               - fecha
 *               - detalles
 *     responses:
 *       200:
 *         description: Orden actualizada
 *       404:
 *         description: Orden no encontrada
 *       500:
 *         description: Error del servidor
 */
routes.put(
  "/:id",
  verificarToken,
  soloAdmin,
  validatorHandler(getOrdenParamsSchema, "params"),
  validatorHandler(updateOrdenSchema, "body"),
  actualizarOrden
);

/**
 * @swagger
 * /api/ordenes/{id}:
 *   delete:
 *     summary: Eliminar una orden por ID
 *     tags: [Órdenes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la orden
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Orden eliminada
 *       404:
 *         description: Orden no encontrada
 *       500:
 *         description: Error del servidor
 */
routes.delete(
  "/:id",
  verificarToken,
  soloAdmin,
  validatorHandler(deleteOrdenSchema, "params"),
  borrarOrden
);

export default routes;
