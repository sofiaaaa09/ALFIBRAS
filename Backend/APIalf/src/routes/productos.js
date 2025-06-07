import express from "express";
import {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  actualizarProducto,
  borrarProducto
} from "../controllers/controladorproducto.js";
import {
  createProductoSchema,
  getProductoParamsSchema,
  updateProductoSchema,
} from "../validators/productoValidarDTO.js";
import { validatorHandler } from "../midleware/validator.handler.js";
import { verificarToken, soloAdmin } from "../midleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Crear un nuevo producto
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
router.post(
  "/",
  verificarToken,
  soloAdmin,
  validatorHandler(createProductoSchema, "body"),
  crearProducto
);

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos
 */
router.get("/", verificarToken, obtenerProductos);

/**
 * @swagger
 * /api/productos/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Productos]
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
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 */
router.get(
  "/:id",
  verificarToken,
  soloAdmin,
  validatorHandler(getProductoParamsSchema, "params"),
  obtenerProductoPorId
);

/**
 * @swagger
 * /api/productos/{id}:
 *   put:
 *     summary: Actualizar un producto por ID
 *     tags: [Productos]
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
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 */
router.put(
  "/:id",
  verificarToken,
  soloAdmin,
  validatorHandler(getProductoParamsSchema, "params"),
  validatorHandler(updateProductoSchema, "body"),
  actualizarProducto
);

/**
 * @swagger
 * /api/productos/{id}:
 *   delete:
 *     summary: Eliminar un producto por ID
 *     tags: [Productos]
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
 *         description: Producto eliminado
 */
router.delete(
  "/:id",
  verificarToken,
  soloAdmin,
  validatorHandler(getProductoParamsSchema, "params"),
  borrarProducto
);

export default router;
