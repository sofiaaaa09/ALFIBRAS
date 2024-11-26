import express from "express";
import {
  crearCarrito,
  obtenerCarritos,
  obtenerCarritoPorId,
  actualizarCarrito,
  borrarCarrito,
} from "../controllers/controladorcarrito.js"; // Controlador de carritos

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
 *           description: Estado del carrito (pendiente, procesando, finalizado, cancelado)
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
 *     tags: [carritos]
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
routes.post("/carritos", crearCarrito);

/**
 * @swagger
 * /api/carritos:
 *   get:
 *     summary: Obtiene todos los carritos
 *     tags: [carritos]
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
routes.get("/carritos", obtenerCarritos);

/**
 * @swagger
 * /api/carritos/{id}:
 *   get:
 *     summary: Obtiene un carrito por ID
 *     tags: [carritos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Información del carrito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Carrito'
 */
routes.get("/carritos/:id", obtenerCarritoPorId);

/**
 * @swagger
 * /api/carritos/{id}:
 *   put:
 *     summary: Actualiza un carrito por ID
 *     tags: [carritos]
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
 *         description: Carrito actualizado
 */
routes.put("/carritos/:id", actualizarCarrito);

/**
 * @swagger
 * /api/carritos/{id}:
 *   delete:
 *     summary: Elimina un carrito por ID
 *     tags: [carritos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Carrito eliminado
 *       404:
 *         description: Carrito no encontrado
 */
routes.delete("/carritos/:id", borrarCarrito);

export default routes;
