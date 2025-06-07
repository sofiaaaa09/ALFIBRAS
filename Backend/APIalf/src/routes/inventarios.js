import express from "express";
import {
  crearInventario,
  obtenerInventarios,
  obtenerInventarioPorId,
  actualizarInventario,
  borrarInventario,
} from "../controllers/controladorinventario.js";
import { verificarToken, soloAdmin } from "../midleware/auth.js";

const routes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Inventarios
 *   description: Endpoints para la gestión de inventarios (solo admin)
 */

/**
 * @swagger
 * /api/inventarios:
 *   post:
 *     summary: Crear un nuevo inventario
 *     tags: [Inventarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inventario'
 *     responses:
 *       201:
 *         description: Inventario creado
 */
routes.post("/", verificarToken, soloAdmin, crearInventario);

/**
 * @swagger
 * /api/inventarios:
 *   get:
 *     summary: Obtener todos los inventarios
 *     tags: [Inventarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de inventarios
 */
routes.get("/", verificarToken, soloAdmin, obtenerInventarios);

/**
 * @swagger
 * /api/inventarios/{id}:
 *   get:
 *     summary: Obtener inventario por ID
 *     tags: [Inventarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del inventario
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inventario encontrado
 *       404:
 *         description: Inventario no encontrado
 */
routes.get("/:id", verificarToken, soloAdmin, obtenerInventarioPorId);

/**
 * @swagger
 * /api/inventarios/{id}:
 *   put:
 *     summary: Actualizar inventario
 *     tags: [Inventarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inventario'
 *     responses:
 *       200:
 *         description: Inventario actualizado
 */
routes.put("/:id", verificarToken, soloAdmin, actualizarInventario);

/**
 * @swagger
 * /api/inventarios/{id}:
 *   delete:
 *     summary: Eliminar inventario
 *     tags: [Inventarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inventario eliminado
 */
routes.delete("/:id", verificarToken, soloAdmin, borrarInventario);

export default routes;
