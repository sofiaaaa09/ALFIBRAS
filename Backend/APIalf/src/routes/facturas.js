import express from "express";
import {
  crearFactura,
  obtenerFacturas,
  obtenerFacturaPorId,
  actualizarFactura,
  borrarFactura,
} from "../controllers/controladorfactura.js"; // Controlador de factura

const routes = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Factura:
 *       type: object
 *       properties:
 *         orden_id:
 *           type: string
 *           description: ID de la orden relacionada
 *         fecha:
 *           type: string
 *           format: date
 *           description: Fecha de la factura
 *         total:
 *           type: number
 *           description: Total de la factura
 *       required:
 *         - orden_id
 *         - fecha
 *         - total
 *       example:
 *         orden_id: "12345"
 *         fecha: "2024-11-15"
 *         total: 500.000
 */

/**
 * @swagger
 * /api/facturas:
 *   post:
 *     summary: Crea una nueva factura
 *     tags: [Facturas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Factura'
 *     responses:
 *       201:
 *         description: Factura creada exitosamente
 */
routes.post("/", crearFactura);

/**
 * @swagger
 * /api/facturas:
 *   get:
 *     summary: Obtiene todas las facturas
 *     tags: [Facturas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de facturas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Factura'
 */
routes.get("/", obtenerFacturas);

/**
 * @swagger
 * /api/facturas/{id}:
 *   get:
 *     summary: Obtiene una factura por ID
 *     tags: [Facturas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la factura
 *     responses:
 *       200:
 *         description: Factura encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Factura'
 *       404:
 *         description: Factura no encontrada
 */
routes.get("/:id", obtenerFacturaPorId);

/**
 * @swagger
 * /api/facturas/{id}:
 *   put:
 *     summary: Actualiza una factura por ID
 *     tags: [Facturas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la factura
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Factura'
 *     responses:
 *       200:
 *         description: Factura actualizada correctamente
 *       404:
 *         description: Factura no encontrada
 */
routes.put("/:id", actualizarFactura);

/**
 * @swagger
 * /api/facturas/{id}:
 *   delete:
 *     summary: Elimina una factura por ID
 *     tags: [Facturas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la factura
 *     responses:
 *       200:
 *         description: Factura eliminada correctamente
 *       404:
 *         description: Factura no encontrada
 */
routes.delete("/:id", borrarFactura);

export default routes;
