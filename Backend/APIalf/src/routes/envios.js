import express from "express";
import {
  crearEnvio,
  obtenerEnvios,
  obtenerEnvioPorId,
  actualizarEnvio,
  borrarEnvio,
} from "../controllers/controladorenvio.js"; // Controlador de envíos

const routes = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Envio:
 *       type: object
 *       properties:
 *         orden_id:
 *           type: string
 *           description: ID de la orden relacionada con el envío
 *         direccion_envio:
 *           type: string
 *           description: Dirección donde se realizará el envío
 *         fecha_envio:
 *           type: string
 *           format: date
 *           description: Fecha del envío
 *         estado:
 *           type: string
 *           description: Estado del envío (pendiente, enviado, entregado, fallido)
 *       required:
 *         - orden_id
 *         - direccion_envio
 *         - fecha_envio
 *         - estado
 *       example:
 *         orden_id: "6005"
 *         direccion_envio: " Cl. 72 #10-34, Chapinero, Bogotá"
 *         fecha_envio: "2024-11-15"
 *         estado: "pendiente"
 */

/**
 * @swagger
 * /api/envios:
 *   post:
 *     summary: Crea un nuevo envío
 *     tags: [envios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Envio'
 *     responses:
 *       200:
 *         description: Envío creado exitosamente
 */
routes.post("/envios", crearEnvio);

/**
 * @swagger
 * /api/envios:
 *   get:
 *     summary: Obtiene todos los envíos
 *     tags: [envios]
 *     responses:
 *       200:
 *         description: Lista de envíos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Envio'
 */
routes.get("/envios", obtenerEnvios);

/**
 * @swagger
 * /api/envios/{id}:
 *   get:
 *     summary: Obtiene un envío por ID
 *     tags: [envios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del envío
 *     responses:
 *       200:
 *         description: Información del envío
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Envio'
 */
routes.get("/envios/:id", obtenerEnvioPorId);

/**
 * @swagger
 * /api/envios/{id}:
 *   put:
 *     summary: Actualiza un envío por ID
 *     tags: [envios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del envío
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Envio'
 *     responses:
 *       200:
 *         description: Envío actualizado
 */
routes.put("/envios/:id", actualizarEnvio);

/**
 * @swagger
 * /api/envios/{id}:
 *   delete:
 *     summary: Elimina un envío por ID
 *     tags: [envios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del envío
 *     responses:
 *       200:
 *         description: Envío eliminado
 *       404:
 *         description: Envío no encontrado
 */
routes.delete("/envios/:id", borrarEnvio);

export default routes;

