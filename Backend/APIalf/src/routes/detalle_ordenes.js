import express from "express";
import {
  crearDetalleOrden,
  obtenerDetallesOrden,
  obtenerDetalleOrdenPorNumeroOrden,
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
 *           description: Número de la orden relacionada
 *         numero_producto:
 *           type: number
 *           description: Número único del producto relacionado
 *         cantidad:
 *           type: number
 *           description: Cantidad del producto
 *         precio_unitario:
 *           type: number
 *           description: Precio unitario del producto
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
 *     summary: Crear un nuevo detalle de orden
 *     tags: [DetallesOrden]
 *     security:
 *       - bearerAuth: []
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
 *     summary: Obtener todos los detalles de las órdenes
 *     tags: [DetallesOrden]
 *     security:
 *       - bearerAuth: []
 */
router.get("/", obtenerDetallesOrden);

/**
 * @swagger
 * /api/detalle_ordenes/{numero_orden}:
 *   get:
 *     summary: Obtener detalle de una orden por número de orden
 *     tags: [DetallesOrden]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/:numero_orden",
  validatorHandler(getDetalleOrdenParamsSchema, "params"),
  obtenerDetalleOrdenPorNumeroOrden
);

/**
 * @swagger
 * /api/detalle_ordenes/{id}:
 *   put:
 *     summary: Actualizar un detalle de orden por ID
 *     tags: [DetallesOrden]
 *     security:
 *       - bearerAuth: []
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
 *     summary: Eliminar un detalle de orden por ID
 *     tags: [DetallesOrden]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/:id",
  validatorHandler(deleteDetalleOrdenSchema, "params"),
  borrarDetalleOrden
);

export default router;
