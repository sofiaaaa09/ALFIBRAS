import express from "express";
import {
  crearCarrito,
  obtenerCarritos,
  obtenerCarritoPorId,
  actualizarCarrito,
  borrarCarrito,
} from "../controllers/controladorcarrito.js";

const routes = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Carrito:
 *       type: object
 *       properties:
 *         cliente_id:
 *           type: string
 *           description: ID del cliente que posee el carrito
 *         estado:
 *           type: string
 *           enum: [pendiente, procesando, finalizado, cancelado]
 *           description: Estado del carrito
 *       required:
 *         - cliente_id
 *         - estado
 *       example:
 *         cliente_id: "6011"
 *         estado: "pendiente"
 */

/**
 * @swagger
 * /api/carritos:
 *   post:
 *     summary: Crea un nuevo carrito
 *     tags: [Carritos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Carrito'
 *     responses:
 *       200:
 *         description: Carrito creado exitosamente
 */
routes.post("/", crearCarrito);

/**
 * @swagger
 * /api/carritos:
 *   get:
 *     summary: Obtiene todos los carritos
 *     tags: [Carritos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de carritos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Carrito'
 */
routes.get("/", obtenerCarritos);

/**
 * @swagger
 * /api/carritos/{id}:
 *   get:
 *     summary: Obtiene un carrito por ID
 *     tags: [Carritos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Información del carrito obtenida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Carrito'
 *       404:
 *         description: Carrito no encontrado
 */
routes.get("/:id", obtenerCarritoPorId);

/**
 * @swagger
 * /api/carritos/{id}:
 *   put:
 *     summary: Actualiza un carrito por ID
 *     tags: [Carritos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Carrito'
 *     responses:
 *       200:
 *         description: Carrito actualizado exitosamente
 *       404:
 *         description: Carrito no encontrado
 */
routes.put("/:id", actualizarCarrito);

/**
 * @swagger
 * /api/carritos/{id}:
 *   delete:
 *     summary: Elimina un carrito por ID
 *     tags: [Carritos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Carrito eliminado exitosamente
 *       404:
 *         description: Carrito no encontrado
 */
routes.delete("/:id", borrarCarrito);

export default routes;
