import express from "express";
import {
  crearDetalleOrden,
  obtenerDetallesOrden,
  obtenerDetalleOrdenPorId,
  actualizarDetalleOrden,
  borrarDetalleOrden,
} from "../controllers/controladordetalle_orden.js";
import {
  createDetalleOrdenSchema,
  getDetalleOrdenParamsSchema,
  updateDetalleOrdenSchema,
  deleteDetalleOrdenSchema,
} from "../validators/detalleOrdenValidarDTO.js";
import { validatorHandler } from "../midleware/validator.handler.js";
import { verificarToken, soloAdmin } from "../midleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: DetallesOrden
 *   description: Endpoints para detalles de órdenes
 */

/**
 * @swagger
 * /api/detalle_ordenes:
 *   post:
 *     summary: Crear un nuevo detalle de orden (usuarios)
 *     tags: [DetallesOrden]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetalleOrden'
 *     responses:
 *       201:
 *         description: Detalle de orden creado
 *       400:
 *         description: Error en los datos
 */
router.post(
  "/",
  verificarToken,
  validatorHandler(createDetalleOrdenSchema, "body"),
  crearDetalleOrden
);

/**
 * @swagger
 * /api/detalle_ordenes:
 *   get:
 *     summary: Obtener todos los detalles de orden (admin)
 *     tags: [DetallesOrden]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de detalles de órdenes
 */
router.get("/", verificarToken, soloAdmin, obtenerDetallesOrden);

/**
 * @swagger
 * /api/detalle_ordenes/{id}:
 *   get:
 *     summary: Obtener un detalle de orden por ID
 *     tags: [DetallesOrden]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del detalle de orden
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalle encontrado
 *       404:
 *         description: No encontrado
 */
router.get(
  "/:id",
  verificarToken,
  validatorHandler(getDetalleOrdenParamsSchema, "params"),
  obtenerDetalleOrdenPorId
);

/**
 * @swagger
 * /api/detalle_ordenes/{id}:
 *   put:
 *     summary: Actualizar un detalle de orden (admin)
 *     tags: [DetallesOrden]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetalleOrden'
 *     responses:
 *       200:
 *         description: Detalle actualizado
 */
router.put(
  "/:id",
  verificarToken,
  soloAdmin,
  validatorHandler(getDetalleOrdenParamsSchema, "params"),
  validatorHandler(updateDetalleOrdenSchema, "body"),
  actualizarDetalleOrden
);

/**
 * @swagger
 * /api/detalle_ordenes/{id}:
 *   delete:
 *     summary: Eliminar un detalle de orden (admin)
 *     tags: [DetallesOrden]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalle eliminado
 */
router.delete(
  "/:id",
  verificarToken,
  soloAdmin,
  validatorHandler(deleteDetalleOrdenSchema, "params"),
  borrarDetalleOrden
);

export default router;
