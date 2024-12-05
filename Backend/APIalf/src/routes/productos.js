import express from "express";
import {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  actualizarProducto,
  borrarProducto,
} from "../controllers/controladorproducto.js";
import {
  createProductoSchema,
  getProductoParamsSchema,
  updateProductoSchema,
  deleteProductoSchema,
} from "../validators/productoValidarDTO.js";
import { validatorHandler } from "../midleware/validator.handler.js";

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
 *         numero_producto:
 *           type: number
 *           description: Número único del producto
 *       required:
 *         - nombre
 *         - descripcion
 *         - precio
 *         - categoria
 *         - cantidad_inicial
 *         - stock_min
 *         - stock_max
 *         - numero_producto
 *       example:
 *         nombre: "Puerta corrediza"
 *         descripcion: "Puerta tráfico corrediza"
 *         precio: 120000
 *         categoria: "Puertas"
 *         cantidad_inicial: 12
 *         stock_min: 10
 *         stock_max: 100
 *         numero_producto: 101
 */

/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Crea un nuevo producto
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 */
routes.post(
  "/",
  validatorHandler(createProductoSchema, "body"),
  crearProducto
);

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Obtiene todos los productos
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
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
routes.get("/", obtenerProductos);

/**
 * @swagger
 * /api/productos/{id}:
 *   get:
 *     summary: Obtiene un producto por ID
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
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
routes.get(
  "/:id",
  validatorHandler(getProductoParamsSchema, "params"),
  obtenerProductoPorId
);

/**
 * @swagger
 * /api/productos/{id}:
 *   put:
 *     summary: Actualiza un producto por ID
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
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
routes.put(
  "/:id",
  validatorHandler(getProductoParamsSchema, "params"),
  validatorHandler(updateProductoSchema, "body"),
  actualizarProducto
);

/**
 * @swagger
 * /api/productos/{id}:
 *   delete:
 *     summary: Elimina un producto por ID
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 */
routes.delete(
  "/:id",
  validatorHandler(deleteProductoSchema, "params"),
  borrarProducto
);

export default routes;
