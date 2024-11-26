import express from "express";
import {
  crearOrden,
  obtenerOrdenes,
  obtenerOrdenPorId,
  actualizarOrden,
  borrarOrden,
} from "../controllers/controladororden.js";  // Controlador de órdenes

const routes = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Orden:
 *       type: object
 *       properties:
 *         cliente_id:
 *           type: string
 *           description: ID del cliente que realiza la orden
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
 *       required:
 *         - cliente_id
 *         - fecha
 *         - estado
 *         - total
 *       example:
 *         cliente_id: "6"
 *         fecha: "2024-11-13"
 *         estado: "pendiente"
 *         total: 250.500
 */

/**
 * @swagger
 * /api/ordenes:
 *   post:
 *     summary: Crea una nueva orden
 *     tags: [ordenes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Orden'
 *     responses:
 *       200:
 *         description: Orden creada exitosamente
 */
routes.post("/ordenes", crearOrden);

/**
 * @swagger
 * /api/ordenes:
 *   get:
 *     summary: Obtiene todas las ordenes
 *     tags: [ordenes]
 *     responses:
 *       200:
 *         description: Lista de ordenes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Orden'
 */
routes.get("/ordenes", obtenerOrdenes);

/**
 * @swagger
 * /api/ordenes/{id}:
 *   get:
 *     summary: Obtiene una orden por ID
 *     tags: [ordenes]
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
 */
routes.get("/ordenes/:id", obtenerOrdenPorId);

/**
 * @swagger
 * /api/ordenes/{id}:
 *   put:
 *     summary: Actualiza una orden por ID
 *     tags: [ordenes]
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
 *         description: Orden actualizada
 */
routes.put("/ordenes/:id", actualizarOrden);

/**
 * @swagger
 * /api/ordenes/{id}:
 *   delete:
 *     summary: Elimina una orden por ID
 *     tags: [ordenes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden
 *     responses:
 *       200:
 *         description: Orden eliminada
 *       404:
 *         description: Orden no encontrada
 */
routes.delete("/ordenes/:id", borrarOrden);

export default routes;
