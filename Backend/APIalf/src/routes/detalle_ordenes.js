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

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     DetalleOrden:
 *       type: object
 *       properties:
 *         numero_orden:
 *           type: string
 *           description: Número de la orden relacionada.
 *         numero_producto:
 *           type: number
 *           description: Número único del producto relacionado.
 *         producto_nombre:
 *           type: string
 *           description: Nombre del producto relacionado. (Campo opcional, calculado automáticamente).
 *         categoria_nombre:
 *           type: string
 *           description: Nombre de la categoría del producto relacionado. (Campo opcional, calculado automáticamente).
 *         cantidad:
 *           type: number
 *           description: Cantidad del producto.
 *         precio_unitario:
 *           type: number
 *           description: Precio unitario del producto.
 *         personalizacion:
 *           type: string
 *           description: Descripción personalizada para el producto.
 *         archivo:
 *           type: string
 *           description: Ruta del archivo relacionado con la personalización.
 *       required:
 *         - numero_orden
 *         - numero_producto
 *         - cantidad
 *         - precio_unitario
 */

/**
 * @swagger
 * /api/detalle_ordenes:
 *   post:
 *     summary: Crear un nuevo detalle de orden.
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
 *         description: Detalle de orden creado con éxito.
 *       400:
 *         description: Datos inválidos en la solicitud.
 *       500:
 *         description: Error interno del servidor.
 */
router.post(
  "/",
  validatorHandler(createDetalleOrdenSchema, "body"),
  crearDetalleOrden
);

/**
 * @swagger
 * /api/detalle_ordenes:
 *   get:
 *     summary: Obtener todos los detalles de las órdenes.
 *     tags: [DetallesOrden]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de detalles de órdenes.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/", obtenerDetallesOrden);

/**
 * @swagger
 * /api/detalle_ordenes/{numero_orden}:
 *   get:
 *     summary: Obtener detalle de una orden por número de orden.
 *     tags: [DetallesOrden]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: numero_orden
 *         required: true
 *         schema:
 *           type: string
 *         description: Número de orden a consultar.
 *     responses:
 *       200:
 *         description: Detalle de orden encontrado.
 *       404:
 *         description: No se encontraron detalles para el número de orden.
 *       500:
 *         description: Error interno del servidor.
 */
router.get(
  "/:id",
  validatorHandler(getDetalleOrdenParamsSchema, "params"),
  obtenerDetalleOrdenPorId 
);

/**
 * @swagger
 * /api/detalle_ordenes/{id}:
 *   put:
 *     summary: Actualizar un detalle de orden por ID.
 *     tags: [DetallesOrden]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del detalle de orden a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetalleOrden'
 *     responses:
 *       200:
 *         description: Detalle de orden actualizado exitosamente.
 *       404:
 *         description: Detalle de orden no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.put(
  "/:id",
  validatorHandler(getDetalleOrdenParamsSchema, "params"),
  validatorHandler(updateDetalleOrdenSchema, "body"),
  actualizarDetalleOrden
);

/**
 * @swagger
 * /api/detalle_ordenes/{id}:
 *   delete:
 *     summary: Eliminar un detalle de orden por ID.
 *     tags: [DetallesOrden]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del detalle de orden a eliminar.
 *     responses:
 *       200:
 *         description: Detalle de orden eliminado correctamente.
 *       404:
 *         description: Detalle de orden no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete(
  "/:id",
  validatorHandler(deleteDetalleOrdenSchema, "params"),
  borrarDetalleOrden
);

export default router;
