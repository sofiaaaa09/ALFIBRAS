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

const routes = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Orden:
 *       type: object
 *       properties:
 *         cliente_correo:
 *           type: string
 *           description: Correo del cliente que realiza la orden
 *         fecha:
 *           type: string
 *           format: date
 *           description: Fecha de la orden
 *         estado:
 *           type: string
 *           description: Estado de la orden (pendiente, enviado, entregado)
 *         total:
 *           type: number
 *           description: Total de la orden
 *         detalles:
 *           type: array
 *           items:
 *             type: string
 *             description: ID de los detalles de la orden
 *       required:
 *         - cliente_correo
 *         - fecha
 *         - estado
 *         - total
 *         - detalles
 *       example:
 *         cliente_correo: "cliente@example.com"
 *         fecha: "2024-11-13"
 *         estado: "pendiente"
 *         total: 250.50
 *         detalles: ["6456d3e2c39f7a4e8b5f1234", "6456d3e2c39f7a4e8b5f5678"]
 */

/**
 * @swagger
 * /api/ordenes:
 *   post:
 *     summary: Crea una nueva orden
 *     tags: [Órdenes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Orden'
 *     responses:
 *       201:
 *         description: Orden creada exitosamente
 */
routes.post(
  "/",
  validatorHandler(createOrdenSchema, "body"),
  crearOrden
);

/**
 * @swagger
 * /api/ordenes:
 *   get:
 *     summary: Obtiene todas las órdenes
 *     tags: [Órdenes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de órdenes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Orden'
 */
routes.get("/", obtenerOrdenes);

/**
 * @swagger
 * /api/ordenes/{id}:
 *   get:
 *     summary: Obtiene una orden por ID
 *     tags: [Órdenes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden
 *     responses:
 *       200:
 *         description: Información de la orden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Orden'
 *       404:
 *         description: Orden no encontrada
 */
routes.get(
  "/:id",
  validatorHandler(getOrdenParamsSchema, "params"),
  obtenerOrdenPorId
);

/**
 * @swagger
 * /api/ordenes/{id}:
 *   put:
 *     summary: Actualiza una orden por ID
 *     tags: [Órdenes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Orden'
 *     responses:
 *       200:
 *         description: Orden actualizada exitosamente
 *       404:
 *         description: Orden no encontrada
 */
routes.put(
  "/:id",
  validatorHandler(getOrdenParamsSchema, "params"),
  validatorHandler(updateOrdenSchema, "body"),
  actualizarOrden
);

/**
 * @swagger
 * /api/ordenes/{id}:
 *   delete:
 *     summary: Elimina una orden por ID
 *     tags: [Órdenes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden
 *     responses:
 *       200:
 *         description: Orden eliminada exitosamente
 *       404:
 *         description: Orden no encontrada
 */
routes.delete(
  "/:id",
  validatorHandler(deleteOrdenSchema, "params"),
  borrarOrden
);

export default routes;
