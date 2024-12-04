import express from "express";
import {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoriaPorId,
  actualizarCategoria,
  borrarCategoria,
} from "../controllers/controladorcategoria.js";

const routes = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Categoria:
 *       type: object
 *       properties:
 *         nombre_categoria:
 *           type: string
 *           description: Nombre de la categoría
 *         descripcion:
 *           type: string
 *           description: Descripción de la categoría
 *         estado:
 *           type: string
 *           enum: [activo, inactivo]
 *           description: Estado de la categoría
 *       required:
 *         - nombre_categoria
 *         - descripcion
 *         - estado
 *       example:
 *         nombre_categoria: "Puertas"
 *         descripcion: "Categoría dedicada a productos puertas"
 *         estado: "activo"
 */

/**
 * @swagger
 * /api/categorias:
 *   post:
 *     summary: Crea una nueva categoría
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
 *       200:
 *         description: Categoría creada exitosamente
 */
routes.post("/", crearCategoria);

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Obtiene todas las categorías
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Categoria'
 */
routes.get("/", obtenerCategorias);

/**
 * @swagger
 * /api/categorias/{id}:
 *   get:
 *     summary: Obtiene una categoría por ID
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Información de la categoría obtenida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       404:
 *         description: Categoría no encontrada
 */
routes.get("/:id", obtenerCategoriaPorId);

/**
 * @swagger
 * /api/categorias/{id}:
 *   put:
 *     summary: Actualiza una categoría por ID
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Categoria'
 *     responses:
 *       200:
 *         description: Categoría actualizada exitosamente
 *       404:
 *         description: Categoría no encontrada
 */
routes.put("/:id", actualizarCategoria);

/**
 * @swagger
 * /api/categorias/{id}:
 *   delete:
 *     summary: Elimina una categoría por ID
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría eliminada exitosamente
 *       404:
 *         description: Categoría no encontrada
 */
routes.delete("/:id", borrarCategoria);

export default routes;
