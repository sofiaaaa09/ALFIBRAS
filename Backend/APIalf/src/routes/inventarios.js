import express from "express";
import {
  crearInventario,
  obtenerInventarios,
  obtenerInventarioPorId,
  actualizarInventario,
  borrarInventario,
} from "../controllers/controladorinventario.js";

const routes = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Inventario:
 *       type: object
 *       properties:
 *         producto:
 *           type: string
 *           description: El producto mantiene un solo inventario
 *         stock:
 *           type: number
 *           description: Cantidad de productos disponibles
 *         stock_min:
 *           type: number
 *           description: Nivel mínimo de stock
 *         stock_max:
 *           type: number
 *           description: Nivel máximo de stock
 *       required:
 *         - producto
 *         - stock
 *         - stock_min
 *         - stock_max
 *       example:
 *         producto: Puerta
 *         stock: 50
 *         stock_min: 10
 *         stock_max: 200
 */

/**
 * @swagger
 * /api/inventarios:
 *   post:
 *     summary: Crea un nuevo inventario
 *     tags: [inventarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inventario'
 *     responses:
 *       200:
 *         description: Inventario creado exitosamente
 */
routes.post("/inventarios", crearInventario);

/**
 * @swagger
 * /api/inventarios:
 *   get:
 *     summary: Obtiene todos los inventarios
 *     tags: [inventarios]
 *     responses:
 *       200:
 *         description: Lista de inventarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Inventario'
 */
routes.get("/inventarios", obtenerInventarios);

/**
 * @swagger
 * /api/inventarios/{id}:
 *   get:
 *     summary: Obtiene un inventario por ID
 *     tags: [inventarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del inventario
 *     responses:
 *       200:
 *         description: Información del inventario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inventario'
 */
routes.get("/inventarios/:id", obtenerInventarioPorId);

/**
 * @swagger
 * /api/inventarios/{id}:
 *   put:
 *     summary: Actualiza un inventario por ID
 *     tags: [inventarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del inventario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inventario'
 *     responses:
 *       200:
 *         description: Inventario actualizado exitosamente
 */
routes.put("/inventarios/:id", actualizarInventario);

/**
 * @swagger
 * /api/inventarios/{id}:
 *   delete:
 *     summary: Elimina un inventario por ID
 *     tags: [inventarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del inventario
 *     responses:
 *       200:
 *         description: Inventario eliminado exitosamente
 *       404:
 *         description: Inventario no encontrado
 */
routes.delete("/inventarios/:id", borrarInventario);

export default routes;
