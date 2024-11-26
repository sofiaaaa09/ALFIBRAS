import express from "express";
import {
  actualizarCategoria,
  borrarCategoria,
  crearCategoria,
  obtenerCategoriaPorId,
  obtenerCategorias,
} from "../controllers/controladorcategoria.js"; // Cambié el controlador a controladorCategoria.js

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
 *           description: Estado de la categoría (activo o inactivo)
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
 *     tags: [categorias]
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
routes.post("/categorias", crearCategoria);

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Obtiene todas las categorías
 *     tags: [categorias]
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
routes.get("/categorias", obtenerCategorias);

/**
 * @swagger
 * /api/categorias/{id}:
 *   get:
 *     summary: Obtiene una categoría por ID
 *     tags: [categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Información de la categoría
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 */
routes.get("/categorias/:id", obtenerCategoriaPorId);

/**
 * @swagger
 * /api/categorias/{id}:
 *   put:
 *     summary: Actualiza una categoría por ID
 *     tags: [categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Categoria'
 *     responses:
 *       200:
 *         description: Categoría actualizada
 */
routes.put("/categorias/:id", actualizarCategoria);

/**
 * @swagger
 * /api/categorias/{id}:
 *   delete:
 *     summary: Elimina una categoría por ID
 *     tags: [categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría eliminada
 *       404:
 *         description: Categoría no encontrada
 */
routes.delete("/categorias/:id", borrarCategoria);

export default routes;