import express from "express";
import {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  actualizarProducto,
  borrarProducto,
} from "../controllers/controladorproducto.js";

const routes = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Producto:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre del producto
 *         descripcion:
 *           type: string
 *           description: Descripción del producto
 *         precio:
 *           type: number
 *           description: Precio del producto
 *         categoria:
 *           type: string
 *           description: Categoría del producto
 *         cantidad_inicial:
 *           type: number
 *           description: Cantidad inicial del producto
 *         stock_min:
 *           type: number
 *           description: Cantidad mínima
 *         stock_max:
 *           type: number
 *           description: Cantidad máxima
 *       required:
 *         - nombre
 *         - descripcion
 *         - precio
 *         - categoria
 *         - cantidad_inicial
 *         - stock_min
 *         - stock_max
 *       example:
 *         nombre: "Puerta corrediza"
 *         descripcion: "Puerta tráfico corrediza"
 *         precio: 120000
 *         categoria: "Puertas"
 *         cantidad_inicial: 12
 *         stock_min: 10
 *         stock_max: 100
 */

/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Crea un nuevo producto
 *     tags: [productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       200:
 *         description: Producto creado exitosamente
 */
routes.post("/productos", crearProducto);

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Obtiene todos los productos
 *     tags: [productos]
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 */
routes.get("/productos", obtenerProductos);

/**
 * @swagger
 * /api/productos/{id}:
 *   get:
 *     summary: Obtiene un producto por ID
 *     tags: [productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Información del producto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 */
routes.get("/productos/:id", obtenerProductoPorId);

/**
 * @swagger
 * /api/productos/{id}:
 *   put:
 *     summary: Actualiza un producto por ID
 *     tags: [productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       200:
 *         description: Producto actualizado
 */
routes.put("/productos/:id", actualizarProducto);

/**
 * @swagger
 * /api/productos/{id}:
 *   delete:
 *     summary: Elimina un producto por ID
 *     tags: [productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado
 *       404:
 *         description: Producto no encontrado
 */
routes.delete("/productos/:id", borrarProducto);

export default routes;
