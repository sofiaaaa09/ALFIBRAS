import express from "express";
import {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoriaPorId,
  actualizarCategoria,
  borrarCategoria,
} from "../controllers/controladorcategoria.js";
import {
  createCategoriaSchema,
  updateCategoriaSchema,
  getCategoriaParamsSchema,
} from "../validators/categoriaValidarDTO.js";
import { validatorHandler } from "../midleware/validator.handler.js";
import { verificarToken, soloAdmin } from "../midleware/auth.js";

const routes = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Categoria:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *         descripcion:
 *           type: string
 *         estado:
 *           type: string
 *           enum: [activo, inactivo]
 *       required:
 *         - nombre
 *         - estado
 */

/**
 * @swagger
 * /api/categorias:
 *   post:
 *     summary: Crear una nueva categoría
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Categoria'
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *       400:
 *         description: Datos inválidos
 */
routes.post(
  "/",
  verificarToken,
  soloAdmin,
  validatorHandler(createCategoriaSchema, "body"),
  crearCategoria
);

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Obtener todas las categorías
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
routes.get("/", verificarToken, soloAdmin, obtenerCategorias);

/**
 * @swagger
 * /api/categorias/{id}:
 *   get:
 *     summary: Obtener una categoría por ID
 *     tags: [Categorías]
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
 *         description: Categoría encontrada
 *       404:
 *         description: Categoría no encontrada
 */
routes.get(
  "/:id",
  verificarToken,
  soloAdmin,
  validatorHandler(getCategoriaParamsSchema, "params"),
  obtenerCategoriaPorId
);

/**
 * @swagger
 * /api/categorias/{id}:
 *   put:
 *     summary: Actualizar una categoría por ID
 *     tags: [Categorías]
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
 *             $ref: '#/components/schemas/Categoria'
 *     responses:
 *       200:
 *         description: Categoría actualizada
 *       404:
 *         description: Categoría no encontrada
 */
routes.put(
  "/:id",
  verificarToken,
  soloAdmin,
  validatorHandler(getCategoriaParamsSchema, "params"),
  validatorHandler(updateCategoriaSchema, "body"),
  actualizarCategoria
);

/**
 * @swagger
 * /api/categorias/{id}:
 *   delete:
 *     summary: Eliminar una categoría por ID
 *     tags: [Categorías]
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
 *         description: Categoría eliminada
 *       404:
 *         description: Categoría no encontrada
 */
routes.delete(
  "/:id",
  verificarToken,
  soloAdmin,
  validatorHandler(getCategoriaParamsSchema, "params"),
  borrarCategoria
);

export default routes;
